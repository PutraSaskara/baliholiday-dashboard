"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useTourStore from '../stores/useTourStore';
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';
import { useToast } from "./ui/Toast";
import FormShell from './forms/FormShell';
import FormActions from './forms/FormActions';
import Button, { buttonClass } from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

function AddOther() {
  const toast = useToast();
  const {
    tours: tourOptions,
    fetchTours,
    draftTour,
    draftTourInclude,
    draftTourNotInclude,
    draftTourCancellation,
    setDraftTourInclude,
    setDraftTourNotInclude,
    setDraftTourCancellation,
    hasUnsavedTourChanges
  } = useTourStore();

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
  const [mounted, setMounted] = useState(false);
  
  const isAllSaved = isSaved1 && isSaved2 && isSaved3;

  useWarnIfUnsavedChanges(hasUnsavedTourChanges);

  useEffect(() => {
    setMounted(true);
    if (draftTourInclude) {
        setFormData1(draftTourInclude);
        setIsSaved1(true);
    }
    if (draftTourNotInclude) {
        setFormData2(draftTourNotInclude);
        setIsSaved2(true);
    }
    if (draftTourCancellation) {
        setFormData3(draftTourCancellation);
        setIsSaved3(true);
    }
    if (!draftTour) {
        fetchTours();
    }
  }, [fetchTours, draftTour, draftTourInclude, draftTourNotInclude, draftTourCancellation]);

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
    if (!draftTour && !formData1.tourId) return toast.error("Please specify Tour Title");
    setDraftTourInclude(formData1);
    setIsSaved1(true);
    toast.success('Draft Includes saved locally.');
  };

  const handleSubmit2 = async () => {
    if (!draftTour && !formData2.tourId) return toast.error("Please specify Tour Title");
    setDraftTourNotInclude(formData2);
    setIsSaved2(true);
    toast.success('Draft Not Includes saved locally.');
  };

  const handleSubmit3 = async () => {
    if (!draftTour && !formData3.tourId) return toast.error("Please specify Tour Title");
    setDraftTourCancellation(formData3);
    setIsSaved3(true);
    toast.success('Draft Cancellation saved locally.');
  };

  if (!mounted) return null;

  return (
    <FormShell
      title="Inclusions & Terms"
      description="Specify what's included in the package and define your policies."
      actions={
        <FormActions
          left={
            <>
              <Link
                href={'/add-tour-package/add-tour-plan'}
                className={buttonClass({ variant: "secondary" })}
              >
                Back
              </Link>
              <span className="text-sm font-medium text-slate-500">
                Step 5 of 6 Completed
              </span>
            </>
          }
          right={
            isAllSaved ? (
              <Link
                href={'/add-tour-package/add-tour-image'}
                className={buttonClass()}
              >
                Continue to Images
              </Link>
            ) : (
              <Button disabled>Complete All Sections to Continue</Button>
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
                    <p className="text-sm text-brand-700">Assigning policies to &quot;{draftTour.title}&quot;</p>
                </div>
            </div>
        )}

        {!draftTour && (
            <Select
                label="Select Target Tour"
                name="tourId"
                required
                value={formData1.tourId}
                onChange={handleChange}
            >
                <option value="">Choose a Tour Package...</option>
                {tourOptions.map(tour => (
                    <option key={tour.id} value={tour.id}>{tour.title}</option>
                ))}
            </Select>
        )}

        <div className="space-y-8">
            {/* Includes Section */}
            <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">What&apos;s Included</h2>
                    <Button variant="secondary" size="sm" onClick={handleSubmit1}>
                        {isSaved1 ? 'Saved' : 'Save Section'}
                    </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((num) => (
                        <Input
                            key={num}
                            label={`Included Item ${num}`}
                            name={`include${num}`}
                            placeholder={`Item #${num}`}
                            value={formData1[`include${num}`]}
                            onChange={handleChange}
                        />
                    ))}
                </div>
            </section>

            {/* Not Included Section */}
            <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">What&apos;s NOT Included</h2>
                    <Button variant="secondary" size="sm" onClick={handleSubmit2}>
                        {isSaved2 ? 'Saved' : 'Save Section'}
                    </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((num) => (
                        <Input
                            key={num}
                            label={`Not Included Item ${num}`}
                            name={`notinclude${num}`}
                            placeholder={`Item #${num}`}
                            value={formData2[`notinclude${num}`]}
                            onChange={handleChange}
                        />
                    ))}
                </div>
            </section>

            {/* Cancellation Section */}
            <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cancellation Policy</h2>
                    <Button variant="secondary" size="sm" onClick={handleSubmit3}>
                        {isSaved3 ? 'Saved' : 'Save Section'}
                    </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[1, 2].map((num) => (
                        <Input
                            key={num}
                            label={`Cancellation Clause ${num}`}
                            name={`cancel${num}`}
                            placeholder={`Clause #${num}`}
                            value={formData3[`cancel${num}`]}
                            onChange={handleChange}
                        />
                    ))}
                </div>
            </section>
        </div>
      </div>
    </FormShell>
  );
}

export default AddOther;
