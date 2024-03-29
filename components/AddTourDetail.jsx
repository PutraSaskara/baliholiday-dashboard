"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '@/apiConfig'; // Import the baseURL

function AddTourDetail() {
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
  
    fetchTours(); // Call the fetchTours function
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
  try {
    const response = await axios.post(`${baseURL}/detail`, formData); // Use the baseURL
    console.log('Data submitted:', response.data);
    
    // Show alert for successful submission
    alert('Tour details successfully saved.');

    // Reset form after successful submission if needed
    setFormData({
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
  } catch (error) {
    console.error('Error submitting form:', error);
    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      console.error('Server responded with error status:', error.response.status);
      console.error('Error message from server:', error.response.data);
      const errorMessage = JSON.stringify(error.response.data);
      alert(`Server responded with an error: ${error.response.status}. ${errorMessage}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      alert('No response received from the server. Please try again later.');
    } else {
      // Something happened in setting up the request that triggered an error
      console.error('Error setting up the request:', error.message);
      alert(`An error occurred: ${error.message}`);
    }
  }
};


  return (
    <div className='max-w-screen-lg mx-auto'>
      <h1 className='my-10 text-xl font-bold'>Please input Tour Detail</h1>

      <div className='my-5'>
        <h3>Note</h3>
        <p>*Tour Detail is for show to customers what will they get (ex: 12 hours Tour, Privat Car, Driver as Guide, etc)</p>
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

        <Link href={'/add-tour-package/add-tour-desc'} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">
        Next to Add Tour Description
      </Link>     
        </div>

    </div>
  );
}

export default AddTourDetail;
