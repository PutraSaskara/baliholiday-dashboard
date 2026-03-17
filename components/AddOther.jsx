"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useTourStore from '../stores/useTourStore';

function AddOther() {
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
    cancel2: '',
    tourId: ''
  });
  
  const [isSaved1, setIsSaved1] = useState(false);
  const [isSaved2, setIsSaved2] = useState(false);
  const [isSaved3, setIsSaved3] = useState(false);
  
  const isAllSaved = isSaved1 && isSaved2 && isSaved3;

  const {
    tours: tourOptions,
    fetchTours,
    createTourInclude,
    createTourNotInclude,
    createTourCancellation
  } = useTourStore();

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

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
    const { success, status, data, message } = await createTourInclude(formData1);
    if (success) {
      console.log('Data submitted:', data);
      alert('Tour includes successfully saved.');
      setIsSaved1(true);
      setFormData1({ include1: '', include2: '', include3: '', tourId: '' });
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

  const handleSubmit2 = async () => {
    const { success, status, data, message } = await createTourNotInclude(formData2);
    if (success) {
      console.log('Data submitted:', data);
      alert('Tour not includes successfully saved.');
      setIsSaved2(true);
      setFormData2({ notinclude1: '', notinclude2: '', notinclude3: '', tourId: '' });
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

  const handleSubmit3 = async () => {
    const { success, status, data, message } = await createTourCancellation(formData3);
    if (success) {
      console.log('Data submitted:', data);
      alert('Tour cancellation successfully saved.');
      setIsSaved3(true);
      setFormData3({ cancel1: '', cancel2: '', tourId: '' });
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
      <h1 className='my-10 text-xl font-bold'>Please input Tour Include, Not Include, and Cancellation</h1>

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
        {isAllSaved ? (
          <Link href={'/'} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">
            Back to Dashboard
          </Link>
        ) : (
          <button disabled className="px-5 py-2.5 text-sm font-medium text-white bg-gray-400 cursor-not-allowed rounded-lg text-center mb-10">
            Back to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

export default AddOther;
