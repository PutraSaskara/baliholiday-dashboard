"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useTourStore from '../stores/useTourStore';
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';
import FormShell from './forms/FormShell';
import FormSection from './forms/FormSection';
import FormActions from './forms/FormActions';
import Button, { buttonClass } from './ui/Button';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import { useToast } from './ui/Toast';

function AddTourDesc() {
  const { 
    tours: tourOptions, 
    fetchTours, 
    draftTour,
    draftTourDesc,
    setDraftTourDesc,
    hasUnsavedTourChanges
  } = useTourStore();
  const toast = useToast();

  const [formData, setFormData] = useState({
    paragraf1: '',
    paragraf2: '',
    paragraf3: '',
    tourId: ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useWarnIfUnsavedChanges(hasUnsavedTourChanges);

  useEffect(() => {
    setMounted(true);
    if (draftTourDesc) {
        setFormData(draftTourDesc);
        setIsSaved(true);
    }
    if (!draftTour) {
        fetchTours();
    }
  }, [fetchTours, draftTour, draftTourDesc]);

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
      toast.error("Please choose a Tour Title to associate this description with.");
      return;
    }

    setDraftTourDesc(formData);

    toast.success('Draft Description saved locally. Please proceed to the next step!');
    setIsSaved(true);
  };

  if (!mounted) return null;

  return (
    <FormShell
      title="Package Descriptions"
      description="Tell the story of the tour with engaging paragraphs."
      actions={
        <FormActions
          left={
            <>
              <Link
                href={'/add-tour-package/add-tour-detail'}
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
              <Link href={'/add-tour-package/add-tour-plan'} className={buttonClass()}>
                Continue to Tour Plan
              </Link>
            ) : (
              <Button disabled>Continue to Tour Plan</Button>
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
                Assigning descriptions to &quot;{draftTour.title}&quot;
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

        <FormSection title="Write Your Story" columns={1}>
          {[1, 2, 3].map((num) => (
            <Textarea
              key={num}
              label={`Paragraph ${num}`}
              name={`paragraf${num}`}
              rows={4}
              placeholder={`Start writing paragraph #${num}...`}
              value={formData[`paragraf${num}`]}
              onChange={handleChange}
            />
          ))}
        </FormSection>
      </div>
    </FormShell>
  );
}

export default AddTourDesc;
