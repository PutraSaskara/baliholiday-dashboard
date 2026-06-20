"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useTourStore from '../stores/useTourStore';
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';
import useDestinationStore from '../stores/useDestinationStore';

function AddTourPlan() {
  const { 
    tours: tourOptions, 
    fetchTours, 
    draftTour,
    draftTourPlan,
    setDraftTourPlan,
    hasUnsavedTourChanges
  } = useTourStore();

  const { fetchAllDestinationsList, createDestination } = useDestinationStore();
  const [destinations, setDestinations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQueries, setSearchQueries] = useState({});
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
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useWarnIfUnsavedChanges(hasUnsavedTourChanges);

  useEffect(() => {
    setMounted(true);
    if (draftTourPlan) {
        setFormData(draftTourPlan);
        setIsSaved(true);
    }
    if (!draftTour) {
        fetchTours();
    }
  }, [fetchTours, draftTour, draftTourPlan]);

  useEffect(() => {
    const loadDestinations = async () => {
      const list = await fetchAllDestinationsList();
      setDestinations(list);
    };
    loadDestinations();
  }, [fetchAllDestinationsList]);

  const handleSelectDestination = (stopNum, destinationId) => {
    if (!destinationId) {
      setFormData(prev => ({
        ...prev,
        [`title${stopNum}`]: '',
        [`coordinatesleft${stopNum}`]: '',
        [`coordinatesright${stopNum}`]: '',
        [`description${stopNum}`]: '',
        [`link${stopNum}`]: '',
        [`image${stopNum}`]: '',
      }));
      return;
    }
    const dest = destinations.find(d => String(d.id) === String(destinationId));
    if (dest) {
      setFormData(prev => ({
        ...prev,
        [`title${stopNum}`]: dest.name || '',
        [`coordinatesleft${stopNum}`]: String(dest.lat) || '',
        [`coordinatesright${stopNum}`]: String(dest.lng) || '',
        [`description${stopNum}`]: dest.description || '',
        [`image${stopNum}`]: dest.image || '',
        // We do not overwrite link${stopNum} here so they can keep their blog link if they change destination
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

    // Normalize coordinates (replace comma with dot, trim spaces)
    const formattedLat = String(modalData.lat).replace(',', '.').trim();
    const formattedLng = String(modalData.lng).replace(',', '.').trim();

    const payload = new FormData();
    payload.append("name", modalData.name);
    payload.append("description", modalData.description);
    payload.append("lat", formattedLat);
    payload.append("lng", formattedLng);
    payload.append("image", modalData.file);

    const res = await createDestination(payload);
    if (res.success) {
      alert("Destination saved successfully!");
      const list = await fetchAllDestinationsList();
      setDestinations(list);
      
      const newDest = res.data || {};
      setFormData(prev => ({
        ...prev,
        [`title${modalData.stopNum}`]: newDest.name || modalData.name,
        [`coordinatesleft${modalData.stopNum}`]: newDest.lat || modalData.lat,
        [`coordinatesright${modalData.stopNum}`]: newDest.lng || modalData.lng,
        [`description${modalData.stopNum}`]: newDest.description || modalData.description,
        [`image${modalData.stopNum}`]: newDest.image || '',
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
    // Validation
    if (!draftTour && !formData.tourId) {
      alert("Please choose a Tour Title to associate this plan with.");
      return;
    }

    setDraftTourPlan(formData);
    
    console.log('Draft Plan saved locally:', formData);
    alert('Draft Plan saved locally. Please proceed to the next step!');
    setIsSaved(true);
  };

  if (!mounted) return null;

  return (
    <div className='max-w-4xl mx-auto py-10 px-4'>
      {/* Wizard Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 4 of 6</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Itinerary & Tour Plan</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="w-[66.66%] h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"></div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 transition-all duration-300">
        <header className="mb-10">
            <h1 className='text-3xl font-black tracking-tight text-gray-900 mb-2'>Tour Itinerary</h1>
            <p className="text-gray-500 text-lg">Detail each stop of the journey with coordinates and descriptions.</p>
        </header>

        {/* Draft Mode Notice */}
        {draftTour && (
            <div className="mb-10 p-5 rounded-3xl bg-blue-50/50 border border-blue-100/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                    <h4 className="text-blue-900 font-bold">Draft Mode Active</h4>
                    <p className="text-blue-700/80 text-sm">Assigning itinerary to &quot;{draftTour.title}&quot;</p>
                </div>
            </div>
        )}

        {!draftTour && (
            <div className="mb-10 group">
                <label htmlFor="tourId" className="block mb-2.5 text-sm font-bold text-gray-700 ml-1 group-focus-within:text-blue-600 transition-colors">Select Target Tour</label>
                <select 
                    id="tourId" 
                    name="tourId" 
                    value={formData.tourId} 
                    onChange={handleChange} 
                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-semibold appearance-none cursor-pointer shadow-sm"
                >
                    <option value="">Choose a Tour Package...</option>
                    {tourOptions.map(tour => (
                        <option key={tour?.id} value={tour?.id}>{tour?.title}</option>
                    ))}
                </select>
            </div>
        )}

        <div className="space-y-12">
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2 ml-1">Daily Stops / Plan Steps</h4>
            <div className="space-y-10">
                {[...Array(9)].map((_, index) => (
                    <div key={index} className="relative pl-12 border-l-2 border-dashed border-gray-100 pb-10 last:pb-0">
                        <div className="absolute left-[-13px] top-0 w-6 h-6 rounded-full bg-blue-500 border-4 border-white shadow-lg ring-4 ring-blue-50 flex items-center justify-center text-[8px] text-white font-bold">{index + 1}</div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="md:col-span-2 flex flex-col md:flex-row gap-4 items-end bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                <div className="flex-1 group w-full space-y-2 relative">
                                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Search & Select Destination</label>
                                    <input
                                        type="text"
                                        placeholder="🔍 Search destination name..."
                                        value={searchQueries[index + 1] !== undefined ? searchQueries[index + 1] : (formData[`title${index + 1}`] || '')}
                                        onChange={(e) => {
                                            setSearchQueries(prev => ({ ...prev, [index + 1]: e.target.value }));
                                            setOpenDropdown(index + 1);
                                        }}
                                        onFocus={() => setOpenDropdown(index + 1)}
                                        onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all outline-none font-semibold text-xs shadow-sm"
                                    />
                                    
                                    {openDropdown === index + 1 && (
                                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto top-[60px]">
                                            {destinations.filter(d => 
                                                d.name.toLowerCase().includes((searchQueries[index + 1] || '').toLowerCase())
                                            ).map(d => (
                                                <div 
                                                    key={d.id} 
                                                    className="px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                                                    onMouseDown={() => {
                                                        handleSelectDestination(index + 1, d.id);
                                                        setSearchQueries(prev => ({ ...prev, [index + 1]: d.name }));
                                                        setOpenDropdown(null);
                                                    }}
                                                >
                                                    {d.name}
                                                </div>
                                            ))}
                                            {destinations.filter(d => 
                                                d.name.toLowerCase().includes((searchQueries[index + 1] || '').toLowerCase())
                                            ).length === 0 && (
                                                <div className="px-4 py-3 text-xs text-gray-400 italic text-center">No destinations found</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => openSaveDestinationModal(index + 1)}
                                    className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-xl transition-all shadow-sm h-[38px] flex items-center justify-center gap-1 w-full md:w-auto"
                                >
                                    <span>💾</span> Save as New Destination
                                </button>
                            </div>

                            {formData[`title${index + 1}`] ? (
                                <div className="md:col-span-2 mt-2 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex flex-col gap-4">
                                    <div className="flex gap-4 items-start">
                                        {(formData[`image${index + 1}`] || (formData[`link${index + 1}`] && (formData[`link${index + 1}`].includes('cloudinary') || formData[`link${index + 1}`].match(/\.(jpeg|jpg|gif|png|webp)$/i)))) ? (
                                            <img 
                                                src={(formData[`image${index + 1}`] || formData[`link${index + 1}`]).startsWith('http') ? (formData[`image${index + 1}`] || formData[`link${index + 1}`]) : `${process.env.NEXT_PUBLIC_MAIN_API || 'http://localhost:5000'}${formData[`image${index + 1}`] || formData[`link${index + 1}`]}`} 
                                                alt={formData[`title${index + 1}`]}
                                                className="w-24 h-24 object-cover rounded-xl shadow-sm flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 text-gray-400">
                                                📷
                                            </div>
                                        )}
                                        <div className="flex-1 space-y-2">
                                            <h5 className="font-bold text-gray-900 text-sm">{formData[`title${index + 1}`]}</h5>
                                            <div className="flex gap-3 text-[10px] text-gray-500 font-bold bg-white px-2 py-1 rounded-lg w-max shadow-sm border border-gray-100">
                                                <span>📍 Lat: {formData[`coordinatesleft${index + 1}`]}</span>
                                                <span className="text-gray-300">|</span>
                                                <span>Lng: {formData[`coordinatesright${index + 1}`]}</span>
                                            </div>
                                            <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{formData[`description${index + 1}`]}</p>
                                        </div>
                                    </div>
                                    <div className="w-full mt-2 border-t border-indigo-100 pt-3">
                                        <label className="block mb-1 text-[10px] font-black uppercase text-indigo-400 tracking-widest ml-1">🔗 Blog Article Link (Optional)</label>
                                        <input 
                                            type="text" 
                                            name={`link${index + 1}`}
                                            placeholder="https://baliholiday.xyz/blog/..."
                                            value={formData[`link${index + 1}`]} 
                                            onChange={handleChange} 
                                            className="w-full px-4 py-2 bg-white border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-400/50 outline-none font-medium text-xs text-indigo-700"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="md:col-span-2 mt-2 p-6 bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <span className="text-2xl mb-2">🗺️</span>
                                    <p className="text-xs font-bold text-gray-400">No destination selected yet</p>
                                    <p className="text-[10px] text-gray-400 mt-1">Select a destination above or save a new one to preview it here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className='mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4'>
            <button 
                type="button" 
                onClick={handleSubmit} 
                className="w-full sm:w-auto px-10 py-4 text-base font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
                {isSaved ? 'Draf Saved' : 'Save as Draf'}
            </button>

            {isSaved ? (
                <Link 
                    href={'/add-tour-package/add-other'} 
                    className="w-full sm:w-auto px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-center shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all duration-200"
                >
                    Continue to Other Info →
                </Link>
            ) : (
                <button 
                    disabled 
                    className="w-full sm:w-auto px-10 py-4 text-base font-bold text-gray-400 bg-gray-100 cursor-not-allowed rounded-2xl text-center"
                >
                    Continue to Other Info →
                </button>
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
    </div>
  );
}

export default AddTourPlan;
