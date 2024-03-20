"use client"
import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios'; 
import baseURL from '@/apiConfig';

function AddSingleArticle() {
    const [formData, setFormData] = useState({
        title: '',
        author: ''
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
          const response = await axios.post(`${baseURL}/single-blog`, formData); // Use the baseURL
          console.log('Data submitted:', response.data);
          alert('Data saved successfully!');
          setFormData({
            title: '',
            author: ''
          });
        } catch (error) {
          console.error('Error submitting form:', error);
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Server responded with error status:', error.response.status);
            if (error.response.status === 400) {
              // Handle specific error status codes
              alert('Bad request: Please check your input data.');
            } else if (error.response.status === 404) {
              alert('Resource not found.');
            } else {
              alert('An error occurred. Please try again later.');
            }
          } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
            alert('No response received from the server. Please try again later.');
          } else {
            // Something happened in setting up the request that triggered an error
            console.error('Error setting up the request:', error.message);
            alert('An error occurred. Please try again later.');
          }
        }
      };
  return (
    <div className='max-w-screen-lg mx-auto'>
    <h1 className='my-10 text-xl font-bold'>Please input Tour Title and Tour Price</h1>
    <div className="mb-6">
        <label for="default-input" className="block mb-2 text-sm font-medium text-gray-900 ">Blog title</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
    </div>
    <div className="mb-6">
        <label for="default-input" className="block mb-2 text-sm font-medium text-gray-900 ">Author</label>
        <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
    </div>
    

    <div className='w-full flex justify-between'>
    <button type="button" onClick={handleSubmit} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>

    <Link href={'/add-article/add-article-paragrafs'} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      Next to Add Article Paragrafs
    </Link>
    </div>
    

  </div>
  )
}

export default AddSingleArticle