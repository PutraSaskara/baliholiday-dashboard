// src/components/AddArea.jsx
"use client";

import { useState, useEffect } from "react";
import useAreaStore from "../stores/useAreaStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "./ui/Toast";
import FormShell from "./forms/FormShell";
import FormSection from "./forms/FormSection";
import FormActions from "./forms/FormActions";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";

function AddArea() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    lat: "",
    lng: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [errors, setErrors] = useState({}); // State for form errors
  const router = useRouter();

  const { createArea } = useAreaStore();

  // Cleanup the object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear errors as the user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/webp") {
        setImage(file);
        // Generate a preview URL
        const previewURL = URL.createObjectURL(file);
        setImagePreview(previewURL);
        // Clear any previous image errors
        setErrors({ ...errors, image: null });
      } else {
        // Reset the file input if the file type is incorrect
        e.target.value = "";
        setImage(null);
        setImagePreview(null);
        setErrors({ ...errors, image: "Please upload an image in WEBP format." });
      }
    } else {
      // If no file is selected
      setImage(null);
      setImagePreview(null);
      setErrors({ ...errors, image: "Image is required and must be in WEBP format." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic front-end validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (!formData.lat) newErrors.lat = "Latitude is required.";
    if (!formData.lng) newErrors.lng = "Longitude is required.";
    if (!image) newErrors.image = "Image is required and must be in WEBP format.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("lat", formData.lat);
    data.append("lng", formData.lng);
    data.append("image", image);

    const { success, status, data: responseData, message } = await createArea(data);

    if (success) {
      toast.success("Pickup Area added successfully!");
      router.push("/pickup-areas");
    } else {
      if (status === 400 && responseData && responseData.errors) {
        const serverErrors = {};
        responseData.errors.forEach((err) => {
          serverErrors[err.param] = err.msg;
        });
        setErrors(serverErrors);
        toast.error("Please fix the highlighted errors and try again.");
      } else if (status === 404) {
        toast.error("Resource not found.");
      } else {
        toast.error(message || "An error occurred. Please try again later.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormShell
        title="Add Pickup Area"
        description="Define a new pickup location for your tour packages."
        actions={
          <FormActions
            left={
              <Button type="button" variant="secondary" onClick={() => router.back()}>
                Cancel
              </Button>
            }
            right={<Button type="submit">Save Pickup Area</Button>}
          />
        }
      >
        <FormSection columns={1}>
          <Input
            label="Area Name"
            name="name"
            required
            placeholder="e.g. Seminyak Square"
            value={formData.name}
            onChange={handleChange}
            error={errors.name || undefined}
          />
          <Textarea
            label="Description"
            name="description"
            required
            rows={5}
            placeholder="Key landmarks or pickup instructions..."
            value={formData.description}
            onChange={handleChange}
            error={errors.description || undefined}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Latitude"
              name="lat"
              type="number"
              step="any"
              required
              placeholder="-8.123456"
              value={formData.lat}
              onChange={handleChange}
              error={errors.lat || undefined}
            />
            <Input
              label="Longitude"
              name="lng"
              type="number"
              step="any"
              required
              placeholder="115.123456"
              value={formData.lng}
              onChange={handleChange}
              error={errors.lng || undefined}
            />
          </div>

          <div className="sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Area Photo (.webp)
            </span>
            <div
              className={`relative group aspect-video overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ${
                imagePreview
                  ? "border-brand-500"
                  : errors.image
                  ? "border-red-300 bg-red-50"
                  : "border-slate-300 bg-slate-50 hover:border-brand-400"
              }`}
            >
              {imagePreview ? (
                <div className="absolute inset-0">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <label
                      htmlFor="area-image-upload"
                      className="cursor-pointer rounded-full bg-white px-8 py-3 text-sm font-bold text-brand-700 shadow-2xl"
                    >
                      Change Area Photo
                    </label>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="area-image-upload"
                  className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center p-8 text-center"
                >
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-slate-100 bg-white shadow-xl">
                    <svg className="h-7 w-7 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                  </div>
                  <span className="text-sm font-bold text-slate-700">Select area photo</span>
                  <span className={`mt-1 text-xs ${errors.image ? "text-red-500" : "text-slate-400"}`}>
                    .webp format required
                  </span>
                </label>
              )}
              <input
                id="area-image-upload"
                type="file"
                accept="image/webp"
                onChange={handleImageChange}
                aria-invalid={errors.image ? true : undefined}
                aria-describedby={errors.image ? "area-image-upload-error" : undefined}
                className="hidden"
              />
            </div>
            {errors.image ? (
              <p id="area-image-upload-error" role="alert" className="mt-1.5 text-center text-sm text-red-600">{errors.image}</p>
            ) : null}
          </div>
        </FormSection>
      </FormShell>
    </form>
  );
}

export default AddArea;
