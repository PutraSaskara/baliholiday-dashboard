// src/components/AddArea.jsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import baseURL from "@/apiConfig";
import { useRouter } from "next/navigation";
import Image from "next/image";

function AddArea() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    lat: "",
    lng: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [errors, setErrors] = useState({}); // State for form errors
  const router = useRouter();

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

    // Clear errors as the user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/webp") {
        setImage(file);
        // Generate a preview URL
        const previewURL = URL.createObjectURL(file);
        setImagePreview(previewURL);
        // Clear any previous image errors
        setErrors({ ...errors, image: null });
      } else {
        // Reset the file input if the file type is incorrect
        e.target.value = "";
        setImage(null);
        setImagePreview(null);
        setErrors({ ...errors, image: "Please upload an image in WEBP format." });
      }
    } else {
      // If no file is selected
      setImage(null);
      setImagePreview(null);
      setErrors({ ...errors, image: "Image is required and must be in WEBP format." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic front-end validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (!formData.lat) newErrors.lat = "Latitude is required.";
    if (!formData.lng) newErrors.lng = "Longitude is required.";
    if (!image) newErrors.image = "Image is required and must be in WEBP format.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("lat", formData.lat);
    data.append("lng", formData.lng);
    data.append("image", image);

    try {
      const response = await axios.post(`${baseURL}/api/pickup-areas`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Optionally, you can use a toast notification here instead of alert
      alert("Pickup Area added successfully!");
      router.push("/pickup-areas");
    } catch (error) {
      console.error("Error adding pickup area:", error);
      if (error.response && error.response.data) {
        if (error.response.status === 400) {
          // Handle validation errors from the server
          const serverErrors = {};
          error.response.data.errors.forEach((err) => {
            serverErrors[err.param] = err.msg;
          });
          setErrors(serverErrors);
          alert("Please fix the highlighted errors and try again.");
        } else if (error.response.status === 404) {
          alert("Resource not found.");
        } else {
          alert("An error occurred. Please try again later.");
        }
      } else if (error.request) {
        alert("No response received from the server. Please try again later.");
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-5 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Add New Pickup Area</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
              errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
            }`}
            placeholder="Enter pickup area name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Description Field */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 resize-none ${
              errors.description ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
            }`}
            placeholder="Enter pickup area description"
            cols={5}
            rows={6}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Latitude Field */}
        <div>
          <label className="block mb-1">Latitude</label>
          <input
            type="number"
            name="lat"
            value={formData.lat}
            onChange={handleChange}
            required
            step="any"
            className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
              errors.lat ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
            }`}
            placeholder="Enter latitude"
          />
          {errors.lat && <p className="text-red-500 text-sm mt-1">{errors.lat}</p>}
        </div>

        {/* Longitude Field */}
        <div>
          <label className="block mb-1">Longitude</label>
          <input
            type="number"
            name="lng"
            value={formData.lng}
            onChange={handleChange}
            required
            step="any"
            className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
              errors.lng ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
            }`}
            placeholder="Enter longitude"
          />
          {errors.lng && <p className="text-red-500 text-sm mt-1">{errors.lng}</p>}
        </div>

        {/* Image Upload Field */}
        <div>
          <label className="block mb-1">Image (WEBP format)</label>
          <input
            type="file"
            accept="image/webp"
            onChange={handleImageChange}
            required
            className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
              errors.image ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
            }`}
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4">
              <p className="mb-2">Image Preview:</p>
              <Image
                src={imagePreview}
                alt="Image Preview"
                className="w-full h-64 object-cover rounded border"
                width={100}
                height={100}
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Pickup Area
        </button>
      </form>
    </div>
  );
}

export default AddArea;
