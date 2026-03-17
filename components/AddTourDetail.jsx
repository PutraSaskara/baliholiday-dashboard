"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useTourStore from '../stores/useTourStore';
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';

function AddTourDetail() {
  const { 
    tours: tourOptions, 
    fetchTours, 
    draftTour,
    draftTourDetail,
    setDraftTourDetail,
    hasUnsavedTourChanges
  } = useTourStore();

  const [formData, setFormData] = useState({
    detail1: '',
    detail2: '',
    detail3: '',
    detail4: '',
    detail5: '',
    detail6: '',
    detail7: '',
    detail8: '',
    detail9: '',
    tourId: ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useWarnIfUnsavedChanges(hasUnsavedTourChanges);

  useEffect(() => {
    setMounted(true);
    if (draftTourDetail) {
        setFormData(draftTourDetail);
        setIsSaved(true);
    }
    if (!draftTour) {
        fetchTours();
    }
  }, [fetchTours, draftTour, draftTourDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!draftTour && !formData.tourId) {
      alert("Please choose a Tour Title to associate these details with.");
      return;
    }

    setDraftTourDetail(formData);
    
    console.log('Draft Detail saved locally:', formData);
    alert('Draft Detail saved locally. Please proceed to the next step!');
    setIsSaved(true);
  };


  return (
    <div className='max-w-4xl mx-auto py-10 px-4'>
      {/* Wizard Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 2 of 6</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Package Highlights & Details</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="w-[33.33%] h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"></div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 transition-all duration-300">
        <header className="mb-10">
            <h1 className='text-3xl font-black tracking-tight text-gray-900 mb-2'>Tour Details</h1>
            <p className="text-gray-500 text-lg">Add the key features and highlights that make this tour special.</p>
        </header>

        {/* Draft Mode Notice */}
        {draftTour && (
            <div className="mb-10 p-5 rounded-3xl bg-blue-50/50 border border-blue-100/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                    <h4 className="text-blue-900 font-bold">Draft Mode Active</h4>
                    <p className="text-blue-700/80 text-sm">Assigning details to "{draftTour.title}"</p>
                </div>
            </div>
        )}

        {!draftTour && (
            <div className="mb-10 group">
                <label htmlFor="tourId" className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 group-focus-within:text-blue-600 transition-colors">Select Target Tour</label>
                <select 
                    id="tourId" 
                    name="tourId" 
                    value={formData.tourId} 
                    onChange={handleChange} 
                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-semibold appearance-none cursor-pointer shadow-sm"
                >
                    <option value="">Choose a Tour Package...</option>
                    {tourOptions.map(tour => (
                        <option key={tour?.id} value={tour?.id}>{tour?.title}</option>
                    ))}
                </select>
            </div>
        )}

        <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2 ml-1">Key Highlights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(9)].map((_, index) => (
                    <div key={index} className="group flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-gray-100/50 transition-all duration-300">
                        <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">{index + 1}</span>
                        <input 
                            type="text" 
                            name={`detail${index + 1}`}
                            placeholder={`Detail highlight #${index + 1}`}
                            value={formData[`detail${index + 1}`]} 
                            onChange={handleChange} 
                            className="w-full bg-transparent text-gray-900 outline-none font-medium placeholder:text-gray-300"
                        />
                    </div>
                ))}
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
                    href={'/add-tour-package/add-tour-desc'} 
                    className="w-full sm:w-auto px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-center shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all duration-200"
                >
                    Continue to Descriptions →
                </Link>
            ) : (
                <button 
                    disabled 
                    className="w-full sm:w-auto px-10 py-4 text-base font-bold text-gray-400 bg-gray-100 cursor-not-allowed rounded-2xl text-center"
                >
                    Continue to Descriptions →
                </button>
            )}
        </div>
      </div>
    </div>
  );
}

export default AddTourDetail;
