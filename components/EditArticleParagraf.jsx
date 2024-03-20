"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '@/apiConfig'; // Import the baseURL

function EditArticleParagraf({id}) {
    const [formData, setFormData] = useState({
        paragraf1: '',
        titleparagraf2: '',
        paragraf2: '',
        link2: '',
        titleparagraf3: '',
        paragraf3: '',
        link3: '',
        titleparagraf4: '',
        paragraf4: '',
        link4: '',
        titleparagraf5: '',
        paragraf5: '',
        link5: '',
        titleparagraf6: '',
        paragraf6: '',
        link6: '',
        titleparagraf7: '',
        paragraf7: '',
        link7: '',
        Conclusion: '',
        blogId: '' // Add blogId field to match association with SingleBlog
      });

  const [tourOptions, setTourOptions] = useState([]); // State to store fetched tour options

  useEffect(() => {
    // Fetch tour options from the backend when the component mounts
    const fetchTours = async () => {
      try {
        const response = await axios.get(`${baseURL}/single-blog`); // Fetch tours from the backend
        const lastFiveTours = response.data.slice(-5); // Get the last 5 tours
        setTourOptions(lastFiveTours); // Update tour options state
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };
    const fetchTourDetail = async () => {
        try {
          const response = await axios.get(`${baseURL}/paragraf/${id}`); // Fetch tour detail data by ID
          setFormData(response.data); // Update form data with fetched data
        } catch (error) {
          console.error('Error fetching tour detail:', error);
        }
      };
  
    fetchTours(); // Call the fetchTours function
    fetchTourDetail()
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.patch(`${baseURL}/paragraf/${id}`, formData); // Use the baseURL
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
<div className='max-w-screen-lg mx-auto px-5'>
  <h1 className='my-10 text-xl font-bold'>Please Edit Article Paragraphs</h1>

  <div className='my-5'>
    <h3>Note</h3>
    <p>*Link for Paragraph is used to associate the article paragraph with a blog post (e.g., https://baliholiday.xyz/blog/explanation-about-monkey-forest)</p>
  </div>

  {/* Select the blog post to associate the article paragraphs */}
  <div className="mb-6">
    <label htmlFor="tourId" className="block mb-2 text-sm font-medium text-gray-900">Choose Blog Post</label>
    <select id="tourId" name="blogId" value={formData.blogId} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      <option value="">Select a Blog Post</option>
      {tourOptions.map(blog => (
        <option key={blog?.id} value={blog?.id}>{blog?.title}</option>
      ))}
    </select>
  </div>
  
  {/* Paragraphs */}
  <label htmlFor={`paragraf1`} className="block text-sm font-medium text-gray-900">Paragraph 1</label>
  <textarea id={`paragraf1`} name={`paragraf1`} value={formData[`paragraf1`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-32 resize-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>

  {/* Repeat for each set of article paragraphs */}
  {[...Array(6)].map((_, index) => (
    <div key={index + 1} className="mb-6 mt-10">
        <label htmlFor={`titleparagraf${index + 2}`} className="block text-sm font-medium text-gray-900">Title for Paragraph {index + 2}</label>
      <input id={`titleparagraf${index + 2}`} name={`titleparagraf${index + 2}`} value={formData[`titleparagraf${index + 2}`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

      <label htmlFor={`paragraf${index + 2}`} className="block text-sm font-medium text-gray-900">Paragraph {index + 2}</label>
      <textarea id={`paragraf${index + 2}`} name={`paragraf${index + 2}`} value={formData[`paragraf${index + 2}`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-32 resize-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
      
      
      <label htmlFor={`link${index + 2}`} className="block text-sm font-medium text-gray-900">Link for Paragraph {index + 2}</label>
      <input id={`link${index + 2}`} name={`link${index + 2}`} value={formData[`link${index + 2}`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
    </div>
  ))}

  {/* Conclusion paragraph */}
  <div className="mb-6">
    <label htmlFor="Conclusion" className="block text-sm font-medium text-gray-900">Conclusion</label>
    <input id="Conclusion" name="Conclusion" value={formData.Conclusion} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
  </div>

  {/* Save button */}
  <div className='flex justify-between'>
    <button type="button" onClick={handleSubmit} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">Save</button>

    <Link href={'/add-article/add-article-images'} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">
      Next to Edit Article Image
    </Link>
  </div>

</div>

  );
}

export default EditArticleParagraf;
