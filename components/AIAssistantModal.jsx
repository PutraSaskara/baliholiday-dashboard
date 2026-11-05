import React, { useState, useEffect } from 'react';
import SearchableModelDropdown from './SearchableModelDropdown';
import { ALLOWED_AI_MODELS, DEFAULT_AI_MODEL } from '../lib/aiModels';

export default function AIAssistantModal({ 
  isOpen, 
  onClose, 
  mode, // 'add' or 'edit'
  tourId, // required if edit tour
  blogId, // required if edit article
  targetSection, // e.g. 'tour', 'detail', 'desc', 'article', 'article-paragraphs'
  drafts, // In Add mode: the full state. In Edit mode: the current form state
  onApply 
}) {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('defaultAIModel');
      // Only accept a saved default that is on the server-side allowlist.
      if (saved && ALLOWED_AI_MODELS.includes(saved)) return saved;
      return DEFAULT_AI_MODEL;
    }
    return DEFAULT_AI_MODEL;
  });
  const [defaultSavedVisible, setDefaultSavedVisible] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setPreviewData(null);
    setError(null);

    const fetchModels = async () => {
      try {
        setLoadingModels(true);
        const res = await fetch('https://openrouter.ai/api/v1/models');
        const data = await res.json();
        
        if (data && data.data) {
          const allModels = data.data.map(m => m.id);
          // Only models on the server allowlist (lib/aiModels.js) can be used —
          // the API routes reject anything else with 400.
          const sortedModels = ALLOWED_AI_MODELS.filter(m => allModels.includes(m));
          const availableModels = sortedModels.length > 0 ? sortedModels : [...ALLOWED_AI_MODELS];
          setModels(availableModels);
          
          const savedDefault = localStorage.getItem('defaultAIModel');
          if (savedDefault && availableModels.includes(savedDefault)) {
            setSelectedModel(savedDefault);
          } else if (availableModels.length > 0 && !availableModels.includes(selectedModel)) {
            setSelectedModel(availableModels[0]);
          }
        } else {
          setModels([...ALLOWED_AI_MODELS]);
        }
      } catch (err) {
        console.error('Failed to fetch OpenRouter models', err);
        // Fall back to the static allowlist so the dropdown stays usable.
        setModels([...ALLOWED_AI_MODELS]);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSetDefault = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('defaultAIModel', selectedModel);
      setDefaultSavedVisible(true);
      setTimeout(() => setDefaultSavedVisible(false), 3000);
    }
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const payload = {
        model: selectedModel,
        mode,
        tourId,
        blogId,
        targetSection,
      };

      if (mode === 'add') {
         payload.drafts = drafts; // Whole store drafts
      } else {
         payload.currentSectionData = drafts; // Just the current form
      }

      const res = await fetch('/api/generate-global', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        let errMsg = 'Failed to generate content. The server might have timed out.';
        try {
          const text = await res.text();
          try {
            const errData = JSON.parse(text);
            errMsg = errData.error || errData.details || errMsg;
          } catch(e) {
            if (res.status === 504) {
              errMsg = 'Server Timeout (504): The AI took too long to respond. This is common on shared hosting. Try again or use a faster model like Gemini Flash.';
            } else {
              errMsg = `Server Error (${res.status}): The server returned an invalid response.`;
            }
          }
        } catch(e) {
          errMsg = `Server Error (${res.status})`;
        }
        throw new Error(errMsg);
      }

      const generatedData = await res.json();
      setPreviewData(generatedData);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (previewData) {
      onApply(previewData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">✨</span> Global AI Editor
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {mode === 'add' 
                ? "The AI will read ALL your drafts and fill missing fields across the entire tour."
                : `The AI is reading the full tour from the database to perfectly generate the missing ${targetSection} fields.`}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 p-2 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Top Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-end bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
            <div className="flex-1 w-full relative">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Select AI Model
                </label>
                <button
                  onClick={handleSetDefault}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded transition-colors"
                >
                  {defaultSavedVisible ? "✓ Saved" : "Set as Default"}
                </button>
              </div>
              <SearchableModelDropdown 
                models={models} 
                value={selectedModel} 
                onChange={setSelectedModel} 
                disabled={loadingModels || isGenerating}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || loadingModels}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap h-[42px]"
            >
              {isGenerating ? 'Generating Context...' : '✨ Auto-Fill Empty Fields'}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Generated Content Preview */}
          <div className="grid grid-cols-1 gap-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Fields generated by AI:</h3>
            
            {!previewData && !isGenerating && (
                <div className="py-8 text-center text-gray-400 italic text-sm">
                    Click the generate button above to see what the AI creates.
                </div>
            )}

            {isGenerating && (
                <div className="py-8 text-center text-blue-500 font-bold text-sm animate-pulse">
                    AI is analyzing the global context and writing...
                </div>
            )}

            {previewData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    {/* Render everything returned dynamically since we have many fields across sections */}
                    {Object.entries(previewData).map(([key, val]) => {
                        if (key === 'faq') return null; // handle separately
                        return (
                            <div key={key} className="space-y-1">
                                <span className="text-xs font-bold text-gray-500 uppercase">{key.replace(/_/g, ' ')}</span>
                                <div className="text-sm p-3 bg-white rounded-lg border border-gray-200 min-h-[48px] text-green-700 font-medium">
                                    {val}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {previewData?.faq && Array.isArray(previewData.faq) && (
                <div className="space-y-2 mt-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Generated FAQs</span>
                    <div className="space-y-2">
                    {previewData.faq.map((f, i) => (
                        <div key={i} className="p-3 bg-green-50/50 border border-green-200 rounded-lg">
                        <p className="text-sm font-bold text-green-900">Q: {f.question}</p>
                        <p className="text-sm text-green-800 mt-1">A: {f.answer}</p>
                        </div>
                    ))}
                    </div>
                </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!previewData}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply Changes & Close
          </button>
        </div>

      </div>
    </div>
  );
}
