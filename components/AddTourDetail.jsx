"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useTourStore from '../stores/useTourStore';
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';
import FormShell from './forms/FormShell';
import FormSection from './forms/FormSection';
import FormActions from './forms/FormActions';
import Button, { buttonClass } from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { useToast } from './ui/Toast';

function AddTourDetail() {
  const { 
    tours: tourOptions, 
    fetchTours, 
    draftTour,
    draftTourDetail,
    setDraftTourDetail,
    hasUnsavedTourChanges
  } = useTourStore();
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
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useWarnIfUnsavedChanges(hasUnsavedTourChanges);

  useEffect(() => {
    setMounted(true);
    if (draftTourDetail) {
        setFormData(draftTourDetail);
        setIsSaved(true);
    }
    if (!draftTour) {
        fetchTours();
    }
  }, [fetchTours, draftTour, draftTourDetail]);

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
      toast.error("Please choose a Tour Title to associate these details with.");
      return;
    }

    setDraftTourDetail(formData);

    toast.success('Draft Detail saved locally. Please proceed to the next step!');
    setIsSaved(true);
  };

  if (!mounted) return null;

  return (
    <FormShell
      title="Tour Details"
      description="Add the key features and highlights that make this tour special."
      actions={
        <FormActions
          left={
            <>
              <Link
                href={'/add-tour-package/add-tour'}
                className={buttonClass({ variant: "secondary" })}
              >
                Back
              </Link>
              <Button variant="secondary" onClick={handleSubmit}>
                {isSaved ? 'Draft Saved' : 'Save as Draft'}
              </Button>
            </>
          }
          right={
            isSaved ? (
              <Link
                href={'/add-tour-package/add-tour-desc'}
                className={buttonClass()}
              >
                Continue to Descriptions
              </Link>
            ) : (
              <Button disabled>Continue to Descriptions</Button>
            )
          }
        />
      }
    >
      <div className="space-y-8">
        {/* Draft Mode Notice */}
        {draftTour ? (
          <div className="flex items-center gap-4 rounded-xl border border-brand-200 bg-brand-50 p-4">
            <div>
              <h4 className="font-semibold text-brand-900">Draft Mode Active</h4>
              <p className="text-sm text-brand-700">
                Assigning details to &quot;{draftTour.title}&quot;
              </p>
            </div>
          </div>
        ) : null}

        {!draftTour ? (
          <Select
            label="Select Target Tour"
            name="tourId"
            required
            value={formData.tourId}
            onChange={handleChange}
            placeholder="Choose a Tour Package..."
            options={tourOptions.map((tour) => ({
              value: tour?.id,
              label: tour?.title,
            }))}
          />
        ) : null}

        <FormSection title="Key Highlights" columns={1}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(9)].map((_, index) => (
              <Input
                key={index}
                label={`Highlight ${index + 1}`}
                name={`detail${index + 1}`}
                placeholder={`Detail highlight #${index + 1}`}
                value={formData[`detail${index + 1}`]}
                onChange={handleChange}
              />
            ))}
          </div>
        </FormSection>
      </div>
    </FormShell>
  );
}

export default AddTourDetail;
