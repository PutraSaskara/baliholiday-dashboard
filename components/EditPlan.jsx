"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '@/apiConfig'; // Import the baseURL

function AddTourPlan({tourId}) {
  const [formData, setFormData] = useState({
    title1: '',
    description1: '',
    link1: '',
    title2: '',
    description2: '',
    link2: '',
    title3: '',
    description3: '',
    link3: '',
    title4: '',
    description4: '',
    link4: '',
    title5: '',
    description5: '',
    link5: '',
    title6: '',
    description6: '',
    link6: '',
    title7: '',
    description7: '',
    link7: '',
    title8: '',
    description8: '',
    link8: '',
    title9: '',
    description9: '',
    link9: '',
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


  const fetchTourDetail = async () => {
    try {
      const response = await axios.get(`${baseURL}/plans/${tourId}`); // Fetch tour detail data by ID
      setFormData(response.data); // Update form data with fetched data
    } catch (error) {
      console.error('Error fetching tour detail:', error);
    }
  };

  fetchTours(); // Call the fetchTours function
  fetchTourDetail(); // Call the fetchTourDetail function
}, [tourId]);


  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.patch(`${baseURL}/plans/${tourId}`, formData); // Use the baseURL
      console.log('Data submitted:', response.data);
      alert('Tour plan saved successfully!');
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
      <h1 className='my-10 text-xl font-bold'>Please Edit Tour Plan and Plan Description</h1>

      <div className='my-5'>
        <h3>Note</h3>
        <p>*Blog Link use for put baliholiday article link relate with Tour Title (ex: https://baliholiday.xyz/blog/explaination-about-monkey-forest)</p>
      </div>

      {/* Repeat for each set of plan fields */}
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
          <label htmlFor={`title${index + 1}`} className="block text-sm font-medium text-gray-900">Plan title {index + 1}</label>
          <input id={`title${index + 1}`} name={`title${index + 1}`} value={formData[`title${index + 1}`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
          
          
          <label htmlFor={`description${index + 1}`} className="block text-sm font-medium text-gray-900">Plan description {index + 1}</label>
          <textarea id={`description${index + 1}`} name={`description${index + 1}`} value={formData[`description${index + 1}`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

          <label htmlFor={`link${index + 1}`} className="block text-sm font-medium text-gray-900">Blog Link {index + 1}</label>
          <input id={`link${index + 1}`} name={`link${index + 1}`} value={formData[`link${index + 1}`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
      ))}

      <div className='flex justify-between'>
        <button type="button" onClick={handleSubmit} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">Save</button>

        <Link href={'/add-tour-package/add-tour-image'} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">
        Next to Edit Tour Image
      </Link>
      </div>

    </div>
  );
}

export default AddTourPlan;
