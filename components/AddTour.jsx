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
    price1: '',
    pricenote1: '',
    price2: '',
    pricenote2: '',
    price3: '',
    pricenote3: '',
    keywords: ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useWarnIfUnsavedChanges(hasUnsavedTourChanges);

  // Pre-fill form on mount
  useEffect(() => {
    setMounted(true);
    if (draftTour) {
      setFormData(draftTour);
      setIsSaved(true);
    }
  }, [draftTour]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((num) => (
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