// src/components/AddDestination.jsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import baseURL from "@/apiConfig";
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

    try {
      const response = await axios.post(`${baseURL}/api/destinations`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Destination added successfully!");
      router.push("/destinations");
    } catch (error) {
      console.error("Error adding destination:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Failed to add destination: ${error.response.data.message}`);
      } else {
        alert("Failed to add destination.");
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-5 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Add New Destination</h1>
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
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter destination name"
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Enter destination description"
            cols={5}
            rows={6}
          />
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
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter latitude"
          />
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
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter longitude"
          />
        </div>

        {/* Image Upload Field */}
        <div>
          <label className="block mb-1">Image (WEBP format)</label>
          <input
            type="file"
            accept="image/webp"
            onChange={handleImageChange}
            required
            className="w-full"
          />
          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4">
              <p className="mb-2">Image Preview:</p>
              <Image
                src={imagePreview}
                alt="Image Preview"
                className="w-full h-64 object-cover rounded border"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Destination
        </button>
      </form>
    </div>
  );
}

export default AddDestination;
