"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useTourStore from '../stores/useTourStore';
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';

function AddOther() {
  const {
    tours: tourOptions,
    fetchTours,
    draftTour,
    draftTourInclude,
    draftTourNotInclude,
    draftTourCancellation,
    setDraftTourInclude,
    setDraftTourNotInclude,
    setDraftTourCancellation,
    hasUnsavedTourChanges
  } = useTourStore();

  const [formData1, setFormData1] = useState({
    include1: '',
    include2: '',
    include3: '',
    tourId: ''
  });
  const [formData2, setFormData2] = useState({
    notinclude1: '',
    notinclude2: '',
    notinclude3: '',
    tourId: ''
  });
  const [formData3, setFormData3] = useState({
    cancel1: '',
    cancel2: '',
    cancel2: '',
    tourId: ''
  });
  
  const [isSaved1, setIsSaved1] = useState(false);
  const [isSaved2, setIsSaved2] = useState(false);
  const [isSaved3, setIsSaved3] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const isAllSaved = isSaved1 && isSaved2 && isSaved3;

  useWarnIfUnsavedChanges(hasUnsavedTourChanges);

  useEffect(() => {
    setMounted(true);
    if (draftTourInclude) {
        setFormData1(draftTourInclude);
        setIsSaved1(true);
    }
    if (draftTourNotInclude) {
        setFormData2(draftTourNotInclude);
        setIsSaved2(true);
    }
    if (draftTourCancellation) {
        setFormData3(draftTourCancellation);
        setIsSaved3(true);
    }
    if (!draftTour) {
        fetchTours();
    }
  }, [fetchTours, draftTour, draftTourInclude, draftTourNotInclude, draftTourCancellation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData1(prevState => ({
      ...prevState,
      [name]: value
    }));
    setFormData2(prevState => ({
      ...prevState,
      [name]: value
    }));
    setFormData3(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit1 = async () => {
    if (!draftTour && !formData1.tourId) return alert("Please specify Tour Title");
    setDraftTourInclude(formData1);
    setIsSaved1(true);
    alert('Draft Includes saved locally.');
  };

  const handleSubmit2 = async () => {
    if (!draftTour && !formData2.tourId) return alert("Please specify Tour Title");
    setDraftTourNotInclude(formData2);
    setIsSaved2(true);
    alert('Draft Not Includes saved locally.');
  };

  const handleSubmit3 = async () => {
    if (!draftTour && !formData3.tourId) return alert("Please specify Tour Title");
    setDraftTourCancellation(formData3);
    setIsSaved3(true);
    alert('Draft Cancellation saved locally.');
  };

  if (!mounted) return null;

  return (
    <div className='max-w-4xl mx-auto py-10 px-4'>
      {/* Wizard Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 5 of 6</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Inclusions & Policies</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="w-[83.33%] h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"></div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 transition-all duration-300">
        <header className="mb-10">
            <h1 className='text-3xl font-black tracking-tight text-gray-900 mb-2'>Inclusions & Terms</h1>
            <p className="text-gray-500 text-lg">Specify what's included in the package and define your policies.</p>
        </header>

        {/* Draft Mode Notice */}
        {draftTour && (
            <div className="mb-10 p-5 rounded-3xl bg-blue-50/50 border border-blue-100/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                    <h4 className="text-blue-900 font-bold">Draft Mode Active</h4>
                    <p className="text-blue-700/80 text-sm">Assigning policies to "{draftTour.title}"</p>
                </div>
            </div>
        )}

        <div className="space-y-12">
            {/* Includes Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h4 className="text-sm font-black uppercase tracking-widest text-emerald-600">What's Included</h4>
                    <button onClick={handleSubmit1} className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">{isSaved1 ? '✓ Saved' : 'Save Section'}</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((num) => (
                        <div key={num} className="group flex items-center gap-3 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/50 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-emerald-100/50 transition-all duration-300">
                             <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                             <input 
                                type="text" 
                                name={`include${num}`}
                                placeholder={`Item #${num}`}
                                value={formData1[`include${num}`]} 
                                onChange={handleChange} 
                                className="w-full bg-transparent text-gray-900 outline-none font-medium text-xs placeholder:text-emerald-200"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Not Included Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h4 className="text-sm font-black uppercase tracking-widest text-rose-600">What's NOT Included</h4>
                    <button onClick={handleSubmit2} className="text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 px-3 py-1.5 rounded-lg transition-colors">{isSaved2 ? '✓ Saved' : 'Save Section'}</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((num) => (
                        <div key={num} className="group flex items-center gap-3 p-4 bg-rose-50/30 rounded-2xl border border-rose-100/50 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-rose-100/50 transition-all duration-300">
                             <svg className="w-4 h-4 text-rose-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                             <input 
                                type="text" 
                                name={`notinclude${num}`}
                                placeholder={`Item #${num}`}
                                value={formData2[`notinclude${num}`]} 
                                onChange={handleChange} 
                                className="w-full bg-transparent text-gray-900 outline-none font-medium text-xs placeholder:text-rose-200"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Cancellation Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h4 className="text-sm font-black uppercase tracking-widest text-amber-600">Cancellation Policy</h4>
                    <button onClick={handleSubmit3} className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg transition-colors">{isSaved3 ? '✓ Saved' : 'Save Section'}</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((num) => (
                        <div key={num} className="group flex items-center gap-3 p-4 bg-amber-50/30 rounded-2xl border border-amber-100/50 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-amber-100/50 transition-all duration-300">
                             <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                             <input 
                                type="text" 
                                name={`cancel${num}`}
                                placeholder={`Clause #${num}`}
                                value={formData3[`cancel${num}`]} 
                                onChange={handleChange} 
                                className="w-full bg-transparent text-gray-900 outline-none font-medium text-xs placeholder:text-amber-200"
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>

        <div className='mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4'>
            <span className="text-sm font-bold text-gray-400">Step 5 of 6 Completed</span>
            
            {isAllSaved ? (
                <Link 
                    href={'/add-tour-package/add-tour-image'} 
                    className="w-full sm:w-auto px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl text-center shadow-xl shadow-emerald-200 hover:-translate-y-0.5 transition-all duration-200"
                >
                    Continue to Images →
                </Link>
            ) : (
                <button 
                    disabled 
                    className="w-full sm:w-auto px-10 py-4 text-base font-bold text-gray-400 bg-gray-100 cursor-not-allowed rounded-2xl text-center"
                >
                    Complete All Sections to Continue
                </button>
            )}
        </div>
      </div>
    </div>
  );
}

export default AddOther;
