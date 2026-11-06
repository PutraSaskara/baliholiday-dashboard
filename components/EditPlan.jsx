"use client"
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import useTourStore from '../stores/useTourStore';
import useDestinationStore from '../stores/useDestinationStore';
import AIAssistantModal from './AIAssistantLazy';
import { useToast } from "./ui/Toast";
import FormShell from './forms/FormShell';
import FormSection from './forms/FormSection';
import FormActions from './forms/FormActions';
import Button, { buttonClass } from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';

function AddTourPlan({ tourId, onNext }) {
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
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

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
        // We do not overwrite link${stopNum} here so they can keep their blog link
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
    const { success, status, data, message } = await updateTourPlan(tourId, formData);

    if (success) {
      toast.success('Tour plan saved successfully!');
    } else {
      if (status) {
        console.error('Server responded with error status:', status);
        const errorMessage = data ? JSON.stringify(data) : message;
        toast.error(`Server responded with an error: ${status}. ${errorMessage}`);
      } else {
        toast.error(message || 'An error occurred during update.');
      }
    }
  };

  const handleApplyAI = (generatedData) => {
    const updatedPlan = { ...formData };
    for (let i = 1; i <= 9; i++) {
      if (generatedData[`description${i}`]) updatedPlan[`description${i}`] = generatedData[`description${i}`];
    }
    setFormData(updatedPlan);
  };

  return (
    <FormShell
      title="Edit Tour Plan"
      description="*Blog Link use for put baliholiday article link relate with Tour Title (ex: https://baliholiday.xyz/blog/explaination-about-monkey-forest)"
      headerExtra={
        <div className="mt-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsAIModalOpen(true)}
            disabled={!formData.tourId}
          >
            Review &amp; AI Auto-fill
          </Button>
        </div>
      }
      actions={
        <FormActions
          left={
            <Button type="button" onClick={handleSubmit}>
              Save
            </Button>
          }
          right={
            onNext ? (
              <Button type="button" onClick={onNext}>
                Next to Edit Tour Image
              </Button>
            ) : (
              <Link href={'/add-tour-package/add-tour-image'} className={buttonClass()}>
                Next to Edit Tour Image
              </Link>
            )
          }
        />
      }
    >
      <div className="space-y-6">
        <Select
          label="Choose Tour Title For this Tour Plan"
          name="tourId"
          value={formData.tourId}
          onChange={handleChange}
        >
          <option value="">Select a Tour</option>
          {tourOptions.map(tour => (
            <option key={tour?.id} value={tour?.id}>{tour?.title}</option>
          ))}
        </Select>

        <FormSection title="Daily Stops / Plan Steps" columns={1}>
          <div className="space-y-4">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="relative flex-1 space-y-2">
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
                      <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-overlay">
                        {destinations.filter(d =>
                          d.name.toLowerCase().includes((searchQueries[index + 1] || '').toLowerCase())
                        ).map(d => (
                          <div
                            key={d.id}
                            className="cursor-pointer border-b border-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors last:border-0 hover:bg-brand-50 hover:text-brand-700"
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
                          <div className="px-4 py-3 text-center text-xs italic text-slate-400">No destinations found</div>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => openSaveDestinationModal(index + 1)}
                    className="w-full sm:w-auto"
                  >
                    Save as New Destination
                  </Button>
                </div>

                {formData[`title${index + 1}`] ? (
                  <div className="flex flex-col gap-4 rounded-xl border border-brand-200 bg-brand-50/50 p-4">
                    <div className="flex gap-4 items-start">
                      {(formData[`image${index + 1}`] || (formData[`link${index + 1}`] && (formData[`link${index + 1}`].includes('cloudinary') || formData[`link${index + 1}`].match(/\.(jpeg|jpg|gif|png|webp)$/i)))) ? (
                        <img 
                          src={(formData[`image${index + 1}`] || formData[`link${index + 1}`]).startsWith('http') ? (formData[`image${index + 1}`] || formData[`link${index + 1}`]) : `${process.env.NEXT_PUBLIC_MAIN_API || 'http://localhost:5000'}${formData[`image${index + 1}`] || formData[`link${index + 1}`]}`} 
                          alt={formData[`title${index + 1}`]}
                          className="h-24 w-24 flex-shrink-0 rounded-xl object-cover shadow-sm"
                        />
                      ) : (
                        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-400">
                          📷
                        </div>
                      )}
                      <div className="min-w-0 flex-1 space-y-2">
                        <h3 className="text-sm font-bold text-slate-900">{formData[`title${index + 1}`]}</h3>
                        <div className="flex w-max gap-3 rounded-lg border border-slate-100 bg-white px-2 py-1 text-[10px] font-bold text-slate-500 shadow-sm">
                          <span>Lat: {formData[`coordinatesleft${index + 1}`]}</span>
                          <span className="text-slate-300">|</span>
                          <span>Lng: {formData[`coordinatesright${index + 1}`]}</span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-600 line-clamp-3">{formData[`description${index + 1}`]}</p>
                      </div>
                    </div>
                    <div className="w-full border-t border-brand-200 pt-3">
                      <Input
                        label="Blog Article Link (Optional)"
                        name={`link${index + 1}`}
                        placeholder="https://baliholiday.xyz/blog/..."
                        value={formData[`link${index + 1}`] || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                    <span className="mb-2 text-2xl">🗺️</span>
                    <p className="text-xs font-bold text-slate-400">No destination selected yet</p>
                    <p className="mt-1 text-[10px] text-slate-400">Select a destination above or save a new one to preview it here.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </FormSection>
      </div>

      {/* Save Destination Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md space-y-4 rounded-xl bg-white p-5 shadow-overlay">
            <h3 className="text-base font-semibold text-slate-900">Save as New Destination</h3>
            <p className="text-xs text-slate-500">This will add the location to your destinations database for reuse in other packages.</p>

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
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="primary" onClick={handleModalSave}>
                Save Destination
              </Button>
            </div>
          </div>
        </div>
      )}

      <AIAssistantModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        mode="edit"
        tourId={formData.tourId}
        targetSection="plan"
        drafts={formData}
        onApply={handleApplyAI}
      />
    </FormShell>
  );
}

export default AddTourPlan;
