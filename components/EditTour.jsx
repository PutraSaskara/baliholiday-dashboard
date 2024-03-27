"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import baseURL from "@/apiConfig";
import Link from "next/link";

function EditTour({ id }) {
  const [formData, setFormData] = useState({
      title: "",
      price1: "",
      pricenote1: "",
      price2: "",
      pricenote2: "",
      price3: "",
      pricenote3: "",
      keywords: ""
  });

  useEffect(() => {
    if (id) {
      fetchTourData();
    }
  }, [id]);

  const fetchTourData = async () => {
    try {
      const response = await axios.get(`${baseURL}/tourssimple/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching tour data:", error);
    }
  };
  console.log("data fetch", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
        [name]: value,
    }));
  };
  

  const handleSubmit = async () => {
    try {
      const response = await axios.patch(`${baseURL}/tours/${id}`, formData);
      if (response.status === 200) {
        console.log("Tour data updated successfully!");
        alert("Tour data updated successfully!");
        // Optionally, redirect the user to a different page after successful submission
      } else {
        console.error("Failed to update tour data. Server returned status:", response.status);
        alert("Failed to update tour data. Please try again later.");
      }
    } catch (error) {
      console.error("Error updating tour data:", error);
      alert("Error updating tour data. Please try again later.");
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto">
      <h1 className="my-10 text-xl font-bold">
        Please Edit Tour Title and Tour Price
      </h1>
      <div className="mb-6">
        <label
          htmlFor="default-input"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Tour title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="default-input"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Keywords
        </label>
        <input
          type="text"
          id="keywords"
          name="keywords"
          value={formData.keywords}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="default-input"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Tour Price 1
        </label>
        <input
          type="text"
          id="price1"
          name="price1"
          value={formData.price1}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="default-input"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Price Note 1
        </label>
        <input
          type="text"
          id="pricenote1"
          name="pricenote1"
          value={formData.pricenote1}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="default-input"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Tour Price 2
        </label>
        <input
          type="text"
          id="price2"
          name="price2"
          value={formData.price2}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="default-input"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Price Note 2
        </label>
        <input
          type="text"
          id="pricenote2"
          name="pricenote2"
          value={formData.pricenote2}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="default-input"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Tour Price 3
        </label>
        <input
          type="text"
          id="price3"
          name="price3"
          value={formData.price3}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="default-input"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Price Note 3
        </label>
        <input
          type="text"
          id="pricenote3"
          name="pricenote3"
          value={formData.pricenote3}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div className="w-full flex justify-between">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Save
        </button>

        <Link
          href={"/add-tour-package/add-tour-detail"}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Next to Edit Tour Detail
        </Link>
      </div>
    </div>
  );
}

export default EditTour;
