"use client"
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import useTourStore from '../stores/useTourStore';
import useDestinationStore from '../stores/useDestinationStore';

function AddTourPlan({ tourId, onNext }) {
  const { fetchAllDestinationsList, createDestination } = useDestinationStore();
  const [destinations, setDestinations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    stopNum: null,
    name: '',
    lat: '',
    lng: '',
    description: '',
    file: null
  });
  const [formData, setFormData] = useState({
    title1: '',
    coordinatesleft1: '',
    coordinatesright1: '',
    description1: '',
    link1: '',
    title2: '',
    coordinatesleft2: '',
    coordinatesright2: '',
    description2: '',
    link2: '',
    title3: '',
    coordinatesleft3: '',
    coordinatesright3: '',
    description3: '',
    link3: '',
    title4: '',
    coordinatesleft4: '',
    coordinatesright4: '',
    description4: '',
    link4: '',
    title5: '',
    coordinatesleft5: '',
    coordinatesright5: '',
    description5: '',
    link5: '',
    title6: '',
    coordinatesleft6: '',
    coordinatesright6: '',
    description6: '',
    link6: '',
    title7: '',
    coordinatesleft7: '',
    coordinatesright7: '',
    description7: '',
    link7: '',
    title8: '',
    coordinatesleft8: '',
    coordinatesright8: '',
    description8: '',
    link8: '',
    title9: '',
    coordinatesleft9: '',
    coordinatesright9: '',
    description9: '',
    link9: '',
    tourId: ''
  });

  const { tours: tourOptions, fetchTours, fetchTourPlan, updateTourPlan } = useTourStore();

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const loadTourPlanData = useCallback(async () => {
    if (!tourId) return;
    const data = await fetchTourPlan(tourId);
    if (data && Object.keys(data).length > 0) {
      setFormData(data);
    }
  }, [tourId, fetchTourPlan]);

  useEffect(() => {
    loadTourPlanData();
  }, [loadTourPlanData]);

  useEffect(() => {
    const loadDestinations = async () => {
      const list = await fetchAllDestinationsList();
      setDestinations(list);
    };
    loadDestinations();
  }, [fetchAllDestinationsList]);

  const handleSelectDestination = (stopNum, destinationId) => {
    if (!destinationId) return;
    const dest = destinations.find(d => String(d.id) === String(destinationId));
    if (dest) {
      setFormData(prev => ({
        ...prev,
        [`title${stopNum}`]: dest.name || '',
        [`coordinatesleft${stopNum}`]: String(dest.lat) || '',
        [`coordinatesright${stopNum}`]: String(dest.lng) || '',
        [`description${stopNum}`]: dest.description || '',
      }));
    }
  };

  const openSaveDestinationModal = (stopNum) => {
    setModalData({
      stopNum,
      name: formData[`title${stopNum}`] || '',
      lat: formData[`coordinatesleft${stopNum}`] || '',
      lng: formData[`coordinatesright${stopNum}`] || '',
      description: formData[`description${stopNum}`] || '',
      file: null
    });
    setModalOpen(true);
  };

  const handleModalSave = async () => {
    if (!modalData.name || !modalData.lat || !modalData.lng || !modalData.description) {
      alert("Name, Latitude, Longitude, and Description are required to save a destination.");
      return;
    }
    if (!modalData.file) {
      alert("Please select an image file for the destination.");
      return;
    }

    const payload = new FormData();
    payload.append("name", modalData.name);
    payload.append("description", modalData.description);
    payload.append("lat", modalData.lat);
    payload.append("lng", modalData.lng);
    payload.append("image", modalData.file);

    const res = await createDestination(payload);
    if (res.success) {
      alert("Destination saved successfully!");
      const list = await fetchAllDestinationsList();
      setDestinations(list);
      
      setFormData(prev => ({
        ...prev,
        [`title${modalData.stopNum}`]: modalData.name,
        [`coordinatesleft${modalData.stopNum}`]: modalData.lat,
        [`coordinatesright${modalData.stopNum}`]: modalData.lng,
        [`description${modalData.stopNum}`]: modalData.description,
      }));
      setModalOpen(false);
    } else {
      alert(res.message || "Failed to save destination.");
    }
  };




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const { success, status, data, message } = await updateTourPlan(tourId, formData);

    if (success) {
      console.log('Data submitted:', data);
      alert('Tour plan saved successfully!');
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
        <div key={index} className="mb-6 p-5 border border-gray-200 rounded-2xl bg-gray-50/30">
          <div className="flex flex-col md:flex-row gap-4 items-end bg-gray-50/50 p-4 rounded-xl border border-gray-100 mb-4">
            <div className="flex-1 w-full">
              <label className="block mb-1 text-xs font-bold text-gray-500">Select Existing Destination</label>
              <select
                onChange={(e) => handleSelectDestination(index + 1, e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm font-medium cursor-pointer"
              >
                <option value="">-- Choose Existing Destination --</option>
                {destinations.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => openSaveDestinationModal(index + 1)}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-all border border-indigo-100 h-[38px] flex items-center justify-center gap-1 w-full md:w-auto"
            >
              <span>💾</span> Save as New Destination
            </button>
          </div>

          <label htmlFor={`title${index + 1}`} className="block text-sm font-medium text-gray-900">Plan title {index + 1}</label>
          <input id={`title${index + 1}`} name={`title${index + 1}`} value={formData[`title${index + 1}`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

          <label htmlFor={`coordinatesleft${index + 1}`} className="block text-sm font-medium text-gray-900">Plan coordinatesleft {index + 1}</label>
          <input id={`coordinatesleft${index + 1}`} name={`coordinatesleft${index + 1}`} value={formData[`coordinatesleft${index + 1}`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

          <label htmlFor={`coordinatesright${index + 1}`} className="block text-sm font-medium text-gray-900">Plan coordinatesright {index + 1}</label>
          <input id={`coordinatesright${index + 1}`} name={`coordinatesright${index + 1}`} value={formData[`coordinatesright${index + 1}`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />



          <label htmlFor={`description${index + 1}`} className="block text-sm font-medium text-gray-900">Plan description {index + 1}</label>
          <textarea id={`description${index + 1}`} name={`description${index + 1}`} value={formData[`description${index + 1}`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

          <label htmlFor={`link${index + 1}`} className="block text-sm font-medium text-gray-900">Blog Link {index + 1}</label>
          <input id={`link${index + 1}`} name={`link${index + 1}`} value={formData[`link${index + 1}`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
      ))}

      <div className='flex justify-between'>
        <button type="button" onClick={handleSubmit} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">Save</button>

        {onNext ? (
          <button type="button" onClick={onNext} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">
            Next to Edit Tour Image
          </button>
        ) : (
          <Link href={'/add-tour-package/add-tour-image'} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">
            Next to Edit Tour Image
          </Link>
        )}
      </div>

      {/* Save Destination Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Save as New Destination</h3>
            <p className="text-xs text-gray-500">This will add the location to your destinations database for reuse in other packages.</p>
            
            <div className="space-y-3">
              <div>
                <label className="block mb-1 text-xs font-bold text-gray-500">Destination Name</label>
                <input
                  type="text"
                  value={modalData.name}
                  onChange={(e) => setModalData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none text-sm font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-xs font-bold text-gray-500">Latitude</label>
                  <input
                    type="text"
                    value={modalData.lat}
                    onChange={(e) => setModalData(prev => ({ ...prev, lat: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-bold text-gray-500">Longitude</label>
                  <input
                    type="text"
                    value={modalData.lng}
                    onChange={(e) => setModalData(prev => ({ ...prev, lng: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none text-sm font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-gray-500">Description</label>
                <textarea
                  value={modalData.description}
                  onChange={(e) => setModalData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none text-sm font-medium resize-none"
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-gray-500">Destination Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setModalData(prev => ({ ...prev, file: e.target.files[0] }))}
                  className="w-full text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSave}
                className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-200"
              >
                Save Destination
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddTourPlan;
