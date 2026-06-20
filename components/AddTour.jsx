"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useTourStore from '../stores/useTourStore';
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';

function AddTour() {
  const { 
    draftTour, 
    setDraftTour, 
    hasUnsavedTourChanges 
  } = useTourStore();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    price1: '',
    pricenote1: '',
    price2: '',
    pricenote2: '',
    price3: '',
    pricenote3: '',
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

  useWarnIfUnsavedChanges(hasUnsavedTourChanges);

  // Pre-fill form on mount
  useEffect(() => {
    setMounted(true);
    if (draftTour) {
      setFormData(draftTour);
      setIsSaved(true);
      try {
        setFaqs(JSON.parse(draftTour.faq || '[]'));
      } catch (e) {
        setFaqs([]);
      }
    }
  }, [draftTour]);

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

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title || !formData.price1) {
      alert("Please fill in at least Tour Title and Tour Price 1.");
      return;
    }

    setDraftTour(formData);
    
    console.log('Draft Tour saved locally:', formData);
    alert('Draft Tour saved locally. Please proceed to the next step!');
    setIsSaved(true);
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className='max-w-4xl mx-auto py-10 px-4'>
      {/* Wizard Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 1 of 6</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Basic Package Info</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="w-[16.66%] h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"></div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 transition-all duration-300">
        <header className="mb-10">
            <h1 className='text-3xl font-black tracking-tight text-gray-900 mb-2'>Create New Tour</h1>
            <p className="text-gray-500 text-lg">Define the name, multiple price tiers, and SEO keywords.</p>
        </header>

        <div className="space-y-10">
            <div className="group">
                <label htmlFor="title" className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-blue-600">Tour Title</label>
                <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    placeholder="e.g. Stunning Monkey Forest Tour"
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

            <div className="group">
                <label htmlFor="keywords" className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-blue-600">Keywords (SEO)</label>
                <input 
                    type="text" 
                    id="keywords" 
                    name="keywords" 
                    placeholder="Ubud, Nature, Culture"
                    value={formData.keywords} 
                    onChange={handleChange} 
                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium placeholder:text-gray-400 shadow-sm"
                />
            </div>

            <div className="space-y-6">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2 ml-1">Pricing Tiers</h4>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mx-1">
                  <p className="text-xs text-amber-800 font-medium">⚠️ PayPal fee: ~4.4% + $0.30 per transaction. If you set $50, you&apos;ll receive ~$47.50. Consider adjusting your price to cover the fee.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((num) => {
                        const priceVal = parseFloat(formData[`price${num}`]) || 0;
                        const fee = priceVal > 0 ? (priceVal * 0.044 + 0.30).toFixed(2) : null;
                        const netAmount = fee ? (priceVal - parseFloat(fee)).toFixed(2) : null;
                        return (
                        <div key={num} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 space-y-4 hover:bg-white hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">{num}</span>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">Price Tier {num}</span>
                            </div>
                            
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">$</span>
                                <input 
                                    type="number" 
                                    name={`price${num}`}
                                    placeholder="0"
                                    value={formData[`price${num}`]} 
                                    onChange={handleChange} 
                                    className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-sm shadow-sm"
                                />
                            </div>

                            <input 
                                type="text" 
                                name={`pricenote${num}`}
                                placeholder="Note (e.g. Per Person)"
                                value={formData[`pricenote${num}`]} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-[11px] placeholder:text-gray-300 shadow-sm"
                            />
                            {fee && (
                              <p className="text-[10px] text-gray-400">Fee: -${fee} → You receive: <span className="font-bold text-green-600">${netAmount}</span></p>
                            )}
                        </div>
                        );
                    })}
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
                        placeholder="A concise 2-3 sentence summary of the tour..."
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
                    href={'/add-tour-package/add-tour-detail'} 
                    className="w-full sm:w-auto px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-center shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all duration-200"
                >
                    Continue to Details →
                </Link>
            ) : (
                <button 
                    disabled 
                    className="w-full sm:w-auto px-10 py-4 text-base font-bold text-gray-400 bg-gray-100 cursor-not-allowed rounded-2xl text-center"
                >
                    Continue to Details →
                </button>
            )}
        </div>
      </div>
    </div>
  );
}

export default AddTour