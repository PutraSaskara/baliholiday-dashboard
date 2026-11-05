"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useTourStore from '../stores/useTourStore';
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';
import useDestinationStore from '../stores/useDestinationStore';
import FormShell from './forms/FormShell';
import FormActions from './forms/FormActions';
import Button, { buttonClass } from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import { useToast } from './ui/Toast';

function AddTourPlan() {
  const { 
    tours: tourOptions, 
    fetchTours, 
    draftTour,
    draftTourPlan,
    setDraftTourPlan,
    hasUnsavedTourChanges
  } = useTourStore();
  const toast = useToast();

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
      toast.error("Name, Latitude, Longitude, and Description are required to save a destination.");
      return;
    }
    if (!modalData.file) {
      toast.error("Please select an image file for the destination.");
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
      toast.success("Destination saved successfully!");
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
      toast.error(res.message || "Failed to save destination.");
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
      toast.error("Please choose a Tour Title to associate this plan with.");
      return;
    }

    setDraftTourPlan(formData);

    toast.success('Draft Plan saved locally. Please proceed to the next step!');
    setIsSaved(true);
  };

  if (!mounted) return null;

  return (
    <FormShell
      title="Tour Itinerary"
      description="Detail each stop of the journey with coordinates and descriptions."
      actions={
        <FormActions
          left={
            <>
              <Link
                href={'/add-tour-package/add-tour-desc'}
                className={buttonClass({ variant: "secondary" })}
              >
                Back
              </Link>
              <Button variant="secondary" onClick={handleSubmit}>
                {isSaved ? 'Draf Saved' : 'Save as Draf'}
              </Button>
            </>
          }
          right={
            isSaved ? (
              <Link href={'/add-tour-package/add-other'} className={buttonClass()}>
                Continue to Other Info
              </Link>
            ) : (
              <Button disabled>Continue to Other Info</Button>
            )
          }
        />
      }
    >
      <div className="space-y-8">
        {/* Draft Mode Notice */}
        {draftTour && (
            <div className="flex items-center gap-4 rounded-xl border border-brand-200 bg-brand-50 p-4">
                <div>
                    <h4 className="font-semibold text-brand-900">Draft Mode Active</h4>
                    <p className="text-sm text-brand-700">Assigning itinerary to &quot;{draftTour.title}&quot;</p>
                </div>
            </div>
        )}

        {!draftTour && (
            <Select
                label="Select Target Tour"
                name="tourId"
                required
                value={formData.tourId}
                onChange={handleChange}
            >
                <option value="">Choose a Tour Package...</option>
                {tourOptions.map(tour => (
                    <option key={tour?.id} value={tour?.id}>{tour?.title}</option>
                ))}
            </Select>
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
                                    <Input
                                        label="Search & Select Destination"
                                        name={`search-destination-${index + 1}`}
                                        placeholder="Search destination name..."
                                        value={searchQueries[index + 1] !== undefined ? searchQueries[index + 1] : (formData[`title${index + 1}`] || '')}
                                        onChange={(e) => {
                                            setSearchQueries(prev => ({ ...prev, [index + 1]: e.target.value }));
                                            setOpenDropdown(index + 1);
                                        }}
                                        onFocus={() => setOpenDropdown(index + 1)}
                                        onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
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
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => openSaveDestinationModal(index + 1)}
                                    className="w-full md:w-auto"
                                >
                                    Save as New Destination
                                </Button>
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
                                        <Input
                                            label="Blog Article Link (Optional)"
                                            name={`link${index + 1}`}
                                            placeholder="https://baliholiday.xyz/blog/..."
                                            value={formData[`link${index + 1}`]} 
                                            onChange={handleChange} 
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

      {/* Save Destination Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Save as New Destination</h3>
            <p className="text-xs text-gray-500">This will add the location to your destinations database for reuse in other packages.</p>
            
            <div className="space-y-3">
              <Input
                label="Destination Name"
                name="modal-destination-name"
                value={modalData.name}
                onChange={(e) => setModalData(prev => ({ ...prev, name: e.target.value }))}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  label="Latitude"
                  name="modal-destination-lat"
                  value={modalData.lat}
                  onChange={(e) => setModalData(prev => ({ ...prev, lat: e.target.value }))}
                />
                <Input
                  label="Longitude"
                  name="modal-destination-lng"
                  value={modalData.lng}
                  onChange={(e) => setModalData(prev => ({ ...prev, lng: e.target.value }))}
                />
              </div>
              <Textarea
                label="Description"
                name="modal-destination-description"
                rows={3}
                value={modalData.description}
                onChange={(e) => setModalData(prev => ({ ...prev, description: e.target.value }))}
              />
              <Input
                label="Destination Image"
                name="modal-destination-image"
                type="file"
                accept="image/*"
                onChange={(e) => setModalData(prev => ({ ...prev, file: e.target.files[0] }))}
                className="text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium"
              />
            </div>

            <div className="flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleModalSave}>
                Save Destination
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </FormShell>
  );
}

export default AddTourPlan;
