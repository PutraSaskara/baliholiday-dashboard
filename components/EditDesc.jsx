"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import useTourStore from "../stores/useTourStore";
import AIAssistantModal from './AIAssistantLazy';
import { useToast } from "./ui/Toast";
import FormShell from './forms/FormShell';
import FormSection from './forms/FormSection';
import FormActions from './forms/FormActions';
import Button, { buttonClass } from './ui/Button';
import Select from './ui/Select';
import Textarea from './ui/Textarea';

function EditDesc({ tourId, onNext }) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    paragraf1: "",
    paragraf2: "",
    paragraf3: "",
    paragraf3: "",
    tourId: "",
  });
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const { tours: tourOptions, fetchTours, fetchTourDesc, updateTourDesc } = useTourStore();

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const loadTourDescData = useCallback(async () => {
    if (!tourId) return;
    const data = await fetchTourDesc(tourId);
    if (data && Object.keys(data).length > 0) {
      setFormData(data);
    }
  }, [tourId, fetchTourDesc]);

  useEffect(() => {
    loadTourDescData();
  }, [loadTourDescData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { success, status, data, message } = await updateTourDesc(tourId, formData);

    if (success) {
      toast.success("Description saved successfully!");
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
    const updatedDesc = { ...formData };
    for (let i = 1; i <= 3; i++) {
      if (generatedData[`desc${i}`]) updatedDesc[`paragraf${i}`] = generatedData[`desc${i}`];
    }
    setFormData(updatedDesc);
  };

  return (
    <FormShell
      title="Edit Tour Description"
      description="*Tour Description is description related to Tour Title"
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
                Next to Edit Tour Plan
              </Button>
            ) : (
              <Link href={"/add-tour-package/add-tour-plan"} className={buttonClass()}>
                Next to Edit Tour Plan
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
          {tourOptions.map((tour) => (
            <option key={tour?.id} value={tour?.id}>
              {tour?.title}
            </option>
          ))}
        </Select>

        <FormSection title="Paragraphs" columns={1}>
          {[1, 2, 3].map((num) => (
            <Textarea
              key={num}
              label={`Paragraf ${num}`}
              name={`paragraf${num}`}
              rows={5}
              value={formData[`paragraf${num}`]}
              onChange={handleChange}
            />
          ))}
        </FormSection>
      </div>

      <AIAssistantModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        mode="edit"
        tourId={formData.tourId}
        targetSection="desc"
        drafts={formData}
        onApply={handleApplyAI}
      />
    </FormShell>
  );
}

export default EditDesc;
