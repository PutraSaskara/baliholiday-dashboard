"use client";

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import baseURL from '@/apiConfig';
import { useRouter, useParams } from 'next/navigation';

function EditArea() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lat: '',
    lng: '',
  });
  const [image, setImage] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  const fetchArea = useCallback(async () => {
    try {
      const response = await axios.get(`${baseURL}/api/pickup-areas/${id}`);
      const { name, description, lat, lng } = response.data;
      setFormData({ name, description, lat, lng });
    } catch (error) {
      console.error('Error fetching pickup area:', error);
      alert('Failed to fetch pickup area details.');
    }
  }, [id]); // Memoizing fetchArea with id as a dependency

  useEffect(() => {
    if (id) {
      fetchArea();
    }
  }, [id, fetchArea]); // Adding fetchArea as a dependency to useEffect

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'image/webp') {
      setImage(file);
    } else {
      alert('Please upload an image in WEBP format.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('lat', formData.lat);
    data.append('lng', formData.lng);
    if (image) {
      data.append('image', image);
    }

    try {
      const response = await axios.put(`${baseURL}/api/pickup-areas/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Pickup Area updated successfully!');
      router.push('/pickup-areas');
    } catch (error) {
      console.error('Error updating pickup area:', error);
      if (error.response) {
        if (error.response.status === 400) {
          alert('Bad request: Please check your input data.');
        } else if (error.response.status === 404) {
          alert('Pickup Area not found.');
        } else {
          alert('An error occurred. Please try again later.');
        }
      } else if (error.request) {
        alert('No response received from the server. Please try again later.');
      } else {
        alert('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Edit Pickup Area</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded resize-none"
            cols={5}
            rows={6}
          />
        </div>
        <div>
          <label className="block mb-1">Latitude</label>
          <input
            type="number"
            name="lat"
            value={formData.lat}
            onChange={handleChange}
            required
            step="any"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Longitude</label>
          <input
            type="number"
            name="lng"
            value={formData.lng}
            onChange={handleChange}
            required
            step="any"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Image (WEBP format)</label>
          <input
            type="file"
            accept="image/webp"
            onChange={handleImageChange}
            className="w-full"
          />
          <p className="text-sm text-gray-500">Leave blank to keep the current image.</p>
        </div>
        <button type="submit" className="w-full bg-yellow-500 text-white py-2 rounded">
          Update Pickup Area
        </button>
      </form>
    </div>
  );
}

export default EditArea;
