"use client";

import { useState, useEffect, useCallback } from "react";
import useAreaStore from "../stores/useAreaStore";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

function EditArea() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    lat: "",
    lng: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { id } = useParams();

  const { fetchAreaById, updateArea, loading } = useAreaStore();

  const fetchArea = useCallback(async () => {
    if (!id) return;
    const data = await fetchAreaById(id);
    if (data) {
      const { name, description, lat, lng, image } = data;
      setFormData({ name, description, lat, lng });
      setExistingImage(image);
    }
  }, [id, fetchAreaById]);

  useEffect(() => {
    fetchArea();
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [id, fetchArea]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/webp") {
        setImage(file);
        const previewURL = URL.createObjectURL(file);
        setImagePreview(previewURL);
        setErrors((prev) => ({ ...prev, image: null }));
      } else {
        alert("Please upload an image in WEBP format.");
        e.target.value = "";
        setImage(null);
        setImagePreview(null);
        setErrors((prev) => ({ ...prev, image: "Please upload an image in WEBP format." }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("lat", formData.lat);
    data.append("lng", formData.lng);
    if (image) {
      data.append("image", image);
    }

    const { success, message } = await updateArea(id, data);
    if (success) {
      alert("Pickup Area updated successfully!");
      router.push("/pickup-areas");
    } else {
      alert(message || "Failed to update pickup area.");
    }
  };

  return (
    <div className='max-w-4xl mx-auto py-10 px-4'>
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 transition-all duration-300">
        <header className="mb-10 text-center">
            <h1 className='text-3xl font-black tracking-tight text-gray-900 mb-2'>Edit Pickup Area</h1>
            <p className="text-gray-500 text-lg">Update pickup location details and photos.</p>
        </header>

        {loading && !formData.name ? (
           <div className="flex flex-col items-center justify-center py-20 space-y-4">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
               <p className="text-gray-400 font-medium">Loading area data...</p>
           </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2 group">
                      <label className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 group-focus-within:text-blue-600 transition-colors">Area Name</label>
                      <input 
                          type="text" 
                          name="name"
                          value={formData.name} 
                          onChange={handleChange}
                          required
                          placeholder="e.g. Seminyak Square"
                          className={`w-full px-6 py-4 bg-gray-50/50 border text-gray-900 rounded-2xl focus:ring-4 transition-all outline-none font-semibold shadow-sm ${errors.name ? 'border-rose-300 focus:ring-rose-500/10' : 'border-gray-200 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white'}`}
                      />
                      {errors.name && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{errors.name}</p>}
                  </div>

                  <div className="md:col-span-2 group">
                      <label className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 group-focus-within:text-blue-600 transition-colors">Description</label>
                      <textarea 
                          name="description"
                          value={formData.description} 
                          onChange={handleChange}
                          required
                          rows={6}
                          placeholder="Key landmarks or pickup instructions..."
                          className={`w-full px-6 py-4 bg-gray-50/50 border text-gray-900 rounded-2xl focus:ring-4 transition-all outline-none font-medium shadow-sm resize-none ${errors.description ? 'border-rose-300 focus:ring-rose-500/10' : 'border-gray-200 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white'}`}
                      />
                      {errors.description && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{errors.description}</p>}
                  </div>

                  <div className="group">
                      <label className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 group-focus-within:text-blue-600 transition-colors">Latitude</label>
                      <input 
                          type="number" 
                          name="lat"
                          value={formData.lat} 
                          onChange={handleChange}
                          required
                          step="any"
                          placeholder="-8.123456"
                          className={`w-full px-6 py-4 bg-gray-50/50 border text-gray-900 rounded-2xl focus:ring-4 transition-all outline-none font-semibold shadow-sm ${errors.lat ? 'border-rose-300 focus:ring-rose-500/10' : 'border-gray-200 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white'}`}
                      />
                      {errors.lat && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{errors.lat}</p>}
                  </div>

                  <div className="group">
                      <label className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 group-focus-within:text-blue-600 transition-colors">Longitude</label>
                      <input 
                          type="number" 
                          name="lng"
                          value={formData.lng} 
                          onChange={handleChange}
                          required
                          step="any"
                          placeholder="115.123456"
                          className={`w-full px-6 py-4 bg-gray-50/50 border text-gray-900 rounded-2xl focus:ring-4 transition-all outline-none font-semibold shadow-sm ${errors.lng ? 'border-rose-300 focus:ring-rose-500/10' : 'border-gray-200 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white'}`}
                      />
                      {errors.lng && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{errors.lng}</p>}
                  </div>

                  <div className="md:col-span-2">
                      <label className="block mb-2.5 text-sm font-bold text-gray-700 ml-1">Area Photo (.webp)</label>
                      <div className={`relative group aspect-video rounded-[2rem] border-2 border-dashed overflow-hidden transition-all duration-300 ${(imagePreview || existingImage) ? 'border-blue-500' : errors.image ? 'border-rose-300 bg-rose-50/30' : 'border-gray-200 hover:border-blue-400 bg-gray-50'}`}>
                          {(imagePreview || existingImage) ? (
                              <div className="absolute inset-0">
                                  <Image src={imagePreview || existingImage} alt="Preview" fill className="object-cover" />
                                  <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm">
                                      <label htmlFor="area-image-upload" className="px-8 py-3 bg-white rounded-full text-blue-600 font-bold text-sm cursor-pointer shadow-2xl hover:scale-105 transition-transform">Replace Current Photo</label>
                                      <p className="text-white/60 text-[10px] mt-3 font-bold uppercase tracking-widest">{imagePreview ? 'Newly Selected' : 'Existing Photo'}</p>
                                  </div>
                              </div>
                          ) : (
                              <label htmlFor="area-image-upload" className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-10 text-center">
                                  <div className="w-16 h-16 rounded-2xl bg-white shadow-xl border border-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                                  </div>
                                  <span className="text-base font-bold text-gray-700">Change Photo (.webp)</span>
                              </label>
                          )}
                          <input id="area-image-upload" type="file" accept="image/webp" onChange={handleImageChange} className="hidden" />
                      </div>
                      <p className="mt-4 text-xs text-gray-400 ml-2 italic text-center">Leave blank if you don't want to change the photo.</p>
                      {errors.image && <p className="text-rose-500 text-xs font-bold mt-2 ml-1 text-center">{errors.image}</p>}
                  </div>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-100">
                  <button 
                      type="button" 
                      onClick={() => router.back()}
                      className="w-full sm:w-auto px-10 py-4 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                  >
                      Cancel
                  </button>
                  <button 
                      type="submit" 
                      disabled={loading}
                      className={`w-full sm:w-auto px-12 py-4 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3
                        ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-200 hover:-translate-y-0.5'}`}
                  >
                      {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                      {loading ? 'Updating...' : 'Save Changes'}
                  </button>
              </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditArea;

