"use client"
import React, { useState, useEffect } from "react";
import useTourStore from "../stores/useTourStore";
import Link from "next/link";
import Image from "next/image";
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';

function AddTourImage() {
  const [tourId, setTourId] = useState("");
  const [images1, setImages1] = useState([]);
  const [images2, setImages2] = useState([]);
  const [images3, setImages3] = useState([]);
  const [error, setError] = useState("");
  const [preview1, setPreview1] = useState("");
  const [preview2, setPreview2] = useState("");
  const [preview3, setPreview3] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { 
    tours: tourOptions, 
    fetchTours, 
    createTourImage,
    submitAllTourDrafts,
    draftTour,
    hasUnsavedTourChanges,
    loading 
  } = useTourStore();

  useWarnIfUnsavedChanges(hasUnsavedTourChanges);

  useEffect(() => {
    setMounted(true);
    if (!draftTour) fetchTours();
  }, [fetchTours, draftTour]);

  const handleTourIdChange = (event) => {
    setTourId(event.target.value);
  };

  const validateImage = (file) => {
    const allowedExtensions = /(\.webp)$/i;
    if (!allowedExtensions.test(file.name)) {
      setError("Please select a .webp file only.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Please select an image with size less than 5MB.");
      return false;
    }
    return true;
  };

  const handleImageChange1 = (event) => {
    if (!validateImage(event.target.files[0])) return;
    setImages1(event.target.files);
    setPreview1(URL.createObjectURL(event.target.files[0]));
    setError("");
  };

  const handleImageChange2 = (event) => {
    if (!validateImage(event.target.files[0])) return;
    setImages2(event.target.files);
    setPreview2(URL.createObjectURL(event.target.files[0]));
    setError("");
  };

  const handleImageChange3 = (event) => {
    if (!validateImage(event.target.files[0])) return;
    setImages3(event.target.files);
    setPreview3(URL.createObjectURL(event.target.files[0]));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!draftTour && !tourId.trim()) {
        setError("Tour ID is required");
        return;
      }

      if (
        images1.length !== 1 ||
        images2.length !== 1 ||
        images3.length !== 1
      ) {
        setError("Please select exactly one image for each field");
        return;
      }

      const formData = new FormData();
      formData.append("tourId", tourId);
      formData.append("image", images1[0]);
      formData.append("image", images2[0]);
      formData.append("image", images3[0]);

      let result;
      if (draftTour) {
         // Draft Flow: Submit everything
         result = await submitAllTourDrafts(formData);
      } else {
         // Standard Flow: Just Add Image to existing Tour
         result = await createTourImage(formData);
      }
      
      const { success, status, data, message } = result;

      if (success) {
        console.log("Process completed successfully:", data || message);
        setIsSaved(true);
        setTourId("");
        setImages1([]);
        setImages2([]);
        setImages3([]);
        setError("");
        setPreview1("");
        setPreview2("");
        setPreview3("");
        alert(draftTour ? "All Tour Data Published successfully!" : "Images uploaded successfully");
      } else {
        if (status) {
          console.error("Server responded with error status:", status);
          const errorMessage = data ? JSON.stringify(data) : message;
          alert(`Server responded with an error: ${status}. ${errorMessage}`);
        } else {
          alert(message || "An error occurred during process.");
        }
      }
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
      alert("An unexpected error occurred.");
    }
  };

  if (!mounted) return null;


  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Wizard Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 6 of 6</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Final Presentation & Photos</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"></div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 transition-all duration-300">
        <header className="mb-10">
            <h1 className='text-3xl font-black tracking-tight text-gray-900 mb-2'>Tour Media</h1>
            <p className="text-gray-500 text-lg">Upload 3 high-quality photos to showcase this tour package.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
            {/* Draft Mode Notice */}
            {draftTour && (
                <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-200">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                        <h4 className="text-indigo-900 font-bold text-lg">Final Submission Ready</h4>
                        <p className="text-indigo-700/80 text-sm">Assigning images to "{draftTour.title}" and publishing all drafted data.</p>
                    </div>
                </div>
            )}

            {!draftTour && (
                <div className="group">
                    <label htmlFor="tourId" className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 group-focus-within:text-blue-600 transition-colors">Select Target Tour</label>
                    <select 
                        id="tourId" 
                        value={tourId} 
                        onChange={handleTourIdChange}
                        className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-semibold appearance-none cursor-pointer shadow-sm"
                    >
                        <option value="">Choose a Tour Package...</option>
                        {tourOptions.map(tour => (
                            <option key={tour.id} value={tour.id}>{tour.title}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Helper Box */}
            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 text-gray-900 font-black text-xs uppercase tracking-widest">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Media Guidelines
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                    Please use <b>.webp</b> format for optimal performance. Max size <b>5MB</b>. We recommend <b>1920x1080px</b> for sharp displays.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                    <Link href='https://image.online-convert.com/convert-to-webp' target="_blank" className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">Convert to WebP →</Link>
                    <Link href='https://imagecompressor.11zon.com/en/compress-webp/' target="_blank" className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">Compress WebP →</Link>
                </div>
            </div>

            {/* Image Upload Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((num) => {
                    const preview = num === 1 ? preview1 : num === 2 ? preview2 : preview3;
                    const handler = num === 1 ? handleImageChange1 : num === 2 ? handleImageChange2 : handleImageChange3;
                    return (
                        <div key={num} className="space-y-3">
                            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Cover Image {num}</label>
                            <div className={`relative group aspect-[4/3] rounded-3xl border-2 border-dashed overflow-hidden transition-all duration-300 ${preview ? 'border-blue-500' : 'border-gray-200 hover:border-blue-400 bg-gray-50'}`}>
                                {preview ? (
                                    <div className="absolute inset-0">
                                        <Image src={preview} alt="Preview" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <label htmlFor={`images${num}`} className="px-6 py-2 bg-white rounded-full text-blue-600 font-bold text-xs cursor-pointer shadow-xl hover:scale-105 transition-transform">Change Photo</label>
                                        </div>
                                    </div>
                                ) : (
                                    <label htmlFor={`images${num}`} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-6 text-center">
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                                        </div>
                                        <span className="text-xs font-bold text-gray-500">Click to Upload</span>
                                        <span className="text-[10px] text-gray-400 mt-1">HD Photo (1920x1080)</span>
                                    </label>
                                )}
                                <input type="file" id={`images${num}`} accept=".webp" onChange={handler} className="hidden" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {error && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex items-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                    {error}
                </div>
            )}

            <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                {isSaved ? (
                    <Link href={'/'} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2 group">
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back to Dashboard
                    </Link>
                ) : (
                    <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                         <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                         Ready for Final Submission
                    </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full sm:w-auto px-12 py-5 rounded-[1.5rem] font-black text-lg transition-all duration-300 shadow-2xl flex items-center justify-center gap-3
                    ${loading 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                        : 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:scale-[1.02] active:scale-95 shadow-green-200'}`}
                >
                    {loading ? (
                        <>
                            <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Publishing...
                        </>
                    ) : (
                        draftTour ? "Submit All Data (Final)" : "Finish Upload"
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default AddTourImage;
