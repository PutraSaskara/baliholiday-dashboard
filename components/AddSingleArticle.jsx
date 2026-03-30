"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useArticleStore from '../stores/useArticleStore';
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';

function AddSingleArticle() {
  const { draftArticle, setDraftArticle, hasUnsavedChanges } = useArticleStore();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    keywords: ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Pre-fill form with draft data on mount (avoid hydration mismatch)
  useEffect(() => {
    setMounted(true);
    if (draftArticle) {
      setFormData(draftArticle);
      setIsSaved(true); // If they already saved the draft, allow them to proceed
    }
  }, [draftArticle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
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
        <header className="mb-10">
            <h1 className='text-3xl font-black tracking-tight text-gray-900 mb-2'>Create New Article</h1>
            <p className="text-gray-500 text-lg">Let&apos;s start with the basics. Enter the title, keywords, and author.</p>
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
    </div>
  );
}

export default AddSingleArticle