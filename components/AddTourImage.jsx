"use client"
import React, { useState, useEffect } from "react";
import useTourStore from "../stores/useTourStore";
import Link from "next/link";
import Image from "next/image";

function AddTourImage() {
  const [tourId, setTourId] = useState("");
  const [images1, setImages1] = useState([]);
  const [images2, setImages2] = useState([]);
  const [images3, setImages3] = useState([]);
  const [error, setError] = useState("");
  const [preview1, setPreview1] = useState("");
  const [preview2, setPreview2] = useState("");
  const [preview3, setPreview3] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const { tours: tourOptions, fetchTours, createTourImage } = useTourStore();

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

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
    setError("");
  };

  const handleImageChange2 = (event) => {
    if (!validateImage(event.target.files[0])) return;
    setImages2(event.target.files);
    setPreview2(URL.createObjectURL(event.target.files[0]));
    setError("");
  };

  const handleImageChange3 = (event) => {
    if (!validateImage(event.target.files[0])) return;
    setImages3(event.target.files);
    setPreview3(URL.createObjectURL(event.target.files[0]));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!tourId.trim()) {
        setError("Tour ID is required");
        return;
      }

      if (
        images1.length !== 1 ||
        images2.length !== 1 ||
        images3.length !== 1
      ) {
        setError("Please select exactly one image for each field");
        return;
      }

      const formData = new FormData();
      formData.append("tourId", tourId);
      formData.append("image", images1[0]);
      formData.append("image", images2[0]);
      formData.append("image", images3[0]);

      const { success, status, data, message } = await createTourImage(formData);

      if (success) {
        console.log("Images uploaded successfully:", data);
        setIsSaved(true);
        setTourId("");
        setImages1([]);
        setImages2([]);
        setImages3([]);
        setError("");
        setPreview1("");
        setPreview2("");
        setPreview3("");
        alert("Images uploaded successfully");
      } else {
        if (status) {
          console.error("Server responded with error status:", status);
          const errorMessage = data ? JSON.stringify(data) : message;
          alert(`Server responded with an error: ${status}. ${errorMessage}`);
        } else {
          alert(message || "An error occurred during upload.");
        }
      }
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
      alert("An unexpected error occurred.");
    }
  };


  return (
    <div className="px-10">
      <h2 className="mt-10 text-center font-bold text-3xl">Add Tour Image</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="tourId">Choose Tour Title for This Image:</label>
          <select id="tourId" value={tourId} onChange={handleTourIdChange}>
            <option value="">Select a Tour</option>
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
          <div>
            <label htmlFor="images1" className="block mb-2 text-sm font-medium text-gray-900 ">Select Image 1:</label>
            <input
              type="file"
              id="images1"
              accept="image/*"
              onChange={handleImageChange1}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
            <p className="mt-1 text-sm text-black font-semibold" id="images1_help">.webp only (max size 5mb. and please choose minimum full Hd image 1920x1080 pixel).</p>
            {preview1 && (
              <Image
                src={preview1}
                alt="Preview"
                className="w-[300px] mt-5"
                width={100}
                height={100}
              />
            )}
          </div>
          <div>
            <label htmlFor="images2" className="block mb-2 text-sm font-medium text-gray-900">Select Image 2:</label>
            <input
              type="file"
              id="images2"
              accept="image/*"
              onChange={handleImageChange2}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
            <p className="mt-1 text-sm text-black font-semibold" id="images1_help">webp only (max size 5mb. and please choose minimum full Hd image 1920x1080 pixel).</p>
            {preview2 && (
              <Image
                src={preview2}
                alt="Preview"
                className="w-[300px] mt-5"
                width={100}
                height={100}
              />
            )}
          </div>
          <div>
            <label htmlFor="images3" className="block mb-2 text-sm font-medium text-gray-900">Select Image 3:</label>
            <input
              type="file"
              id="images3"
              accept="image/*"
              onChange={handleImageChange3}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
            <p className="mt-1 text-sm text-black font-semibold" id="images1_help">webp only (max size 5mb. and please choose minimum full Hd image 1920x1080 pixel).</p>
            {preview3 && (
              <Image
                src={preview3}
                alt="Preview"
                className="w-[300px] mt-5"
                width={100}
                height={100}
              />
            )}
          </div>

        </div>
        {error && <div className="max-w-fit bg-red-500 mt-3">Error: {error}</div>}
      </form>
      <div className="flex justify-between items-center">
        <button type="submit" onClick={handleSubmit} className="bg-green-500 px-5 py-2 rounded-xl mt-10 mb-10 hover:bg-green-600 border border-green-500 text-white">Upload Images</button>
        {isSaved ? (
          <Link href={'/add-tour-package/add-other'} className="px-5 py-2.5  text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Next to Add Other Information
          </Link>
        ) : (
          <button disabled className="px-5 py-2.5 text-sm font-medium text-white bg-gray-400 cursor-not-allowed rounded-lg text-center">
            Next to Add Other Information
          </button>
        )}
      </div>
    </div>
  );
}

export default AddTourImage;
