"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import useArticleStore from "../stores/useArticleStore";

function EditSingleArticle({ id }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    keywords: "",
  });

  const { fetchArticleById, updateArticle } = useArticleStore();

  const fetchBlogData = useCallback(async () => {
    if (!id) return;
    const data = await fetchArticleById(id);
    if (data && data.blog) {
      setFormData(data.blog);
    } else if (data) {
      setFormData(data);
    }
  }, [id, fetchArticleById]);

  useEffect(() => {
    if (id) {
      fetchBlogData();
    }
  }, [id, fetchBlogData]);

  console.log("data fetch", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { success, status, data, message } = await updateArticle(id, formData);

    if (success) {
      console.log("Data submitted:", data);
      alert("Data saved successfully!");
      setFormData({
        title: "",
        author: "",
        keywords: "",
      });
    } else {
      console.error("Error submitting form:", message);
      if (status) {
        console.error("Server responded with error status:", status);
        if (status === 400) {
          alert("Bad request: Please check your input data.");
        } else if (status === 404) {
          alert("Resource not found.");
        } else {
          alert(`An error occurred. ${message}`);
        }
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto">
      <h1 className="my-10 text-xl font-bold">
        Please Edit Blog Title and Author
      </h1>
      <div className="mb-6">
        <label
          htmlFor="title"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Blog title
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
      <div className="mb-6">
        <label
          htmlFor="keywords"
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
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="author"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Author
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>

      <div className="w-full flex justify-between">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
        >
          Save
        </button>

        <Link
          href={"/add-article/add-article-paragrafs"}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
        >
          Next to Edit Article Paragrafs
        </Link>
      </div>
    </div>
  );
}

export default EditSingleArticle;
