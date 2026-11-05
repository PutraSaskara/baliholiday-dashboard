"use client";

import { useState, useEffect, useCallback } from "react";
import useDestinationStore from "../stores/useDestinationStore";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useToast } from "./ui/Toast";
import FormShell from "./forms/FormShell";
import FormSection from "./forms/FormSection";
import FormActions from "./forms/FormActions";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";

function EditDestination() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    lat: "",
    lng: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  const { fetchDestinationById, updateDestination, loading } = useDestinationStore();

  const fetchDestination = useCallback(async () => {
    if (!id) return;
    const data = await fetchDestinationById(id);
    if (data) {
      const { name, description, lat, lng, image } = data;
      setFormData({ name, description, lat, lng });
      setExistingImage(image);
    }
  }, [id, fetchDestinationById]);

  useEffect(() => {
    fetchDestination();
  }, [id, fetchDestination]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/webp") {
        setImage(file);
        const previewURL = URL.createObjectURL(file);
        setImagePreview(previewURL);
      } else {
        toast.error("Please upload an image in WEBP format.");
        e.target.value = "";
        setImage(null);
        setImagePreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("lat", formData.lat);
    data.append("lng", formData.lng);
    if (image) {
      data.append("image", image);
    }

    const { success, message } = await updateDestination(id, data);
    if (success) {
      toast.success("Destination updated successfully!");
      router.push("/destinations");
    } else {
      toast.error(message || "Failed to update destination.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormShell
        title="Edit Destination"
        description="Update travel destination details, coordinates, and photos."
        actions={
          <FormActions
            left={
              <Button type="button" variant="secondary" onClick={() => router.back()}>
                Cancel
              </Button>
            }
            right={
              <Button type="submit" loading={loading}>
                {loading ? "Updating..." : "Save Changes"}
              </Button>
            }
          />
        }
      >
        {loading && !formData.name ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-brand-600"></div>
            <p className="font-medium text-slate-500">Loading destination data...</p>
          </div>
        ) : (
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
              rows={6}
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
                Destination Image (.webp)
              </span>
              <div
                className={`relative group aspect-video overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ${
                  imagePreview || existingImage
                    ? "border-brand-500"
                    : "border-slate-300 bg-slate-50 hover:border-brand-400"
                }`}
              >
                {imagePreview || existingImage ? (
                  <div className="absolute inset-0">
                    <Image src={imagePreview || existingImage} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer rounded-full bg-white px-8 py-3 text-sm font-bold text-slate-900 shadow-2xl"
                      >
                        Replace Current Image
                      </label>
                      <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-white/60">
                        {imagePreview ? "Newly Selected" : "Existing Image"}
                      </p>
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
                    <span className="text-sm font-bold text-slate-700">Change Image (.webp)</span>
                  </label>
                )}
                <input id="image-upload" type="file" accept="image/webp" onChange={handleImageChange} className="hidden" />
              </div>
              <p className="mt-3 text-center text-xs italic text-slate-400">
                Leave blank if you don&apos;t want to change the image.
              </p>
            </div>
          </FormSection>
        )}
      </FormShell>
    </form>
  );
}

export default EditDestination;

