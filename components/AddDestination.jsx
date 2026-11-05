// src/components/AddDestination.jsx
"use client";

import { useState, useEffect } from "react";
import useDestinationStore from "../stores/useDestinationStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "./ui/Toast";
import FormShell from "./forms/FormShell";
import FormSection from "./forms/FormSection";
import FormActions from "./forms/FormActions";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";

function AddDestination() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    lat: "",
    lng: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const router = useRouter();

  const { createDestination } = useDestinationStore();

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
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/webp") {
        setImage(file);
        // Generate a preview URL
        const previewURL = URL.createObjectURL(file);
        setImagePreview(previewURL);
      } else {
        toast.error("Please upload an image in WEBP format.");
        // Reset the file input if the file type is incorrect
        e.target.value = "";
        setImage(null);
        setImagePreview(null);
      }
    } else {
      // If no file is selected
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Image is required and must be in WEBP format.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("lat", formData.lat);
    data.append("lng", formData.lng);
    data.append("image", image);

    const { success, message } = await createDestination(data);

    if (success) {
      toast.success("Destination added successfully!");
      router.push("/destinations");
    } else {
      toast.error(message || "Failed to add destination.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormShell
        title="Add New Destination"
        description="Create a new travel destination with coordinates and photos."
        actions={
          <FormActions
            left={
              <Button type="button" variant="secondary" onClick={() => router.back()}>
                Cancel
              </Button>
            }
            right={<Button type="submit">Publish Destination</Button>}
          />
        }
      >
        <FormSection columns={1}>
          <Input
            label="Destination Name"
            name="name"
            required
            placeholder="e.g. Tanah Lot Temple"
            value={formData.name}
            onChange={handleChange}
          />
          <Textarea
            label="Description"
            name="description"
            required
            rows={5}
            placeholder="Describe the magic of this destination..."
            value={formData.description}
            onChange={handleChange}
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
            />
          </div>

          <div className="sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Cover Image (.webp)
            </span>
            <div
              className={`relative group aspect-video overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ${
                imagePreview
                  ? "border-brand-500"
                  : "border-slate-300 bg-slate-50 hover:border-brand-400"
              }`}
            >
              {imagePreview ? (
                <div className="absolute inset-0">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer rounded-full bg-white px-8 py-3 text-sm font-bold text-brand-700 shadow-2xl"
                    >
                      Change Destination Photo
                    </label>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center p-8 text-center"
                >
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-slate-100 bg-white shadow-xl">
                    <svg className="h-7 w-7 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                  </div>
                  <span className="text-sm font-bold text-slate-700">Drop your .webp image here</span>
                  <span className="mt-1 text-xs text-slate-400">Recommended: High resolution HD quality</span>
                </label>
              )}
              <input id="image-upload" type="file" accept="image/webp" onChange={handleImageChange} className="hidden" />
            </div>
          </div>
        </FormSection>
      </FormShell>
    </form>
  );
}

export default AddDestination;
