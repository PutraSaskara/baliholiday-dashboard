"use client"
import React, { useState, useEffect } from "react";
import useArticleStore from "../stores/useArticleStore";
import Link from "next/link";
import Image from "next/image";
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';
import { useToast } from "./ui/Toast";
import FormShell from "./forms/FormShell";
import FormActions from "./forms/FormActions";
import Button, { buttonClass } from "./ui/Button";
import Select from "./ui/Select";

function AddArticleImage() {
  const toast = useToast();
  const [blogId, setBlogId] = useState("");
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

  const { 
    articles: tourOptions, 
    fetchArticles, 
    createArticleImage,
    submitAllDrafts,
    draftArticle,
    hasUnsavedChanges,
    loading
  } = useArticleStore();

  useWarnIfUnsavedChanges(hasUnsavedChanges);

  useEffect(() => {
    if (!draftArticle) {
       fetchArticles();
    }
  }, [fetchArticles, draftArticle]);

  const handleTourIdChange = (event) => {
    setBlogId(event.target.value);
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

    if (!draftArticle && !blogId.trim()) {
      setError("Article ID is required");
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
    formData.append("blogId", blogId);

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

    if(draftArticle) {
       // Draft flow (New Article)
       const { success, message } = await submitAllDrafts(formData);
       if (success) {
         console.log("All drafts submitted successfully");
         setIsSaved(true);
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
         toast.success("All data (Article, Paragraphs, Images) uploaded successfully!");
       } else {
         toast.error(`Failed to submit drafts: ${message}`);
       }
    } else {
       // Standalone flow (Add image to existing article)
       const { success, status, data, message } = await createArticleImage(formData);
       if (success) {
         setIsSaved(true);
         setBlogId("");
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
         toast.success("Images uploaded successfully");
       } else {
         if (status) {
           console.error("Server responded with error status:", status);
           const errorMessage = data ? JSON.stringify(data) : message;
           toast.error(`Server responded with an error: ${status}. ${errorMessage}`);
         } else {
           toast.error(message || "An error occurred during upload.");
         }
       }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormShell
        title="Upload Images & Publish"
        description="Final step! Add eye-catching images to your article."
        actions={
          <FormActions
            left={
              isSaved ? (
                <Link href={'/'} className={buttonClass({ variant: "secondary" })}>
                  Back to Dashboard
                </Link>
              ) : (
                <Link
                  href={'/add-article/add-article-paragrafs'}
                  className={buttonClass({ variant: "secondary" })}
                >
                  Change Paragraphs
                </Link>
              )
            }
            right={
              <Button type="submit" loading={loading} size="lg">
                {draftArticle ? "Publish Article Now" : "Upload & Update"}
              </Button>
            }
          />
        }
      >
        {/* Draft Mode Notice */}
        {draftArticle && (
          <div className="mb-6 flex items-center gap-4 rounded-xl border border-brand-200 bg-brand-50 p-4">
            <div>
              <h4 className="font-semibold text-brand-900">Draft Ready for Publication</h4>
              <p className="text-sm text-brand-700">Target: &quot;{draftArticle.title}&quot;</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {!draftArticle && (
            <Select
              label="Select Target Blog Post"
              name="blogId"
              required
              value={blogId}
              onChange={handleTourIdChange}
            >
              <option value="">Choose a Blog Post...</option>
              {tourOptions.map((tour) => (
                <option key={tour.id} value={tour.id}>{tour.title}</option>
              ))}
            </Select>
          )}

          <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Image Guidelines
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-amber-700">
              <li>Use <b>.webp</b> format for best performance</li>
              <li>Recommended size: <b>1920x1080px</b> (max 5MB)</li>
              <li>
                Tools:{" "}
                <Link href="https://image.online-convert.com/convert-to-webp" target="_blank" className="font-semibold text-brand-700 underline">Convert</Link> |{" "}
                <Link href="https://imagecompressor.11zon.com/en/compress-webp/" target="_blank" className="font-semibold text-brand-700 underline">Compress</Link>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { id: 1, label: "Image 1 (Main Header)", preview: preview1, handler: handleImageChange1 },
              { id: 2, label: "Image 2 (Secondary)", preview: preview2, handler: handleImageChange2 },
              { id: 3, label: "Image 3 (Tertiary)", preview: preview3, handler: handleImageChange3 },
            ].map((img) => (
              <div key={img.id} className="relative group space-y-2">
                <span className="block text-sm font-medium text-slate-700">{img.label}</span>
                <div
                  className={`relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ${
                    img.preview
                      ? "border-brand-500 ring-2 ring-brand-500 ring-offset-2"
                      : "border-slate-300 bg-slate-50 hover:border-brand-400 hover:bg-white"
                  }`}
                >
                  {img.preview ? (
                    <div className="relative h-full w-full group">
                      <Image src={img.preview} alt="Preview" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                        <span className="rounded-lg border border-white/30 bg-white/20 px-3 py-1.5 text-xs font-bold text-white">Replace Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="cursor-pointer p-4 text-center">
                      <svg className="mx-auto mb-2 h-8 w-8 text-slate-300 transition-colors group-hover:text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                      <span className="text-xs font-bold text-slate-400 transition-colors group-hover:text-brand-600">Click to Upload</span>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={img.handler}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => openCloudinaryLibrary(img.id)}
                  className="w-full"
                >
                  Select from Cloudinary
                </Button>
              </div>
            ))}
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600" role="alert">
              {error}
            </div>
          )}
        </div>
      </FormShell>
    </form>
  );
}

export default AddArticleImage;
