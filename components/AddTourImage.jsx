"use client"
import React, { useState, useEffect } from "react";
import useTourStore from "../stores/useTourStore";
import Image from "next/image";
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';
import AIAssistantModal from './AIAssistantModal';
import Link from "next/link";
import { useToast } from "./ui/Toast";
import FormShell from "./forms/FormShell";
import FormActions from "./forms/FormActions";
import Button, { buttonClass } from "./ui/Button";
import Select from "./ui/Select";

function AddTourImage() {
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
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const openCloudinaryLibrary = (imageNum) => {
    if (window.cloudinary) {
      window.cloudinary.openMediaLibrary({
        cloud_name: "djibcjquk",
        api_key: "788191854535322",
        multiple: false
      }, {
        insertHandler: function (data) {
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

  const {
    tours: tourOptions,
    fetchTours,
    createTourImage,
    submitAllTourDrafts,
    draftTour,
    draftTourDetail,
    draftTourDesc,
    draftTourPlan,
    draftTourInclude,
    draftTourNotInclude,
    draftTourCancellation,
    setDraftTour,
    setDraftTourDetail,
    setDraftTourDesc,
    setDraftTourPlan,
    hasUnsavedTourChanges,
    loading
  } = useTourStore();

  useWarnIfUnsavedChanges(hasUnsavedTourChanges);

  useEffect(() => {
    setMounted(true);
    if (!draftTour) fetchTours();
  }, [fetchTours, draftTour]);

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
      if (!draftTour && !tourId.trim()) {
        setError("Tour ID is required");
        return;
      }

      if (
        (!images1.length && !chosenUrl1) ||
        (!images2.length && !chosenUrl2) ||
        (!images3.length && !chosenUrl3)
      ) {
        setError("Please select or upload exactly one image for each field");
        return;
      }

      const formData = new FormData();
      formData.append("tourId", tourId);

      if (images1.length > 0) {
        formData.append("image", images1[0]);
      } else if (chosenUrl1) {
        formData.append("imageUrl1", chosenUrl1);
        formData.append("image1", chosenPublicId1);
      }

      if (images2.length > 0) {
        formData.append("image", images2[0]);
      } else if (chosenUrl2) {
        formData.append("imageUrl2", chosenUrl2);
        formData.append("image2", chosenPublicId2);
      }

      if (images3.length > 0) {
        formData.append("image", images3[0]);
      } else if (chosenUrl3) {
        formData.append("imageUrl3", chosenUrl3);
        formData.append("image3", chosenPublicId3);
      }

      let result;
      if (draftTour) {
        // Draft Flow: Submit everything
        result = await submitAllTourDrafts(formData);
      } else {
        // Standard Flow: Just Add Image to existing Tour
        result = await createTourImage(formData);
      }

      const { success, status, data, message } = result;

      if (success) {
        setIsSaved(true);
        setTourId("");
        setImages1([]);
        setImages2([]);
        setImages3([]);
        setError("");
        setPreview1("");
        setPreview2("");
        setPreview3("");
        setChosenUrl1("");
        setChosenUrl2("");
        setChosenUrl3("");
        setChosenPublicId1("");
        setChosenPublicId2("");
        setChosenPublicId3("");
        toast.success(draftTour ? "All Tour Data Published successfully!" : "Images uploaded successfully");
      } else {
        if (status) {
          console.error("Server responded with error status:", status);
          const errorMessage = data ? JSON.stringify(data) : message;
          toast.error(`Server responded with an error: ${status}. ${errorMessage}`);
        } else {
          toast.error(message || "An error occurred during process.");
        }
      }
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleApplyAI = (generatedData) => {
    // We update the drafts in the zustand store based on what AI generated
    if (draftTour) {
      setDraftTour({
        ...draftTour,
        keywords: generatedData.keywords || draftTour.keywords,
        tldr_summary: generatedData.tldr_summary || draftTour.tldr_summary,
        guide_insight_location: generatedData.guide_insight_location || draftTour.guide_insight_location,
        guide_insight_content: generatedData.guide_insight_content || draftTour.guide_insight_content,
        faq: generatedData.faq ? JSON.stringify(generatedData.faq) : draftTour.faq
      });
    }

    if (draftTourDetail) {
      const updatedDetail = { ...draftTourDetail };
      for (let i = 1; i <= 9; i++) {
        if (generatedData[`detail${i}`]) updatedDetail[`detail${i}`] = generatedData[`detail${i}`];
      }
      setDraftTourDetail(updatedDetail);
    }

    if (draftTourDesc) {
      const updatedDesc = { ...draftTourDesc };
      for (let i = 1; i <= 9; i++) {
        if (generatedData[`desc${i}`]) updatedDesc[`desc${i}`] = generatedData[`desc${i}`];
      }
      setDraftTourDesc(updatedDesc);
    }
  };

  if (!mounted) return null;


  return (
    <>
    <form onSubmit={handleSubmit}>
      <FormShell
        title="Tour Media"
        description="Upload 3 high-quality photos to showcase this tour package."
        actions={
          <FormActions
            left={
              <>
                <Link
                  href={'/add-tour-package/add-other'}
                  className={buttonClass({ variant: "secondary" })}
                >
                  Back
                </Link>
                {isSaved ? (
                  <Link
                    href={'/'}
                    className="btn-base h-11 px-5 text-sm text-brand-700 hover:bg-brand-50"
                  >
                    Back to Dashboard
                  </Link>
                ) : (
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
                    Ready for Final Submission
                  </span>
                )}
              </>
            }
            right={
              <Button type="submit" loading={loading} size="lg">
                {draftTour ? "Submit All Data (Final)" : "Finish Upload"}
              </Button>
            }
          />
        }
      >
        <div className="space-y-8">
          {/* Draft Mode Notice */}
          {draftTour && (
            <div className="flex items-center gap-4 rounded-xl border border-brand-200 bg-brand-50 p-4">
              <div>
                <h4 className="font-semibold text-brand-900">Final Submission Ready</h4>
                <p className="text-sm text-brand-700">
                  Assigning images to &quot;{draftTour.title}&quot; and publishing all drafted data.
                </p>
              </div>
            </div>
          )}

          {!draftTour && (
            <Select
              label="Select Target Tour"
              name="tourId"
              required
              value={tourId}
              onChange={handleTourIdChange}
            >
              <option value="">Choose a Tour Package...</option>
              {tourOptions.map(tour => (
                <option key={tour.id} value={tour.id}>{tour.title}</option>
              ))}
            </Select>
          )}

          {/* Helper Box */}
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
              Media Guidelines
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Please use <b>.webp</b> format for optimal performance. Max size <b>5MB</b>. We recommend <b>1920x1080px</b> for sharp displays.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href='https://image.online-convert.com/convert-to-webp' target="_blank" className="btn-base h-11 border border-slate-200 bg-white px-4 text-xs text-slate-600 hover:border-brand-300 hover:text-brand-700">Convert to WebP</Link>
              <Link href='https://imagecompressor.11zon.com/en/compress-webp/' target="_blank" className="btn-base h-11 border border-slate-200 bg-white px-4 text-xs text-slate-600 hover:border-brand-300 hover:text-brand-700">Compress WebP</Link>
            </div>
          </div>

          {/* Image Upload Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((num) => {
              const preview = num === 1 ? preview1 : num === 2 ? preview2 : preview3;
              const handler = num === 1 ? handleImageChange1 : num === 2 ? handleImageChange2 : handleImageChange3;
              return (
                <div key={num} className="space-y-3">
                  <span className="block text-sm font-medium text-slate-700">Cover Image {num}</span>
                  <div className={`relative group aspect-[4/3] rounded-xl border-2 border-dashed overflow-hidden transition-all duration-300 ${preview ? 'border-brand-500' : 'border-slate-300 hover:border-brand-400 bg-slate-50'}`}>
                    {preview ? (
                      <div className="absolute inset-0">
                        <Image src={preview} alt="Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <label htmlFor={`images${num}`} className="px-6 py-2 rounded-full bg-white text-brand-700 font-bold text-xs cursor-pointer shadow-xl">Change Photo</label>
                        </div>
                      </div>
                    ) : (
                      <label htmlFor={`images${num}`} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-6 text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 bg-white shadow-sm">
                          <svg className="h-6 w-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                        </div>
                        <span className="text-xs font-bold text-slate-600">Click to Upload</span>
                        <span className="mt-1 text-[10px] text-slate-400">HD Photo (1920x1080)</span>
                      </label>
                    )}
                    <input type="file" id={`images${num}`} accept=".webp" onChange={handler} className="hidden" />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => openCloudinaryLibrary(num)}
                    className="w-full"
                  >
                    Select from Cloudinary
                  </Button>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600" role="alert">
              {error}
            </div>
          )}

          {/* AI Review Button (Only shows if in draft mode) */}
          {draftTour && (
            <div className="flex justify-end border-t border-slate-100 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsAIModalOpen(true)}
              >
                AI Final Review &amp; Auto-Fill
              </Button>
            </div>
          )}
        </div>
      </FormShell>
    </form>

      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        mode="add"
        drafts={{
          tour: draftTour,
          detail: draftTourDetail,
          desc: draftTourDesc,
          plan: draftTourPlan,
          include: draftTourInclude,
          notInclude: draftTourNotInclude,
          cancellation: draftTourCancellation
        }}
        onApply={handleApplyAI}
      />
    </>
  );
}

export default AddTourImage;
