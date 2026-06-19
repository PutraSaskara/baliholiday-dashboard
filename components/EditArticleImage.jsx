"use client"
import React, { useState, useEffect, useCallback } from "react";
import useArticleStore from "../stores/useArticleStore";
import Link from "next/link";
import Image from "next/image";

function EditArticleImage({ Id }) {
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
      alert("Cloudinary library is loading. Please try again in a few seconds.");
    }
  };

  const { articles: tourOptions, fetchArticles, fetchArticleImage, updateArticleImage } = useArticleStore();

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const loadData = useCallback(async () => {
    if (!Id.trim()) return;
    const data = await fetchArticleImage(Id);
    if (data && Object.keys(data).length > 0) {
      setExistingData(data);
      setBlogId(data.blogId);
      setPreview1(data.imageUrl1);
      setPreview2(data.imageUrl2);
      setPreview3(data.imageUrl3);
    }
  }, [Id, fetchArticleImage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  console.log('data existingdata:', existingData)



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

    if (!Id.trim()) {
      setError("Article ID is required");
      return;
    }

    const formData = new FormData();
    formData.append("blogId", blogId);

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
      alert("No changes detected to upload.");
      return;
    }

    const { success, status, data, message } = await updateArticleImage(Id, formData);

    if (success) {
      console.log("Images uploaded successfully:", data);
      alert("Images updated successfully");
      setImages1([]);
      setImages2([]);
      setImages3([]);
      setChosenUrl1("");
      setChosenUrl2("");
      setChosenUrl3("");
      setChosenPublicId1("");
      setChosenPublicId2("");
      setChosenPublicId3("");
      loadData();
    } else {
      if (status) {
        console.error("Server responded with error status:", status);
        const errorMessage = data ? JSON.stringify(data) : message;
        alert(`Server responded with an error: ${status}. ${errorMessage}`);
      } else {
        alert(message || "An error occurred during upload.");
      }
    }
  };

  return (
    <div className="px-10">
      <h2 className="mt-10 text-center font-bold text-3xl">Edit Article Image</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="blogId">Choose Title for This Image:</label>
          <select id="blogId" value={blogId} onChange={handleTourIdChange}>
            <option value="">Select a Article</option>
            {tourOptions.map((tour) => (
              <option key={tour.id} value={tour.id}>
                {tour.title}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-5">Note: Please remember use .webp image type and make sure image size maximum 5mb</p>
        <p>this is link for convert image to .webp :</p>
        <p><Link href={'https://image.online-convert.com/convert-to-webp'} target="_blank" className="bg-blue-500 px-2 rounded-md text-white hover:bg-blue-700">image.online-convert</Link></p>
        <p>this is link for compress image .webp :</p>
        <p><Link href={'https://imagecompressor.11zon.com/en/compress-webp/'} target="_blank" className="bg-blue-500 px-2 rounded-md text-white hover:bg-blue-700">imagecompressor.11zon</Link></p>

        <div className="block lg:flex lg:justify-between lg:gap-5 mt-10">
          <div className="flex-1 space-y-2">
            <label htmlFor="images1" className="block mb-2 text-sm font-medium text-gray-900 ">Select Image 1:</label>
            <input
              type="file"
              id="images1"
              accept="image/*"
              onChange={handleImageChange1}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
            <p className="mt-1 text-sm text-black font-semibold" id="images1_help">.webp only (max size 5mb. and please choose minimum full Hd image 1920x1080 pixel).</p>
            <button
                type="button"
                onClick={() => openCloudinaryLibrary(1)}
                className="mt-2 w-full py-2 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-100 hover:bg-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Select from Cloudinary
            </button>
            {preview1 && (
              <Image
                src={preview1}
                alt="Preview"
                className="w-[300px] mt-5 rounded-xl object-cover aspect-[4/3]"
                width={100}
                height={100}
              />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <label htmlFor="images2" className="block mb-2 text-sm font-medium text-gray-900">Select Image 2:</label>
            <input
              type="file"
              id="images2"
              accept="image/*"
              onChange={handleImageChange2}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
            <p className="mt-1 text-sm text-black font-semibold" id="images1_help">webp only (max size 5mb. and please choose minimum full Hd image 1920x1080 pixel).</p>
            <button
                type="button"
                onClick={() => openCloudinaryLibrary(2)}
                className="mt-2 w-full py-2 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-100 hover:bg-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Select from Cloudinary
            </button>
            {preview2 && (
              <Image
                src={preview2}
                alt="Preview"
                className="w-[300px] mt-5 rounded-xl object-cover aspect-[4/3]"
                width={100}
                height={100}
              />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <label htmlFor="images3" className="block mb-2 text-sm font-medium text-gray-900">Select Image 3:</label>
            <input
              type="file"
              id="images3"
              accept="image/*"
              onChange={handleImageChange3}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
            <p className="mt-1 text-sm text-black font-semibold" id="images1_help">webp only (max size 5mb. and please choose minimum full Hd image 1920x1080 pixel).</p>
            <button
                type="button"
                onClick={() => openCloudinaryLibrary(3)}
                className="mt-2 w-full py-2 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-100 hover:bg-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Select from Cloudinary
            </button>
            {preview3 && (
              <Image
                src={preview3}
                alt="Preview"
                className="w-[300px] mt-5 rounded-xl object-cover aspect-[4/3]"
                width={100}
                height={100}
              />
            )}
          </div>
        </div>
        {error && <div className="max-w-fit bg-red-500 mt-3">Error: {error}</div>}
      </form>
      <div className="flex justify-between items-center">
        <button type="submit" onClick={handleSubmit} className="bg-green-500 px-5 py-2 rounded-xl mt-10 mb-10 hover:bg-green-600">Upload Images</button>
        <Link href={'/'} className="px-5 py-2.5  text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default EditArticleImage;
