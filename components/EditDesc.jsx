"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import useTourStore from "../stores/useTourStore";

function EditDesc({ tourId }) {
  const [formData, setFormData] = useState({
    paragraf1: "",
    paragraf2: "",
    paragraf3: "",
    tourId: "",
  });

  const { tours: tourOptions, fetchTours, fetchTourDesc, updateTourDesc } = useTourStore();

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const loadTourDescData = useCallback(async () => {
    if (!tourId) return;
    const data = await fetchTourDesc(tourId);
    if (data && Object.keys(data).length > 0) {
      setFormData(data);
    }
  }, [tourId, fetchTourDesc]);

  useEffect(() => {
    loadTourDescData();
  }, [loadTourDescData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { success, status, data, message } = await updateTourDesc(tourId, formData);

    if (success) {
      console.log("Data submitted:", data);
      alert("Description saved successfully!");
    } else {
      if (status) {
        console.error('Server responded with error status:', status);
        const errorMessage = data ? JSON.stringify(data) : message;
        alert(`Server responded with an error: ${status}. ${errorMessage}`);
      } else {
        alert(message || 'An error occurred during update.');
      }
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto">
      <h1 className="my-10 text-xl font-bold">Please Edit Tour Description </h1>

      <div className="my-5">
        <h3>Note</h3>
        <p>*Tour Description is description related to Tour Title</p>
      </div>

      <div className="mb-6">
        <label
          htmlFor="tourId"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Choose Tour Title For this Tour Plan
        </label>
        <select
          id="tourId"
          name="tourId"
          value={formData.tourId}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Select a Tour</option>
          {tourOptions.map((tour) => (
            <option key={tour?.id} value={tour?.id}>
              {tour?.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label
          htmlFor="paragraf1"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Paragraf 1
        </label>
        <textarea
          id="paragraf1"
          name="paragraf1"
          value={formData.paragraf1}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        ></textarea>
      </div>
      <div className="mb-6">
        <label
          htmlFor="paragraf2"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Paragraf 2
        </label>
        <textarea
          id="paragraf2"
          name="paragraf2"
          value={formData.paragraf2}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        ></textarea>
      </div>
      <div className="mb-6">
        <label
          htmlFor="paragraf3"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Paragraf 3
        </label>
        <textarea
          id="paragraf3"
          name="paragraf3"
          value={formData.paragraf3}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        ></textarea>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10"
        >
          Save
        </button>

        <Link
          href={"/add-tour-package/add-tour-plan"}
          className="px-5 py-3 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10"
        >
          Next to Edit Tour Plan
        </Link>
      </div>
    </div>
  );
}

export default EditDesc;
