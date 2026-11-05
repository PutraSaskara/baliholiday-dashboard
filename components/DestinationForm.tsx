// src/components/DestinationForm.tsx

"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import Image from "next/image";
import baseURL from "@/apiConfig";
import { useToast } from "./ui/Toast";
import FormShellRaw from "./forms/FormShell";
import FormSectionRaw from "./forms/FormSection";
import FormActionsRaw from "./forms/FormActions";
import ButtonRaw from "./ui/Button";
import InputRaw from "./ui/Input";
import TextareaRaw from "./ui/Textarea";

// Komponen UI berbasis JSX tidak punya deklarasi tipe, jadi TypeScript
// menganggap seluruh props-nya wajib. Di-cast ke `any` agar file ini tetap
// lulus type check tanpa mengubah perilaku.
const FormShell: any = FormShellRaw;
const FormSection: any = FormSectionRaw;
const FormActions: any = FormActionsRaw;
const Button: any = ButtonRaw;
const Input: any = InputRaw;
const Textarea: any = TextareaRaw;

interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  lat: number;
  lng: number;
  // Add other fields as necessary
}

interface DestinationFormProps {
  isEditMode: boolean;
  existingData: Destination;
}

const DestinationForm: React.FC<DestinationFormProps> = ({ isEditMode, existingData }) => {
  const toast = useToast() as any;
  const [name, setName] = useState<string>(existingData.name);
  const [description, setDescription] = useState<string>(existingData.description);
  const [lat, setLat] = useState<number>(existingData.lat);
  const [lng, setLng] = useState<number>(existingData.lng);
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validation
    if (!name || !description || !lat || !lng || (!isEditMode && !image)) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("lat", lat.toString());
      formData.append("lng", lng.toString());
      if (image) {
        formData.append("image", image);
      }

      if (isEditMode) {
        await axios.put(`${baseURL}/api/destinations/${existingData.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Destination updated successfully.");
      } else {
        await axios.post(`${baseURL}/api/destinations`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Destination created successfully.");
      }

      router.push("/destinations");
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <FormShell
        title={`${isEditMode ? "Edit" : "Create"} Destination`}
        description="Provide the destination details, coordinates, and cover image."
        maxWidth="max-w-2xl"
        actions={
          <FormActions
            left={
              <Button type="button" variant="secondary" onClick={() => router.back()}>
                Cancel
              </Button>
            }
            right={
              <Button type="submit" loading={isSubmitting}>
                {isEditMode ? "Update" : "Create"} Destination
              </Button>
            }
          />
        }
      >
        {error ? (
          <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
            {error}
          </p>
        ) : null}

        <FormSection columns={1}>
          {/* Name */}
          <Input
            label="Name"
            name="name"
            required
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          />

          {/* Description */}
          <Textarea
            label="Description"
            name="description"
            required
            rows={5}
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Latitude */}
            <Input
              label="Latitude"
              name="lat"
              required
              type="number"
              step="any"
              value={lat}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLat(parseFloat(e.target.value))}
            />

            {/* Longitude */}
            <Input
              label="Longitude"
              name="lng"
              required
              type="number"
              step="any"
              value={lng}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLng(parseFloat(e.target.value))}
            />
          </div>

          {/* Image */}
          <div>
            <Input
              label="Image"
              name="image"
              type="file"
              accept="image/webp"
              required={!isEditMode}
              hint="Only WEBP format is allowed."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImage(e.target.files?.[0] || null)}
              className="text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium"
            />
            {isEditMode && existingData?.image ? (
              <Image
                src={existingData.image}
                alt={existingData.name}
                className="mt-3 h-32 w-32 rounded-xl object-cover"
                width={128}
                height={128}
              />
            ) : null}
          </div>
        </FormSection>
      </FormShell>
    </form>
  );
};

export default DestinationForm;
