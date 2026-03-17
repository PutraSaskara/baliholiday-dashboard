"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useTourStore from '../stores/useTourStore';

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
  const [isSaved, setIsSaved] = useState(false);

  const { tours: tourOptions, fetchTours, createTourDetail } = useTourStore();

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const { success, status, data, message } = await createTourDetail(formData);

    if (success) {
      console.log('Data submitted:', data);
      alert('Tour details successfully saved.');
      setIsSaved(true);
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
    } else {
      if (status) {
        console.error('Server responded with error status:', status);
        const errorMessage = data ? JSON.stringify(data) : message;
        alert(`Server responded with an error: ${status}. ${errorMessage}`);
      } else {
        alert(message || 'An error occurred during save.');
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

        {isSaved ? (
          <Link href={'/add-tour-package/add-tour-desc'} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">
            Next to Add Tour Description
          </Link>
        ) : (
          <button disabled className="px-5 py-2.5 text-sm font-medium text-white bg-gray-400 cursor-not-allowed rounded-lg text-center mb-10">
            Next to Add Tour Description
          </button>
        )}
      </div>

    </div>
  );
}

export default AddTourDetail;
