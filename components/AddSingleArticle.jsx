"use client"
import Link from 'next/link';
import { useState } from 'react';
import useArticleStore from '../stores/useArticleStore';

function AddSingleArticle() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    keywords: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const { createArticle } = useArticleStore();

  const handleSubmit = async () => {
    const { success, status, data, message } = await createArticle(formData);

    if (success) {
      console.log('Data submitted:', data);
      alert('Data saved successfully!');
      setIsSaved(true);
      setFormData({
        title: '',
        author: '',
        keywords: ''
      });
    } else {
      console.error('Error submitting form:', message);
      if (status) {
        console.error('Server responded with error status:', status);
        if (status === 400) {
          alert('Bad request: Please check your input data.');
        } else if (status === 404) {
          alert('Resource not found.');
        } else {
          alert(`An error occurred. ${message}`);
        }
      } else {
        alert('An error occurred. Please try again later.');
      }
    }
  };
  return (
    <div className='max-w-screen-lg mx-auto'>
      <h1 className='my-10 text-xl font-bold'>Please input Tour Title and Tour Price</h1>
      <div className="mb-6">
        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 ">Blog title</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>
      <div className="mb-6">
        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 ">Keywords</label>
        <input type="text" id="keywords" name="keywords" value={formData.keywords} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>
      <div className="mb-6">
        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 ">Author</label>
        <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>


      <div className='w-full flex justify-between'>
        <button type="button" onClick={handleSubmit} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>

        {isSaved ? (
          <Link href={'/add-article/add-article-paragrafs'} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Next to Add Article Paragrafs
          </Link>
        ) : (
          <button disabled className="px-5 py-2.5 text-sm font-medium text-white bg-gray-400 cursor-not-allowed rounded-lg text-center">
            Next to Add Article Paragrafs
          </button>
        )}
      </div>


    </div>
  )
}

export default AddSingleArticle