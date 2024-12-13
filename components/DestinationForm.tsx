// src/components/DestinationForm.tsx

"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import Image from "next/image";

interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  lat: number;
  lng: number;
  // Add other fields as necessary
}

interface DestinationFormProps {
  isEditMode: boolean;
  existingData: Destination;
}

const DestinationForm: React.FC<DestinationFormProps> = ({ isEditMode, existingData }) => {
  const [name, setName] = useState<string>(existingData.name);
  const [description, setDescription] = useState<string>(existingData.description);
  const [lat, setLat] = useState<number>(existingData.lat);
  const [lng, setLng] = useState<number>(existingData.lng);
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validation
    if (!name || !description || !lat || !lng || (!isEditMode && !image)) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("lat", lat.toString());
      formData.append("lng", lng.toString());
      if (image) {
        formData.append("image", image);
      }

      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/destinations/${existingData.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Destination updated successfully.");
      } else {
        await axios.post(`http://localhost:5000/api/destinations`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Destination created successfully.");
      }

      router.push("/dashboard/destinations");
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">
        {isEditMode ? "Edit" : "Create"} Destination
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="name">
            Name<span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="description">
            Description<span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        {/* Latitude */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="lat">
            Latitude<span className="text-red-500">*</span>
          </label>
          <input
            id="lat"
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(parseFloat(e.target.value))}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Longitude */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="lng">
            Longitude<span className="text-red-500">*</span>
          </label>
          <input
            id="lng"
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(parseFloat(e.target.value))}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Image */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="image">
            Image{!isEditMode && <span className="text-red-500">*</span>}
          </label>
          <input
            id="image"
            type="file"
            accept="image/webp"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="border rounded p-2 w-full"
            {...(!isEditMode && { required: true })}
          />
          <p className="text-sm text-gray-500 mt-1">Only WEBP format is allowed.</p>
          {isEditMode && existingData?.image && (
            <Image
              src={`http://localhost:5000${existingData.image}`}
              alt={existingData.name}
              className="mt-2 w-32 h-32 object-cover rounded"
              width={128} // Specify width and height for optimization
              height={128}
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full p-2 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center ${
            isSubmitting ? "cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : null}
          {isEditMode ? "Update" : "Create"} Destination
        </button>
      </form>
    </div>
  );
};

export default DestinationForm;
