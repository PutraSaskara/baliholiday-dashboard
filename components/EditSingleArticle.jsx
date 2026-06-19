"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import useArticleStore from "../stores/useArticleStore";

function EditSingleArticle({ id, onNext }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    tags: "",
    author: "",
    tldr_summary: "",
    guide_insight_author: "",
    guide_insight_location: "",
    guide_insight_content: "",
    faq: "[]",
  });
  const [faqs, setFaqs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { fetchArticleById, updateArticle } = useArticleStore();

  const fetchArticleData = useCallback(async () => {
    setLoading(true);
    const data = await fetchArticleById(id);
    if (data) {
      const blog = data.blog || data;
      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        tags: blog.tags || "",
        author: blog.author || "",
        tldr_summary: blog.tldr_summary || "",
        guide_insight_author: blog.guide_insight_author || "",
        guide_insight_location: blog.guide_insight_location || "",
        guide_insight_content: blog.guide_insight_content || "",
        faq: blog.faq || "[]",
      });
      try {
        setFaqs(JSON.parse(blog.faq || "[]"));
      } catch (e) {
        setFaqs([]);
      }
    } else {
      setError("Failed to fetch article data. Please try again later.");
    }
    setLoading(false);
  }, [id, fetchArticleById]);

  useEffect(() => {
    if (id) {
      fetchArticleData();
    }
  }, [id, fetchArticleData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
    setFormData(prev => ({
      ...prev,
      faq: JSON.stringify(newFaqs)
    }));
  };

  const addFaq = () => {
    const newFaqs = [...faqs, { question: "", answer: "" }];
    setFaqs(newFaqs);
    setFormData(prev => ({
      ...prev,
      faq: JSON.stringify(newFaqs)
    }));
  };

  const removeFaq = (index) => {
    const newFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(newFaqs);
    setFormData(prev => ({
      ...prev,
      faq: JSON.stringify(newFaqs)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { success } = await updateArticle(id, formData);
    if (success) {
      alert("Article data updated successfully!");
      fetchArticleData();
    } else {
      alert("Failed to update article data. Please try again later.");
    }
    setLoading(false);
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
    <div className="max-w-screen-lg mx-auto px-5 mb-10">
      <h1 className="my-10 text-xl font-bold">Edit Single Article</h1>
      <div className="mb-6">
        <label
          htmlFor="title"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Title
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
          htmlFor="slug"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="tags"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Tags
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
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

      <div className="border-t border-gray-200 pt-6 mt-6 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span>🌴</span> GEO Optimization & Local Insights (Optional)
        </h3>
        
        <div className="mb-6">
          <label htmlFor="tldr_summary" className="block mb-2 text-sm font-medium text-gray-900">
            Quick Summary (TL;DR)
          </label>
          <textarea
            id="tldr_summary"
            name="tldr_summary"
            placeholder="A concise 2-3 sentence summary of the article..."
            value={formData.tldr_summary || ""}
            onChange={handleChange}
            rows={3}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="guide_insight_author" className="block mb-2 text-sm font-medium text-gray-900">
              Local Guide Name
            </label>
            <input
              type="text"
              id="guide_insight_author"
              name="guide_insight_author"
              placeholder="Putra Saskara"
              value={formData.guide_insight_author || ""}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div>
            <label htmlFor="guide_insight_location" className="block mb-2 text-sm font-medium text-gray-900">
              Expertise / Location Context
            </label>
            <input
              type="text"
              id="guide_insight_location"
              name="guide_insight_location"
              placeholder="e.g. Ubud Tours Expert"
              value={formData.guide_insight_location || ""}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="guide_insight_content" className="block mb-2 text-sm font-medium text-gray-900">
            Authentic Guide Content / Tips
          </label>
          <textarea
            id="guide_insight_content"
            name="guide_insight_content"
            placeholder="Authentic, first-hand tips or advice from the guide..."
            value={formData.guide_insight_content || ""}
            onChange={handleChange}
            rows={3}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 resize-none"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 mt-6 mb-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>❓</span> Frequently Asked Questions (Optional)
          </h3>
          <button
            type="button"
            onClick={addFaq}
            className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-bold rounded-lg transition-colors"
          >
            + Add FAQ Item
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3 relative">
              <button
                type="button"
                onClick={() => removeFaq(index)}
                className="absolute top-2 right-2 text-xs font-bold text-red-500 hover:text-red-700"
              >
                Delete
              </button>
              <div>
                <label className="block mb-1 text-xs font-bold text-gray-500">Question #{index + 1}</label>
                <input
                  type="text"
                  placeholder="e.g. Is Kusamba Salt Farm worth visiting?"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-gray-500">Answer</label>
                <textarea
                  placeholder="Answer..."
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                  rows={2}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex justify-between">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
        >
          Save
        </button>

        {onNext ? (
          <button
            type="button"
            onClick={onNext}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
          >
            Next to Edit Article Paragrafs
          </button>
        ) : (
          <Link
            href={"/add-article/add-article-paragrafs"}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
          >
            Next to Edit Article Paragrafs
          </Link>
        )}
      </div>
    </div>
  );
}

export default EditSingleArticle;
