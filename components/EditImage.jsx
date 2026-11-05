"use client"
import React, { useState, useEffect, useCallback } from "react";
import useTourStore from "../stores/useTourStore";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "./ui/Toast";
import FormShell from "./forms/FormShell";
import FormActions from "./forms/FormActions";
import Button, { buttonClass } from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";

function EditTourImage({ Id, onNext }) {
  const toast = useToast();
  const [tourId, setTourId] = useState("");
  const [images1, setImages1] = useState([]);
  const [images2, setImages2] = useState([]);
  const [images3, setImages3] = useState([]);
  const [error, setError] = useState("");
  const [preview1, setPreview1] = useState("");
  const [preview2, setPreview2] = useState("");
  const [preview3, setPreview3] = useState("");
  const [chosenUrl1, setChosenUrl1] = useState("");
  const [chosenUrl2, setChosenUrl2] = useState("");
  const [chosenUrl3, setChosenUrl3] = useState("");
  const [chosenPublicId1, setChosenPublicId1] = useState("");
  const [chosenPublicId2, setChosenPublicId2] = useState("");
  const [chosenPublicId3, setChosenPublicId3] = useState("");
  const [existingData, setExistingData] = useState(null);

  const openCloudinaryLibrary = (imageNum) => {
    if (window.cloudinary) {
      window.cloudinary.openMediaLibrary({
        cloud_name: "djibcjquk",
        api_key: "788191854535322",
        multiple: false
      }, {
        insertHandler: function(data) {
          const selectedAsset = data.assets[0];
          const secureUrl = selectedAsset.secure_url;
          const publicId = selectedAsset.public_id;
          
          if (imageNum === 1) {
            setPreview1(secureUrl);
            setChosenUrl1(secureUrl);
            setChosenPublicId1(publicId);
            setImages1([]); // Clear file upload
          } else if (imageNum === 2) {
            setPreview2(secureUrl);
            setChosenUrl2(secureUrl);
            setChosenPublicId2(publicId);
            setImages2([]);
          } else if (imageNum === 3) {
            setPreview3(secureUrl);
            setChosenUrl3(secureUrl);
            setChosenPublicId3(publicId);
            setImages3([]);
          }
        }
      });
    } else {
      toast.error("Cloudinary library is loading. Please try again in a few seconds.");
    }
  };

  const { tours: tourOptions, fetchTours, fetchTourImage, updateTourImage } = useTourStore();

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const fetchExistingData = useCallback(async () => {
    if (!Id.trim()) return;

    const data = await fetchTourImage(Id);
    if (data) {
      setExistingData(data);
      setTourId(data.tourId);
      setPreview1(data.imageUrl1);
      setPreview2(data.imageUrl2);
      setPreview3(data.imageUrl3);
    }
  }, [Id, fetchTourImage]);

  useEffect(() => {
    fetchExistingData();
  }, [fetchExistingData]);

  const handleTourIdChange = (event) => {
    setTourId(event.target.value);
  };

  const validateImage = (file) => {
    const allowedExtensions = /(\.webp)$/i;
    if (!allowedExtensions.test(file.name)) {
      setError("Please select a .webp file only.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Please select an image with size less than 5MB.");
      return false;
    }
    return true;
  };

  const handleImageChange1 = (event) => {
    if (!validateImage(event.target.files[0])) return;
    setImages1(event.target.files);
    setPreview1(URL.createObjectURL(event.target.files[0]));
    setChosenUrl1("");
    setChosenPublicId1("");
    setError("");
  };

  const handleImageChange2 = (event) => {
    if (!validateImage(event.target.files[0])) return;
    setImages2(event.target.files);
    setPreview2(URL.createObjectURL(event.target.files[0]));
    setChosenUrl2("");
    setChosenPublicId2("");
    setError("");
  };

  const handleImageChange3 = (event) => {
    if (!validateImage(event.target.files[0])) return;
    setImages3(event.target.files);
    setPreview3(URL.createObjectURL(event.target.files[0]));
    setChosenUrl3("");
    setChosenPublicId3("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!Id.trim()) {
        setError("Tour ID is required");
        return;
      }

      const formData = new FormData();
      formData.append("tourId", tourId);

      let hasChanges = false;

      if (images1.length > 0) {
        formData.append("image", images1[0]);
        hasChanges = true;
      } else if (chosenUrl1) {
        formData.append("imageUrl1", chosenUrl1);
        formData.append("image1", chosenPublicId1);
        hasChanges = true;
      }

      if (images2.length > 0) {
        formData.append("image", images2[0]);
        hasChanges = true;
      } else if (chosenUrl2) {
        formData.append("imageUrl2", chosenUrl2);
        formData.append("image2", chosenPublicId2);
        hasChanges = true;
      }

      if (images3.length > 0) {
        formData.append("image", images3[0]);
        hasChanges = true;
      } else if (chosenUrl3) {
        formData.append("imageUrl3", chosenUrl3);
        formData.append("image3", chosenPublicId3);
        hasChanges = true;
      }

      if (!hasChanges) {
        toast.error("No changes detected to upload.");
        return;
      }

      const { success, status, data, message } = await updateTourImage(Id, formData);

      if (success) {
        toast.success("Images updated successfully");
        setImages1([]);
        setImages2([]);
        setImages3([]);
        setChosenUrl1("");
        setChosenUrl2("");
        setChosenUrl3("");
        setChosenPublicId1("");
        setChosenPublicId2("");
        setChosenPublicId3("");
        fetchExistingData();
      } else {
        if (status) {
          console.error("Server responded with error status:", status);
          const errorMessage = data ? JSON.stringify(data) : message;
          toast.error(`Server responded with an error: ${status}. ${errorMessage}`);
        } else {
          toast.error(message || "An error occurred during upload.");
        }
      }
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormShell
        title="Edit Tour Image"
        description="Note: Please remember use .webp image type and make sure image size maximum 5mb."
        actions={
          <FormActions
            left={
              <Button type="submit">Upload Images</Button>
            }
            right={
              onNext ? (
                <Button type="button" onClick={onNext}>
                  Next to Edit Other Information
                </Button>
              ) : (
                <Link href={'/edit-tour/add-other'} className={buttonClass()}>
                  Next to Edit Other Information
                </Link>
              )
            }
          />
        }
      >
        <div className="space-y-6">
          <Select
            label="Choose Tour Title for This Image"
            name="tourId"
            value={tourId}
            onChange={handleTourIdChange}
          >
            <option value="">Select a Tour</option>
            {tourOptions.map((tour) => (
              <option key={tour.id} value={tour.id}>
                {tour.title}
              </option>
            ))}
          </Select>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            This is link for convert image to .webp:{" "}
            <Link href={'https://image.online-convert.com/convert-to-webp'} target="_blank" className="font-semibold text-brand-700 underline">
              image.online-convert
            </Link>
            <br />
            This is link for compress image .webp:{" "}
            <Link href={'https://imagecompressor.11zon.com/en/compress-webp/'} target="_blank" className="font-semibold text-brand-700 underline">
              imagecompressor.11zon
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((num) => {
              const handler = num === 1 ? handleImageChange1 : num === 2 ? handleImageChange2 : handleImageChange3;
              const preview = num === 1 ? preview1 : num === 2 ? preview2 : preview3;
              return (
                <div key={num} className="space-y-2">
                  <Input
                    label={`Select Image ${num}`}
                    name={`images${num}`}
                    id={`images${num}`}
                    type="file"
                    accept="image/*"
                    onChange={handler}
                    hint=".webp only (max size 5mb. and please choose minimum full Hd image 1920x1080 pixel)."
                    className="text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => openCloudinaryLibrary(num)}
                    className="w-full"
                  >
                    Select from Cloudinary
                  </Button>
                  {preview && (
                    <Image
                      src={preview}
                      alt={`Preview ${num}`}
                      className="aspect-[4/3] w-full max-w-[300px] rounded-xl object-cover"
                      width={300}
                      height={225}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600" role="alert">
              Error: {error}
            </div>
          )}
        </div>
      </FormShell>
    </form>
  );
}

export default EditTourImage;
