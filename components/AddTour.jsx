"use client"
import Link from 'next/link';
import { useState } from 'react';
import useTourStore from '../stores/useTourStore';

function AddTour() {
  const [formData, setFormData] = useState({
    title: '',
    price1: '',
    pricenote1: '',
    price2: '',
    pricenote2: '',
    price3: '',
    pricenote3: '',
    keywords: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  const { createTour } = useTourStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const { success, message, status } = await createTour(formData);

    if (success) {
      alert('Data saved successfully!');
      setIsSaved(true);
      setFormData({
        title: '',
        price1: '',
        pricenote1: '',
        price2: '',
        pricenote2: '',
        price3: '',
        pricenote3: '',
        keywords: ''
      });
    } else {
      if (status === 400) {
        alert('Bad request: Please check your input data.');
      } else if (status === 404) {
        alert('Resource not found.');
      } else {
        alert(message || 'An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className='max-w-screen-lg mx-auto mb-10'>
      <h1 className='my-10 text-xl font-bold'>Please input Tour Title and Tour Price</h1>
      <div className="mb-6">
        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 ">Tour title</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>
      <div className="mb-6">
        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 ">Keywords</label>
        <input type="text" id="keywords" name="keywords" value={formData.keywords} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>
      <div className="mb-6">
        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 ">Tour Price 1</label>
        <input type="text" id="price1" name="price1" value={formData.price1} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>
      <div className="mb-6">
        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 ">Price Note 1</label>
        <input type="text" id="pricenote1" name="pricenote1" value={formData.pricenote1} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>
      <div className="mb-6">
        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 ">Tour Price 2</label>
        <input type="text" id="price2" name="price2" value={formData.price2} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>
      <div className="mb-6">
        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 ">Price Note 2</label>
        <input type="text" id="pricenote2" name="pricenote2" value={formData.pricenote2} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>
      <div className="mb-6">
        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 ">Tour Price 3</label>
        <input type="text" id="price3" name="price3" value={formData.price3} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>
      <div className="mb-6">
        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 ">Price Note 3</label>
        <input type="text" id="pricenote3" name="pricenote3" value={formData.pricenote3} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>

      <div className='w-full flex justify-between'>
        <button type="button" onClick={handleSubmit} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>

        {isSaved ? (
          <Link href={'/add-tour-package/add-tour-detail'} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Next to Add Tour Detail
          </Link>
        ) : (
          <button disabled className="px-5 py-2.5 text-sm font-medium text-white bg-gray-400 cursor-not-allowed rounded-lg text-center">
            Next to Add Tour Detail
          </button>
        )}
      </div>


    </div>
  )
}

export default AddTour