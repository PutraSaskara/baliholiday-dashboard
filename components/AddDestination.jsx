// src/components/AddDestination.jsx
"use client";

import { useState, useEffect } from "react";
import useDestinationStore from "../stores/useDestinationStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

function AddDestination() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    lat: "",
    lng: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const router = useRouter();

  const { createDestination } = useDestinationStore();

  // Cleanup the object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/webp") {
        setImage(file);
        // Generate a preview URL
        const previewURL = URL.createObjectURL(file);
        setImagePreview(previewURL);
      } else {
        alert("Please upload an image in WEBP format.");
        // Reset the file input if the file type is incorrect
        e.target.value = "";
        setImage(null);
        setImagePreview(null);
      }
    } else {
      // If no file is selected
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Image is required and must be in WEBP format.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("lat", formData.lat);
    data.append("lng", formData.lng);
    data.append("image", image);

    const { success, message } = await createDestination(data);

    if (success) {
      alert("Destination added successfully!");
      router.push("/destinations");
    } else {
      alert(message || "Failed to add destination.");
    }
  };

  return (
    <div className='max-w-4xl mx-auto py-10 px-4'>
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 transition-all duration-300">
        <header className="mb-10 text-center">
            <h1 className='text-3xl font-black tracking-tight text-gray-900 mb-2'>Add New Destination</h1>
            <p className="text-gray-500 text-lg">Create a new travel destination with coordinates and photos.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 group">
                    <label className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 group-focus-within:text-blue-600 transition-colors">Destination Name</label>
                    <input 
                        type="text" 
                        name="name"
                        value={formData.name} 
                        onChange={handleChange}
                        required
                        placeholder="e.g. Tanah Lot Temple"
                        className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-semibold shadow-sm"
                    />
                </div>

                <div className="md:col-span-2 group">
                    <label className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 group-focus-within:text-blue-600 transition-colors">Description</label>
                    <textarea 
                        name="description"
                        value={formData.description} 
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Describe the magic of this destination..."
                        className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium shadow-sm resize-none"
                    />
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
                        className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-semibold shadow-sm"
                    />
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
                        className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-semibold shadow-sm"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-2.5 text-sm font-bold text-gray-700 ml-1">Cover Image (.webp)</label>
                    <div className={`relative group aspect-video rounded-[2rem] border-2 border-dashed overflow-hidden transition-all duration-300 ${imagePreview ? 'border-blue-500' : 'border-gray-200 hover:border-blue-400 bg-gray-50'}`}>
                        {imagePreview ? (
                            <div className="absolute inset-0">
                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <label htmlFor="image-upload" className="px-8 py-3 bg-white rounded-full text-blue-600 font-bold text-sm cursor-pointer shadow-2xl hover:scale-105 transition-transform">Change Destination Photo</label>
                                </div>
                            </div>
                        ) : (
                            <label htmlFor="image-upload" className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-10 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-xl border border-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                                </div>
                                <span className="text-base font-bold text-gray-700">Drop your .webp image here</span>
                                <span className="text-sm text-gray-400 mt-2">Recommended: High resolution HD quality</span>
                            </label>
                        )}
                        <input id="image-upload" type="file" accept="image/webp" onChange={handleImageChange} className="hidden" />
                    </div>
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
                    className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all active:scale-95"
                >
                    Publish Destination
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default AddDestination;
