import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import baseURL from '@/apiConfig';
import { useRouter, useParams } from 'next/navigation';

function EditDestination() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lat: '',
    lng: '',
  });
  const [image, setImage] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  // Wrap fetchDestination in useCallback
  const fetchDestination = useCallback(async () => {
    try {
      const response = await axios.get(`${baseURL}/api/destinations/${id}`);
      const { name, description, lat, lng } = response.data;
      setFormData({ name, description, lat, lng });
    } catch (error) {
      console.error('Error fetching destination:', error);
      alert('Failed to fetch destination details.');
    }
  }, [id]); // Only depend on `id`

  useEffect(() => {
    if (id) {
      fetchDestination();
    }
  }, [id, fetchDestination]); // Dependencies: `id` and `fetchDestination`

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
      const response = await axios.put(`${baseURL}/api/destinations/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Destination updated successfully!');
      router.push('/destinations');
    } catch (error) {
      console.error('Error updating destination:', error);
      alert('Failed to update destination.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Edit Destination</h1>
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
          Update Destination
        </button>
      </form>
    </div>
  );
}

export default EditDestination;
