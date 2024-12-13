"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import baseURL from "@/apiConfig";
import Link from "next/link";
import Image from "next/image";

function EditArticleImage({Id}) {
  const [blogId, setBlogId] = useState("");
  const [images1, setImages1] = useState([]);
  const [images2, setImages2] = useState([]);
  const [images3, setImages3] = useState([]);
  const [error, setError] = useState("");
  const [tourOptions, setTourOptions] = useState([]);
  const [preview1, setPreview1] = useState("");
  const [preview2, setPreview2] = useState("");
  const [preview3, setPreview3] = useState("");
  const [existingData, setExistingData] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get(`${baseURL}/single-blog`);
        setTourOptions(response.data);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchTours();
  }, []);

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        if (!Id.trim()) return;

        const response = await axios.get(`${baseURL}/blog-images/${Id}`);
        setExistingData(response.data);
        // Populate input fields with existing data
        setBlogId(response.data.blogId)
        setPreview1(response.data.imageUrl1);
        setPreview2(response.data.imageUrl2);
        setPreview3(response.data.imageUrl3);
      } catch (error) {
        console.error("Error fetching existing data:", error);
      }
    };

    fetchExistingData();    
  }, [Id]);

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
      if (!Id.trim()) {
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
      formData.append("blogId", blogId);
      formData.append("image", images1[0]);
      formData.append("image", images2[0]);
      formData.append("image", images3[0]);
  
      const response = await axios.patch(`${baseURL}/blog-image/${Id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Images uploaded successfully:", response.data);
      alert("Images uploaded successfully");
    } catch (error) {
      console.error("Error uploading images:", error);
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.error("Server responded with error status:", error.response.status);
        console.error("Error message from server:", error.response.data);
        const errorMessage = JSON.stringify(error.response.data);
        alert(`Server responded with an error: ${error.response.status}. ${errorMessage}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        alert("No response received from the server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error setting up the request:", error.message);
        alert(`An error occurred: ${error.message}`);
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
        <button type="submit" onClick={handleSubmit} className="bg-green-500 px-5 py-2 rounded-xl mt-10 mb-10 hover:bg-green-600">Upload Images</button>
        <Link href={'/'} className="px-5 py-2.5  text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Back to Dashboard
      </Link>
      </div>
    </div>
  );
}

export default EditArticleImage;
