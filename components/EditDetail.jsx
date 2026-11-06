"use client";
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import useTourStore from '../stores/useTourStore';
import AIAssistantModal from './AIAssistantLazy';
import { useToast } from "./ui/Toast";
import FormShell from './forms/FormShell';
import FormSection from './forms/FormSection';
import FormActions from './forms/FormActions';
import Button, { buttonClass } from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

function EditDetail({ tourDetailId, onNext }) {
  const toast = useToast();
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
      toast.success('Tour details successfully updated.');
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
    const updatedDetail = { ...formData };
    for (let i = 1; i <= 9; i++) {
      if (generatedData[`detail${i}`]) updatedDetail[`detail${i}`] = generatedData[`detail${i}`];
    }
    setFormData(updatedDetail);
  };

  return (
    <FormShell
      title="Edit Tour Detail"
      description="*Tour Detail is for showing to customers what they will get (e.g., 12 hours Tour, Private Car, Driver as Guide, etc.)"
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
                Next to Edit Tour Description
              </Button>
            ) : (
              <Link href={'/edit-tour-package/edit-tour-desc'} className={buttonClass()}>
                Next to Edit Tour Description
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

        <FormSection title="Key Highlights" columns={1}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(9)].map((_, index) => (
              <Input
                key={index}
                label={`Detail ${index + 1}`}
                name={`detail${index + 1}`}
                value={formData[`detail${index + 1}`]}
                onChange={handleChange}
              />
            ))}
          </div>
        </FormSection>
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
    </FormShell>
  );
}

export default EditDetail;
