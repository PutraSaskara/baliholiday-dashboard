"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '@/apiConfig'; // Import the baseURL

function AddOther({Id}) {
  const [formData1, setFormData1] = useState({
    include1: '',
    include2: '',
    include3: '',
    tourId: ''
  });
  const [formData2, setFormData2] = useState({
    notinclude1: '',
    notinclude2: '',
    notinclude3: '',
    tourId: ''
  });
  const [formData3, setFormData3] = useState({
    cancel1: '',
    cancel2: '',
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
    const fetchTourInclude = async () => {
        try {
          const response = await axios.get(`${baseURL}/includes/${Id}`); // Fetch tour detail data by ID
          setFormData1(response.data); // Update form data with fetched data
        } catch (error) {
          console.error('Error fetching tour detail:', error);
        }
      };
    const fetchTourNotInclude = async () => {
        try {
          const response = await axios.get(`${baseURL}/not-includes/${Id}`); // Fetch tour detail data by ID
          setFormData2(response.data); // Update form data with fetched data
        } catch (error) {
          console.error('Error fetching tour detail:', error);
        }
      };
    const fetchTourCancellation = async () => {
        try {
          const response = await axios.get(`${baseURL}/cancellations/${Id}`); // Fetch tour detail data by ID
          setFormData3(response.data); // Update form data with fetched data
        } catch (error) {
          console.error('Error fetching tour detail:', error);
        }
      };
  
      fetchTours();
  
      fetchTourInclude(); // Call the fetchTours function
      fetchTourNotInclude(); // Call the fetchTours function
      fetchTourCancellation(); // Call the fetchTours function
  }, [Id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData1(prevState => ({
      ...prevState,
      [name]: value
    }));
    setFormData2(prevState => ({
      ...prevState,
      [name]: value
    }));
    setFormData3(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit1 = async () => {
    try {
      const response = await axios.patch(`${baseURL}/includes/${Id}`, formData1); // Use the baseURL
      console.log('Data submitted:', response.data);
      
      // Show alert for successful submission
      alert('Tour details successfully saved.');
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

  const handleSubmit2 = async () => {
    try {
      const response = await axios.patch(`${baseURL}/not-includes/${Id}`, formData2); // Use the baseURL
      console.log('Data submitted:', response.data);
      
      // Show alert for successful submission
      alert('Tour details successfully saved.');
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

  const handleSubmit3 = async () => {
    try {
      const response = await axios.patch(`${baseURL}/cancellation/${Id}`, formData3); // Use the baseURL
      console.log('Data submitted:', response.data);
      
      // Show alert for successful submission
      alert('Tour details successfully saved.');
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
      <h1 className='my-10 text-xl font-bold'>Please Edit Tour Include, Not Include, and Cancellation</h1>

      {/* Include Form */}
      <div className="mb-6">
        <label htmlFor="tourId" className="block mb-2 text-sm font-medium text-gray-900">Choose Tour Title For this Tour Plan</label>
        <select id="tourId" name="tourId" value={formData1.tourId} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="">Select a Tour</option>
          {tourOptions.map(tour => (
            <option key={tour?.id} value={tour?.id}>{tour?.title}</option>
          ))}
        </select>
      </div>
      {[...Array(3)].map((_, index) => (
        <div key={index} className="mb-6">
          <label htmlFor={`include${index + 1}`} className="block text-sm font-medium text-gray-900">Include {index + 1}</label>
          <input id={`Include${index + 1}`} name={`include${index + 1}`} value={formData1[`include${index + 1}`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
      ))}
      <button type="button" onClick={handleSubmit1} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">Save Include</button>

      {/* Not Include Form */}
      <h1 className='my-10 text-xl font-bold'>Please input Tour Not Include</h1>
      <div className="mb-6">
        <label htmlFor="tourId" className="block mb-2 text-sm font-medium text-gray-900">Choose Tour Title For this Tour Plan</label>
        <select id="tourId" name="tourId" value={formData2.tourId} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="">Select a Tour</option>
          {tourOptions.map(tour => (
            <option key={tour?.id} value={tour?.id}>{tour?.title}</option>
          ))}
        </select>
      </div>
      {[...Array(3)].map((_, index) => (
        <div key={index} className="mb-6">
          <label htmlFor={`notinclude${index + 1}`} className="block text-sm font-medium text-gray-900">Not Include {index + 1}</label>
          <input id={`notinclude${index + 1}`} name={`notinclude${index + 1}`} value={formData2[`notinclude${index + 1}`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
      ))}
      <button type="button" onClick={handleSubmit2} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">Save Not Include</button>

      {/* Cancellation Form */}
      <h1 className='my-10 text-xl font-bold'>Please input Tour Cancellation</h1>
      <div className="mb-6">
        <label htmlFor="tourId" className="block mb-2 text-sm font-medium text-gray-900">Choose Tour Title For this Tour Plan</label>
        <select id="tourId" name="tourId" value={formData3.tourId} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="">Select a Tour</option>
          {tourOptions.map(tour => (
            <option key={tour?.id} value={tour?.id}>{tour?.title}</option>
          ))}
        </select>
      </div>
      {[...Array(2)].map((_, index) => (
        <div key={index} className="mb-6">
          <label htmlFor={`cancel${index + 1}`} className="block text-sm font-medium text-gray-900">Cancellation {index + 1}</label>
          <input id={`cancel${index + 1}`} name={`cancel${index + 1}`} value={formData3[`cancel${index + 1}`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
      ))}

      <div className='flex justify-between'>
      <button type="button" onClick={handleSubmit3} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">Save Cancellation</button>
        <Link href={'/'} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default AddOther;
