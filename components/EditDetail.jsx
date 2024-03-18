"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '@/apiConfig'; // Import the baseURL

function EditDetail({ tourDetailId }) {
  const [formData, setFormData] = useState({
    detail1: '',
    detail2: '',
    detail3: '',
    detail4: '',
    detail5: '',
    detail6: '',
    detail7: '',
    detail8: '',
    detail9: '',
    tourId: ''
  });

  const [tourOptions, setTourOptions] = useState([]); // State to store fetched tour options

  useEffect(() => {
    // Fetch tour options from the backend when the component mounts
    const fetchTours = async () => {
      try {
        const response = await axios.get(`${baseURL}/tours`); // Fetch tours from the backend
        const lastFiveTours = response.data.slice(-5); // Get the last 5 tours
        setTourOptions(lastFiveTours); // Update tour options state
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };

    // Fetch tour detail data when the component mounts
    const fetchTourDetail = async () => {
      try {
        const response = await axios.get(`${baseURL}/details/${tourDetailId}`); // Fetch tour detail data by ID
        setFormData(response.data); // Update form data with fetched data
      } catch (error) {
        console.error('Error fetching tour detail:', error);
      }
    };

    fetchTours(); // Call the fetchTours function
    fetchTourDetail(); // Call the fetchTourDetail function
  }, [tourDetailId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.patch(`${baseURL}/details/${tourDetailId}`, formData); // Use the baseURL and PATCH method
      console.log('Data updated:', response.data);
      
      // Show alert for successful update
      alert('Tour details successfully updated.');
    } catch (error) {
      console.error('Error updating tour detail:', error);
      // Handle error as needed
    }
  };

  return (
    <div className='max-w-screen-lg mx-auto'>
      <h1 className='my-10 text-xl font-bold'>Edit Tour Detail</h1>

      <div className='my-5'>
        <h3>Note</h3>
        <p>*Tour Detail is for showing to customers what they will get (e.g., 12 hours Tour, Private Car, Driver as Guide, etc.)</p>
      </div>

      {/* Repeat for each set of detail fields */}
      <div className="mb-6">
        <label htmlFor="tourId" className="block mb-2 text-sm font-medium text-gray-900">Choose Tour Title For this Tour Plan</label>
        <select id="tourId" name="tourId" value={formData.tourId} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="">Select a Tour</option>
          {tourOptions.map(tour => (
            <option key={tour?.id} value={tour?.id}>{tour?.title}</option>
          ))}
        </select>
      </div>
      {[...Array(9)].map((_, index) => (
        <div key={index} className="mb-6">
          <label htmlFor={`detail${index + 1}`} className="block text-sm font-medium text-gray-900">Detail {index + 1}</label>
          <input id={`detail${index + 1}`} name={`detail${index + 1}`} value={formData[`detail${index + 1}`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
      ))}

      <div className='flex justify-between'>
        <button type="button" onClick={handleSubmit} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">Save</button>

        <Link href={'/edit-tour-package/edit-tour-desc'} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">
          Next to Edit Tour Description
        </Link>     
      </div>

    </div>
  );
}

export default EditDetail;
