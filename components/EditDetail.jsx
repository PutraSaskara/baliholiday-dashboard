"use client";
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import useTourStore from '../stores/useTourStore';
import AIAssistantModal from './AIAssistantModal';

function EditDetail({ tourDetailId, onNext }) {
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
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const { tours: tourOptions, fetchTours, fetchTourDetail, updateTourDetail } = useTourStore();

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const loadTourDetailData = useCallback(async () => {
    if (!tourDetailId) return;
    const data = await fetchTourDetail(tourDetailId);
    if (data) Object.keys(data).length > 0 && setFormData(data);
  }, [tourDetailId, fetchTourDetail]);

  useEffect(() => {
    loadTourDetailData();
  }, [loadTourDetailData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const { success, status, data, message } = await updateTourDetail(tourDetailId, formData);

    if (success) {
      console.log('Data updated:', data);
      alert('Tour details successfully updated.');
    } else {
      if (status) {
        console.error('Server responded with error status:', status);
        const errorMessage = data ? JSON.stringify(data) : message;
        alert(`Server responded with an error: ${status}. ${errorMessage}`);
      } else {
        alert(message || 'An error occurred during update.');
      }
    }
  };

  const handleApplyAI = (generatedData) => {
    const updatedDetail = { ...formData };
    for (let i = 1; i <= 9; i++) {
      if (generatedData[`detail${i}`]) updatedDetail[`detail${i}`] = generatedData[`detail${i}`];
    }
    setFormData(updatedDetail);
  };

  return (
    <div className='max-w-screen-lg mx-auto'>
      <h1 className='my-10 text-xl font-bold'>Edit Tour Detail</h1>

      <div className='my-5'>
        <h3>Note</h3>
        <p>*Tour Detail is for showing to customers what they will get (e.g., 12 hours Tour, Private Car, Driver as Guide, etc.)</p>
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

      <div className="w-full flex flex-col sm:flex-row justify-between gap-4 mb-10">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setIsAIModalOpen(true)}
            disabled={!formData.tourId}
            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            ✨ Review & AI Auto-fill
          </button>
          <button 
            type="button" 
            onClick={handleSubmit} 
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save
          </button>
        </div>

        {onNext ? (
          <button type="button" onClick={onNext} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">
            Next to Edit Tour Description
          </button>
        ) : (
          <Link href={'/edit-tour-package/edit-tour-desc'} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">
            Next to Edit Tour Description
          </Link>
        )}
      </div>

      <AIAssistantModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        mode="edit"
        tourId={formData.tourId}
        targetSection="detail"
        drafts={formData}
        onApply={handleApplyAI}
      />
    </div>
  );
}

export default EditDetail;
