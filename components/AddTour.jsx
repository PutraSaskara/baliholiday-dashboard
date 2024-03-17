"use client"
import Link from 'next/link'
import { useState } from 'react';
import axios from 'axios'; 
import baseURL from '@/apiConfig'

function AddTour() {
  const [formData, setFormData] = useState({
    title: '',
    price1: '',
    pricenote1: '',
    price2: '',
    pricenote2: '',
    price3: '',
    pricenote3: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${baseURL}/tours`, formData); // Use the baseURL
      console.log('Data submitted:', response.data);
      // Reset form after successful submission if needed
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
      <h1 className='my-10 text-xl font-bold'>Please input Tour Title and Tour Price</h1>
      <div class="mb-6">
          <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900 ">Tour title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
      </div>
      <div class="mb-6">
          <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900 ">Tour Price 1</label>
          <input type="text" id="price1" name="price1" value={formData.price1} onChange={handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
      </div>
      <div class="mb-6">
          <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900 ">Price Note 1</label>
          <input type="text" id="pricenote1" name="pricenote1" value={formData.pricenote1} onChange={handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
      </div>
      <div class="mb-6">
          <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900 ">Tour Price 2</label>
          <input type="text" id="price2" name="price2" value={formData.price2} onChange={handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
      </div>
      <div class="mb-6">
          <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900 ">Price Note 2</label>
          <input type="text" id="pricenote2" name="pricenote2" value={formData.pricenote2} onChange={handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
      </div>
      <div class="mb-6">
          <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900 ">Tour Price 3</label>
          <input type="text" id="price3" name="price3" value={formData.price3} onChange={handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
      </div>
      <div class="mb-6">
          <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900 ">Price Note 3</label>
          <input type="text" id="pricenote3" name="pricenote3" value={formData.pricenote3} onChange={handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
      </div>

      <div className='w-full flex justify-between'>
      <button type="button" onClick={handleSubmit} class="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>

      <Link href={'/add-tour-package/add-tour-plan'} class="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Next
      </Link>
      </div>
      

    </div>
  )
}

export default AddTour