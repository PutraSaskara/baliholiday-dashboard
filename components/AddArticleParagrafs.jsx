"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useArticleStore from '../stores/useArticleStore';
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';

function AddArticleParagrafs() {
  const {
    articles: tourOptions, 
    fetchArticles, 
    setDraftParagraph, 
    draftArticle,
    draftParagraph,
    hasUnsavedChanges 
  } = useArticleStore();
  
  const [formData, setFormData] = useState({
    paragraf1: '',
    titleparagraf2: '',
    paragraf2: '',
    link2: '',
    titleparagraf3: '',
    paragraf3: '',
    link3: '',
    titleparagraf4: '',
    paragraf4: '',
    link4: '',
    titleparagraf5: '',
    paragraf5: '',
    link5: '',
    titleparagraf6: '',
    paragraf6: '',
    link6: '',
    titleparagraf7: '',
    paragraf7: '',
    link7: '',
    Conclusion: '',
    blogId: ''
  });

  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useWarnIfUnsavedChanges(hasUnsavedChanges);

  useEffect(() => {
    setMounted(true);
    // Pre-fill form with draft data
    if (draftParagraph) {
        setFormData(draftParagraph);
        setIsSaved(true);
    }
    // Only fetch existing articles if we're not currently making a draft
    if (!draftArticle) {
        fetchArticles();
    }
  }, [fetchArticles, draftArticle, draftParagraph]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!draftArticle && !formData.blogId) {
       alert("Please choose a Blog Post to associate these paragraphs with.");
       return;
    }

    // Save to Zustand Draft memory instead of calling API
    setDraftParagraph(formData);

    console.log('Draft Paragraph saved locally:', formData);
    alert('Draft Paragraph saved locally. Please proceed to the final step!');
    setIsSaved(true);
  };

  if (!mounted) {
      return null; // Avoid hydration mismatch
  }

  return (
    <div className='max-w-4xl mx-auto py-10 px-4'>
      {/* Wizard Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 2 of 3</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Content & Paragraphs</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"></div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 transition-all duration-300">
        <header className="mb-10">
            <h1 className='text-3xl font-black tracking-tight text-gray-900 mb-2'>Article Content</h1>
            <p className="text-gray-500 text-lg italic">
                Tip: Use paragraphs to break down your article into readable sections.
            </p>
        </header>

        {/* Draft Mode Notice */}
        {draftArticle && (
            <div className="mb-10 p-5 rounded-3xl bg-blue-50/50 border border-blue-100/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                    <h4 className="text-blue-900 font-bold">Draft Mode Active</h4>
                    <p className="text-blue-700/80 text-sm">Assigning paragraphs to "{draftArticle.title}"</p>
                </div>
            </div>
        )}

        {!draftArticle && (
            <div className="mb-10 group">
                <label htmlFor="blogId" className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 group-focus-within:text-blue-600 transition-colors">Select Blog Post</label>
                <select 
                    id="blogId" 
                    name="blogId" 
                    value={formData.blogId} 
                    onChange={handleChange} 
                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-semibold appearance-none cursor-pointer shadow-sm"
                >
                    <option value="">Choose a Blog Post...</option>
                    {tourOptions.map(blog => (
                        <option key={blog?.id} value={blog?.id}>{blog?.title}</option>
                    ))}
                </select>
            </div>
        )}

        <div className="space-y-12">
            {/* Paragraph 1 (Introduction) */}
            <div className="group p-6 bg-gray-50/30 rounded-3xl border border-gray-100 hover:border-blue-200/50 transition-all">
                <label htmlFor="paragraf1" className="block mb-3 text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Introduction (Paragraph 1)</label>
                <textarea 
                    id="paragraf1" 
                    name="paragraf1" 
                    value={formData.paragraf1} 
                    onChange={handleChange} 
                    placeholder="Enter the introduction..."
                    className="w-full px-6 py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium min-h-[160px] resize-none shadow-sm"
                />
            </div>

            {/* Dynamic Paragraphs 2-7 */}
            {[...Array(6)].map((_, index) => (
                <div key={index + 2} className="group p-8 bg-gray-50/30 rounded-[2rem] border border-gray-100 space-y-6 hover:shadow-xl hover:shadow-gray-100/50 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">{index + 2}</span>
                        <h4 className="font-black text-gray-800 uppercase tracking-tighter">Section {index + 2}</h4>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="group">
                            <label className="block mb-2 text-xs font-bold text-gray-500 uppercase ml-1">Section Title</label>
                            <input 
                                type="text"
                                name={`titleparagraf${index + 2}`}
                                value={formData[`titleparagraf${index + 2}`]}
                                onChange={handleChange}
                                placeholder="Enter sub-heading title..."
                                className="w-full px-6 py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold shadow-sm"
                            />
                        </div>
                        
                        <div className="group">
                            <label className="block mb-2 text-xs font-bold text-gray-500 uppercase ml-1">Section Content</label>
                            <textarea 
                                name={`paragraf${index + 2}`}
                                value={formData[`paragraf${index + 2}`]}
                                onChange={handleChange}
                                placeholder="Enter paragraph content..."
                                className="w-full px-6 py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium min-h-[140px] resize-none shadow-sm"
                            />
                        </div>

                        <div className="group">
                            <label className="block mb-2 text-xs font-bold text-gray-500 uppercase ml-1">External Link (Optional)</label>
                            <input 
                                type="text"
                                name={`link${index + 2}`}
                                value={formData[`link${index + 2}`]}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full px-5 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-sm text-blue-600 placeholder:text-gray-300 italic shadow-inner"
                            />
                        </div>
                    </div>
                </div>
            ))}

            {/* Conclusion */}
            <div className="group p-6 bg-blue-50/30 rounded-3xl border border-blue-100 transition-all">
                <label htmlFor="Conclusion" className="block mb-3 text-sm font-bold text-blue-800 ml-1 uppercase tracking-wider">Conclusion</label>
                <textarea 
                    id="Conclusion" 
                    name="Conclusion" 
                    value={formData.Conclusion} 
                    onChange={handleChange} 
                    placeholder="Enter the conclusion..."
                    className="w-full px-6 py-4 bg-white border border-blue-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium min-h-[100px] resize-none shadow-sm"
                />
            </div>
        </div>

        <div className='mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4'>
            <button 
                type="button" 
                onClick={handleSubmit} 
                className="w-full sm:w-auto px-10 py-4 text-base font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
                {isSaved ? 'Draf Saved' : 'Save as Draf'}
            </button>

            {isSaved ? (
                <Link 
                    href={'/add-article/add-article-images'} 
                    className="w-full sm:w-auto px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-center shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all duration-200"
                >
                    Next to Final Step →
                </Link>
            ) : (
                <button 
                    disabled 
                    className="w-full sm:w-auto px-10 py-4 text-base font-bold text-gray-400 bg-gray-100 cursor-not-allowed rounded-2xl text-center"
                >
                    Next to Final Step →
                </button>
            )}
        </div>
      </div>
    </div>
  );
}

export default AddArticleParagrafs;
