"use client"
import React, { useState, useEffect } from "react";
import useArticleStore from "../stores/useArticleStore";
import Link from "next/link";
import Image from "next/image";
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';

function AddArticleImage() {
  const [blogId, setBlogId] = useState("");
  const [images1, setImages1] = useState([]);
  const [images2, setImages2] = useState([]);
  const [images3, setImages3] = useState([]);
  const [error, setError] = useState("");
  const [preview1, setPreview1] = useState("");
  const [preview2, setPreview2] = useState("");
  const [preview3, setPreview3] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const { 
    articles: tourOptions, 
    fetchArticles, 
    createArticleImage,
    submitAllDrafts,
    draftArticle,
    hasUnsavedChanges,
    loading
  } = useArticleStore();

  useWarnIfUnsavedChanges(hasUnsavedChanges);

  useEffect(() => {
    if (!draftArticle) {
       fetchArticles();
    }
  }, [fetchArticles, draftArticle]);

  const handleTourIdChange = (event) => {
    setBlogId(event.target.value);
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

    if (!draftArticle && !blogId.trim()) {
      setError("Article ID is required");
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
    formData.append("blogId", blogId);
    formData.append("image", images1[0]);
    formData.append("image", images2[0]);
    formData.append("image", images3[0]);

    if(draftArticle) {
       // Draft flow (New Article)
       const { success, message } = await submitAllDrafts(formData);
       if (success) {
         console.log("All drafts submitted successfully");
         setIsSaved(true);
         setImages1([]);
         setImages2([]);
         setImages3([]);
         setError("");
         setPreview1("");
         setPreview2("");
         setPreview3("");
         alert("All data (Article, Paragraphs, Images) uploaded successfully!");
       } else {
         alert(`Failed to submit drafts: ${message}`);
       }
    } else {
       // Standalone flow (Add image to existing article)
       const { success, status, data, message } = await createArticleImage(formData);
       if (success) {
         console.log("Images uploaded successfully:", data);
         setIsSaved(true);
         setBlogId("");
         setImages1([]);
         setImages2([]);
         setImages3([]);
         setError("");
         setPreview1("");
         setPreview2("");
         setPreview3("");
         alert("Images uploaded successfully");
       } else {
         if (status) {
           console.error("Server responded with error status:", status);
           const errorMessage = data ? JSON.stringify(data) : message;
           alert(`Server responded with an error: ${status}. ${errorMessage}`);
         } else {
           alert(message || "An error occurred during upload.");
         }
       }
    }
  };

  return (
    <div className='max-w-4xl mx-auto py-10 px-4 mb-20'>
      {/* Wizard Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 3 of 3</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Finalize & Publish</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"></div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 transition-all duration-300">
        <header className="mb-10 text-center">
            <h1 className='text-3xl font-black tracking-tight text-gray-900 mb-2'>Upload Images & Publish</h1>
            <p className="text-gray-500 text-lg">Final step! Add eye-catching images to your article.</p>
        </header>

        {/* Draft Mode Notice */}
        {draftArticle && (
            <div className="mb-10 p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                    <h4 className="text-indigo-900 font-bold italic tracking-tight">Draft Ready for Publication</h4>
                    <p className="text-indigo-700/80 text-sm">Target: &quot;{draftArticle.title}&quot;</p>
                </div>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {!draftArticle && (
            <div className="group">
              <label htmlFor="blogId" className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 group-focus-within:text-blue-600 transition-colors">Select Target Blog Post</label>
              <select 
                id="blogId" 
                value={blogId} 
                onChange={handleTourIdChange}
                className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-semibold appearance-none cursor-pointer shadow-sm"
              >
                <option value="">Choose a Blog Post...</option>
                {tourOptions.map((tour) => (
                  <option key={tour.id} value={tour.id}>{tour.title}</option>
                ))}
              </select>
            </div>
          )}

          <div className="p-6 bg-amber-50/30 border border-amber-100 rounded-3xl space-y-2">
            <h4 className="text-amber-800 font-bold flex items-center gap-2 text-sm uppercase tracking-wide">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Image Guidelines
            </h4>
            <ul className="text-amber-700/80 text-sm space-y-1 ml-1">
                <li className="flex items-center gap-2">• Use <b>.webp</b> format for best performance</li>
                <li className="flex items-center gap-2">• Recommended size: <b>1920x1080px</b> (max 5MB)</li>
                <li className="flex items-center gap-2">
                    • Tools: 
                    <Link href='https://image.online-convert.com/convert-to-webp' target="_blank" className="text-blue-600 font-bold hover:underline mx-1">Convert</Link> | 
                    <Link href='https://imagecompressor.11zon.com/en/compress-webp/' target="_blank" className="text-blue-600 font-bold hover:underline mx-1">Compress</Link>
                </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: '1', label: 'Image 1 (Main Header)', preview: preview1, handler: handleImageChange1 },
              { id: '2', label: 'Image 2 (Secondary)', preview: preview2, handler: handleImageChange2 },
              { id: '3', label: 'Image 3 (Tertiary)', preview: preview3, handler: handleImageChange3 }
            ].map((img) => (
              <div key={img.id} className="relative group">
                <label className="block mb-2 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">{img.label}</label>
                <div className={`relative aspect-square rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
                  ${img.preview ? 'border-transparent ring-2 ring-blue-500 ring-offset-4' : 'border-gray-200 bg-gray-50/50 hover:bg-white hover:border-blue-400'}`}>
                  
                  {img.preview ? (
                    <div className="relative w-full h-full group">
                        <Image src={img.preview} alt="Preview" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <span className="text-white text-xs font-bold px-3 py-1.5 bg-white/20 rounded-lg border border-white/30">Replace Image</span>
                        </div>
                    </div>
                  ) : (
                    <div className="text-center p-4 cursor-pointer">
                        <svg className="w-8 h-8 text-gray-300 mx-auto mb-2 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        <span className="text-xs font-bold text-gray-400 group-hover:text-blue-600 transition-colors">Click to Upload</span>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={img.handler}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-2 animate-shake">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {error}
            </div>
          )}

          <div className='pt-8 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4'>
            <div className="w-full sm:w-auto">
                {isSaved ? (
                  <Link href={'/'} className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Dashboard
                  </Link>
                ) : (
                  <Link href={'/add-article/add-article-paragrafs'} className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    Change Paragraphs
                  </Link>
                )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full sm:w-auto px-12 py-4 text-base font-bold text-white rounded-2xl transition-all duration-300 flex items-center justify-center shadow-xl 
                ${loading ? 'bg-emerald-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-200 hover:-translate-y-0.5 active:scale-95'}`}
            >
                {loading ? (
                    <>
                        <svg className="w-5 h-5 animate-spin mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Publishing...
                    </>
                ) : (
                    draftArticle ? "Publish Article Now →" : "Upload & Update →"
                )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddArticleImage;
