"use client";
import { useState, useEffect, useCallback } from "react";
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
    keywords: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTourData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/tourssimple/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching tour data:", error);
      setError("Failed to fetch tour data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchTourData();
    }
  }, [id, fetchTourData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(`${baseURL}/tours/${id}`, formData);
      if (response.status === 200) {
        console.log("Tour data updated successfully!");
        alert("Tour data updated successfully!");
        // Optionally, redirect the user to a different page after successful submission
      } else {
        console.error(
          "Failed to update tour data. Server returned status:",
          response.status
        );
        alert("Failed to update tour data. Please try again later.");
      }
    } catch (error) {
      console.error("Error updating tour data:", error);
      alert("Error updating tour data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-screen-lg mx-auto">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-lg mx-auto">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto">
      <h1 className="my-10 text-xl font-bold">
        Please Edit Tour Title and Tour Price
      </h1>
      <div className="mb-6">
        <label
          htmlFor="title"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Tour Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>
      {/* Repeat similar blocks for other fields */}
      <div className="mb-6">
        <label
          htmlFor="keywords"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Keywords
        </label>
        <input
          type="text"
          id="keywords"
          name="keywords"
          value={formData.keywords}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>
      {/* Add other input fields similarly */}
      <div className="w-full flex justify-between">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
        >
          Save
        </button>

        <Link
          href={"/add-tour-package/add-tour-detail"}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
        >
          Next to Edit Tour Detail
        </Link>
      </div>
    </div>
  );
}

export default EditTour;
