"use client"
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import useTourStore from '../stores/useTourStore';
import { useToast } from "./ui/Toast";
import FormShell from './forms/FormShell';
import FormSection from './forms/FormSection';
import FormActions from './forms/FormActions';
import Button, { buttonClass } from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

function EditOther({ Id }) {
  const toast = useToast();
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
    tourId: ''
  });

  const {
    tours: tourOptions,
    fetchTours,
    fetchTourInclude,
    fetchTourNotInclude,
    fetchTourCancellation,
    updateTourInclude,
    updateTourNotInclude,
    updateTourCancellation
  } = useTourStore();

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const loadData = useCallback(async () => {
    if (!Id) return;

    const includeData = await fetchTourInclude(Id);
    if (includeData && Object.keys(includeData).length > 0) setFormData1(includeData);

    const notIncludeData = await fetchTourNotInclude(Id);
    if (notIncludeData && Object.keys(notIncludeData).length > 0) setFormData2(notIncludeData);

    const cancelData = await fetchTourCancellation(Id);
    if (cancelData && Object.keys(cancelData).length > 0) setFormData3(cancelData);

  }, [Id, fetchTourInclude, fetchTourNotInclude, fetchTourCancellation]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
    const { success, status, data, message } = await updateTourInclude(Id, formData1);
    if (success) {
      toast.success('Tour includes successfully updated.');
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

  const handleSubmit2 = async () => {
    const { success, status, data, message } = await updateTourNotInclude(Id, formData2);
    if (success) {
      toast.success('Tour not includes successfully updated.');
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

  const handleSubmit3 = async () => {
    const { success, status, data, message } = await updateTourCancellation(Id, formData3);
    if (success) {
      toast.success('Tour cancellation successfully updated.');
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

  return (
    <FormShell
      title="Edit Tour Include, Not Include, and Cancellation"
      description="Update what is included, what is not included, and the cancellation policy for this tour."
      actions={
        <FormActions
          left={
            <Link href={'/'} className={buttonClass({ variant: "secondary" })}>
              Back to Dashboard
            </Link>
          }
          right={
            <>
              <Button type="button" onClick={handleSubmit1}>
                Save Include
              </Button>
              <Button type="button" onClick={handleSubmit2}>
                Save Not Include
              </Button>
              <Button type="button" onClick={handleSubmit3}>
                Save Cancellation
              </Button>
            </>
          }
        />
      }
    >
      <div className="space-y-8">
        {/* Include Form */}
        <FormSection title="What's Included" columns={1}>
          <Select
            label="Choose Tour Title For this Tour Plan"
            name="tourId"
            value={formData1.tourId}
            onChange={handleChange}
          >
            <option value="">Select a Tour</option>
            {tourOptions.map(tour => (
              <option key={tour?.id} value={tour?.id}>{tour?.title}</option>
            ))}
          </Select>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <Input
                key={index}
                label={`Include ${index + 1}`}
                name={`include${index + 1}`}
                value={formData1[`include${index + 1}`]}
                onChange={handleChange}
              />
            ))}
          </div>
        </FormSection>

        {/* Not Include Form */}
        <FormSection title="What's NOT Included" columns={1}>
          <Select
            label="Choose Tour Title For this Tour Plan"
            name="tourId"
            value={formData2.tourId}
            onChange={handleChange}
          >
            <option value="">Select a Tour</option>
            {tourOptions.map(tour => (
              <option key={tour?.id} value={tour?.id}>{tour?.title}</option>
            ))}
          </Select>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <Input
                key={index}
                label={`Not Include ${index + 1}`}
                name={`notinclude${index + 1}`}
                value={formData2[`notinclude${index + 1}`]}
                onChange={handleChange}
              />
            ))}
          </div>
        </FormSection>

        {/* Cancellation Form */}
        <FormSection title="Cancellation" columns={1}>
          <Select
            label="Choose Tour Title For this Tour Plan"
            name="tourId"
            value={formData3.tourId}
            onChange={handleChange}
          >
            <option value="">Select a Tour</option>
            {tourOptions.map(tour => (
              <option key={tour?.id} value={tour?.id}>{tour?.title}</option>
            ))}
          </Select>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(2)].map((_, index) => (
              <Input
                key={index}
                label={`Cancellation ${index + 1}`}
                name={`cancel${index + 1}`}
                value={formData3[`cancel${index + 1}`]}
                onChange={handleChange}
              />
            ))}
          </div>
        </FormSection>
      </div>
    </FormShell>
  );
}

export default EditOther;
