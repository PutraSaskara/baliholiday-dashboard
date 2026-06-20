"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useArticleStore from '../stores/useArticleStore';
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';
import AIAssistantModal from './AIAssistantModal';

function AddSingleArticle() {
  const { draftArticle, setDraftArticle, hasUnsavedChanges } = useArticleStore();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    author: '',
    keywords: '',
    tldr_summary: '',
    guide_insight_author: 'Putra Saskara',
    guide_insight_location: '',
    guide_insight_content: '',
    faq: '[]'
  });
  const [faqs, setFaqs] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Pre-fill form with draft data on mount (avoid hydration mismatch)
  useEffect(() => {
    setMounted(true);
    if (draftArticle) {
      setFormData(draftArticle);
      setIsSaved(true); // If they already saved the draft, allow them to proceed
      try {
        setFaqs(JSON.parse(draftArticle.faq || '[]'));
      } catch (e) {
        setFaqs([]);
      }
    }
  }, [draftArticle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
    setFormData(prev => ({
      ...prev,
      faq: JSON.stringify(newFaqs)
    }));
  };

  const addFaq = () => {
    const newFaqs = [...faqs, { question: "", answer: "" }];
    setFaqs(newFaqs);
    setFormData(prev => ({
      ...prev,
      faq: JSON.stringify(newFaqs)
    }));
  };

  const removeFaq = (index) => {
    const newFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(newFaqs);
    setFormData(prev => ({
      ...prev,
      faq: JSON.stringify(newFaqs)
    }));
  };

  // Warn user if they try to leave with unsaved changes
  useWarnIfUnsavedChanges(hasUnsavedChanges);

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title || !formData.author) {
      alert("Please fill in Title and Author.");
      return;
    }

    // Save to Zustand Draft memory instead of calling API
    setDraftArticle(formData);
    
    console.log('Draft Article saved locally:', formData);
    alert('Draft Article saved locally. Please proceed to the next step!');
    setIsSaved(true);
  };

  const handleApplyAI = (generatedData) => {
    const updatedForm = { ...formData };
    if (generatedData.keywords) updatedForm.keywords = generatedData.keywords;
    if (generatedData.tldr_summary) updatedForm.tldr_summary = generatedData.tldr_summary;
    if (generatedData.guide_insight_location) updatedForm.guide_insight_location = generatedData.guide_insight_location;
    if (generatedData.guide_insight_content) updatedForm.guide_insight_content = generatedData.guide_insight_content;
    
    if (generatedData.faq && Array.isArray(generatedData.faq)) {
       updatedForm.faq = JSON.stringify(generatedData.faq);
       setFaqs(generatedData.faq);
    }
    
    setFormData(updatedForm);
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch on initial render
  }

  return (
    <div className='max-w-4xl mx-auto py-10 px-4'>
      {/* Wizard Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 1 of 3</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Basic Info</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"></div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 transition-all duration-300">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className='text-3xl font-black tracking-tight text-gray-900 mb-2'>Create New Article</h1>
              <p className="text-gray-500 text-lg">Let&apos;s start with the basics. Enter the title, keywords, and author.</p>
            </div>
            <button 
              onClick={() => setIsAIModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
            >
              <span className="text-xl">✨</span> Review & AI Auto-fill
            </button>
        </header>

        <div className="space-y-8">
            <div className="group">
                <label htmlFor="title" className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-blue-600">Article Title</label>
                <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    placeholder="Enter a catchy title..."
                    value={formData.title} 
                    onChange={handleChange} 
                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none text-lg font-medium placeholder:text-gray-400 shadow-sm"
                />
            </div>

            <div className="group">
                <label htmlFor="slug" className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-blue-600">Custom URL Slug (Optional)</label>
                <input 
                    type="text" 
                    id="slug" 
                    name="slug" 
                    placeholder="Leave empty to auto-generate from title"
                    value={formData.slug} 
                    onChange={handleChange} 
                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium placeholder:text-gray-400 shadow-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                    <label htmlFor="keywords" className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-blue-600">Keywords (SEO)</label>
                    <input 
                        type="text" 
                        id="keywords" 
                        name="keywords" 
                        placeholder="e.g. Bali, Travel, Beach"
                        value={formData.keywords} 
                        onChange={handleChange} 
                        className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium placeholder:text-gray-400 shadow-sm"
                    />
                </div>

                <div className="group">
                    <label htmlFor="author" className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-blue-600">Author Name</label>
                    <input 
                        type="text" 
                        id="author" 
                        name="author" 
                        placeholder="Your name or organization"
                        value={formData.author} 
                        onChange={handleChange} 
                        className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium placeholder:text-gray-400 shadow-sm"
                    />
                </div>
            </div>

            {/* GEO Optimization & Local Insights */}
            <div className="border-t border-gray-100 pt-8 space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 ml-1">
                    <span>🌴</span> GEO Optimization & Local Insights (Optional)
                </h3>
                <div className="group">
                    <label htmlFor="tldr_summary" className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-blue-600">Quick Summary (TL;DR)</label>
                    <textarea 
                        id="tldr_summary" 
                        name="tldr_summary" 
                        placeholder="A concise 2-3 sentence summary of the article..."
                        value={formData.tldr_summary || ''} 
                        onChange={handleChange} 
                        rows={3}
                        className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium placeholder:text-gray-400 shadow-sm resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group">
                        <label htmlFor="guide_insight_author" className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-blue-600">Local Guide Name</label>
                        <input 
                            type="text" 
                            id="guide_insight_author" 
                            name="guide_insight_author" 
                            placeholder="Putra Saskara"
                            value={formData.guide_insight_author || ''} 
                            onChange={handleChange} 
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium placeholder:text-gray-400 shadow-sm"
                        />
                    </div>
                    <div className="group">
                        <label htmlFor="guide_insight_location" className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-blue-600">Expertise / Location Context</label>
                        <input 
                            type="text" 
                            id="guide_insight_location" 
                            name="guide_insight_location" 
                            placeholder="e.g. Ubud Tours Expert"
                            value={formData.guide_insight_location || ''} 
                            onChange={handleChange} 
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium placeholder:text-gray-400 shadow-sm"
                        />
                    </div>
                </div>

                <div className="group">
                    <label htmlFor="guide_insight_content" className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-blue-600">Authentic Guide Content / Tips</label>
                    <textarea 
                        id="guide_insight_content" 
                        name="guide_insight_content" 
                        placeholder="Authentic, first-hand tips or advice from the guide..."
                        value={formData.guide_insight_content || ''} 
                        onChange={handleChange} 
                        rows={3}
                        className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium placeholder:text-gray-400 shadow-sm resize-none"
                    />
                </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="border-t border-gray-100 pt-8 space-y-6">
                <div className="flex items-center justify-between ml-1">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span>❓</span> Frequently Asked Questions (Optional)
                    </h3>
                    <button 
                        type="button" 
                        onClick={addFaq}
                        className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-all shadow-sm"
                    >
                        + Add FAQ Item
                    </button>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-200 space-y-4 relative">
                            <button 
                                type="button" 
                                onClick={() => removeFaq(index)}
                                className="absolute top-4 right-4 text-xs font-bold text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                            <div className="group">
                                <label className="block mb-2 text-xs font-bold text-gray-500">Question #{index + 1}</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Is Kusamba Salt Farm worth visiting?"
                                    value={faq.question} 
                                    onChange={(e) => handleFaqChange(index, 'question', e.target.value)} 
                                    className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-sm font-medium shadow-sm"
                                />
                            </div>
                            <div className="group">
                                <label className="block mb-2 text-xs font-bold text-gray-500">Answer</label>
                                <textarea 
                                    placeholder="Answer..."
                                    value={faq.answer} 
                                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} 
                                    rows={2}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-sm font-medium shadow-sm resize-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className='mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4'>
            <button 
                type="button" 
                onClick={handleSubmit} 
                className="w-full sm:w-auto px-10 py-4 text-base font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
                {isSaved ? 'Draf Saved' : 'Save as Draf'}
            </button>

            {isSaved ? (
                <Link 
                    href={'/add-article/add-article-paragrafs'} 
                    className="w-full sm:w-auto px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-center shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all duration-200"
                >
                    Continue to Paragraphs →
                </Link>
            ) : (
                <button 
                    disabled 
                    className="w-full sm:w-auto px-10 py-4 text-base font-bold text-gray-400 bg-gray-100 cursor-not-allowed rounded-2xl text-center"
                >
                    Continue to Paragraphs →
                </button>
            )}
        </div>
      </div>
      
      <AIAssistantModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        mode="add"
        targetSection="article"
        drafts={{ ...formData }}
        onApply={handleApplyAI}
      />
    </div>
  );
}

export default AddSingleArticle