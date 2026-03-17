"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useTourStore from '../stores/useTourStore';
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';

function AddTourPlan() {
  const { 
    tours: tourOptions, 
    fetchTours, 
    draftTour,
    draftTourPlan,
    setDraftTourPlan,
    hasUnsavedTourChanges
  } = useTourStore();

  const [formData, setFormData] = useState({
    title1: '',
    coordinatesleft1: '',
    coordinatesright1: '',
    description1: '',
    link1: '',
    title2: '',
    coordinatesleft2: '',
    coordinatesright2: '',
    description2: '',
    link2: '',
    title3: '',
    coordinatesleft3: '',
    coordinatesright3: '',
    description3: '',
    link3: '',
    title4: '',
    coordinatesleft4: '',
    coordinatesright4: '',
    description4: '',
    link4: '',
    title5: '',
    coordinatesleft5: '',
    coordinatesright5: '',
    description5: '',
    link5: '',
    title6: '',
    coordinatesleft6: '',
    coordinatesright6: '',
    description6: '',
    link6: '',
    title7: '',
    coordinatesleft7: '',
    coordinatesright7: '',
    description7: '',
    link7: '',
    title8: '',
    coordinatesleft8: '',
    coordinatesright8: '',
    description8: '',
    link8: '',
    title9: '',
    coordinatesleft9: '',
    coordinatesright9: '',
    description9: '',
    link9: '',
    tourId: ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useWarnIfUnsavedChanges(hasUnsavedTourChanges);

  useEffect(() => {
    setMounted(true);
    if (draftTourPlan) {
        setFormData(draftTourPlan);
        setIsSaved(true);
    }
    if (!draftTour) {
        fetchTours();
    }
  }, [fetchTours, draftTour, draftTourPlan]);

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
      alert("Please choose a Tour Title to associate this plan with.");
      return;
    }

    setDraftTourPlan(formData);
    
    console.log('Draft Plan saved locally:', formData);
    alert('Draft Plan saved locally. Please proceed to the next step!');
    setIsSaved(true);
  };

  if (!mounted) return null;

  return (
    <div className='max-w-4xl mx-auto py-10 px-4'>
      {/* Wizard Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 4 of 6</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Itinerary & Tour Plan</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="w-[66.66%] h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"></div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 transition-all duration-300">
        <header className="mb-10">
            <h1 className='text-3xl font-black tracking-tight text-gray-900 mb-2'>Tour Itinerary</h1>
            <p className="text-gray-500 text-lg">Detail each stop of the journey with coordinates and descriptions.</p>
        </header>

        {/* Draft Mode Notice */}
        {draftTour && (
            <div className="mb-10 p-5 rounded-3xl bg-blue-50/50 border border-blue-100/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                    <h4 className="text-blue-900 font-bold">Draft Mode Active</h4>
                    <p className="text-blue-700/80 text-sm">Assigning itinerary to "{draftTour.title}"</p>
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

        <div className="space-y-12">
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2 ml-1">Daily Stops / Plan Steps</h4>
            <div className="space-y-10">
                {[...Array(9)].map((_, index) => (
                    <div key={index} className="relative pl-12 border-l-2 border-dashed border-gray-100 pb-10 last:pb-0">
                        <div className="absolute left-[-13px] top-0 w-6 h-6 rounded-full bg-blue-500 border-4 border-white shadow-lg ring-4 ring-blue-50 flex items-center justify-center text-[8px] text-white font-bold">{index + 1}</div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 group">
                                <label className="block mb-1 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Stop Title</label>
                                <input 
                                    type="text" 
                                    name={`title${index + 1}`}
                                    placeholder="e.g. Arrival at Ubud Monkey Forest"
                                    value={formData[`title${index + 1}`]} 
                                    onChange={handleChange} 
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all outline-none font-bold text-sm"
                                />
                            </div>

                            <div className="group">
                                <label className="block mb-1 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Latitude</label>
                                <input 
                                    type="text" 
                                    name={`coordinatesleft${index + 1}`}
                                    placeholder="e.g. -8.519"
                                    value={formData[`coordinatesleft${index + 1}`]} 
                                    onChange={handleChange} 
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all outline-none font-medium text-xs"
                                />
                            </div>

                            <div className="group">
                                <label className="block mb-1 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Longitude</label>
                                <input 
                                    type="text" 
                                    name={`coordinatesright${index + 1}`}
                                    placeholder="e.g. 115.261"
                                    value={formData[`coordinatesright${index + 1}`]} 
                                    onChange={handleChange} 
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all outline-none font-medium text-xs"
                                />
                            </div>

                            <div className="md:col-span-2 group">
                                <label className="block mb-1 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Stop Description</label>
                                <textarea 
                                    name={`description${index + 1}`}
                                    placeholder="Briefly describe what happens at this stop..."
                                    value={formData[`description${index + 1}`]} 
                                    onChange={handleChange} 
                                    rows={2}
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all outline-none font-medium text-xs resize-none"
                                />
                            </div>

                            <div className="md:col-span-2 group">
                                <label className="block mb-1 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Related Article Link (Optional)</label>
                                <input 
                                    type="text" 
                                    name={`link${index + 1}`}
                                    placeholder="https://..."
                                    value={formData[`link${index + 1}`]} 
                                    onChange={handleChange} 
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all outline-none font-medium text-[10px] text-blue-600 italic"
                                />
                            </div>
                        </div>
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
                    href={'/add-tour-package/add-other'} 
                    className="w-full sm:w-auto px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-center shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all duration-200"
                >
                    Continue to Other Info →
                </Link>
            ) : (
                <button 
                    disabled 
                    className="w-full sm:w-auto px-10 py-4 text-base font-bold text-gray-400 bg-gray-100 cursor-not-allowed rounded-2xl text-center"
                >
                    Continue to Other Info →
                </button>
            )}
        </div>
      </div>
    </div>
  );
}

export default AddTourPlan;
