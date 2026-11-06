"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import useArticleStore from "../stores/useArticleStore";
import AIAssistantModal from "./AIAssistantLazy";
import { useToast } from "./ui/Toast";
import FormShell from "./forms/FormShell";
import FormSection from "./forms/FormSection";
import FormActions from "./forms/FormActions";
import Button, { buttonClass } from "./ui/Button";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";

function EditSingleArticle({ id, onNext }) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    keywords: "",
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
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const { fetchArticleById, updateArticle } = useArticleStore();

  const fetchArticleData = useCallback(async () => {
    setLoading(true);
    const data = await fetchArticleById(id);
    if (data) {
      const blog = data.blog || data;
      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        keywords: blog.keywords || "",
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
      toast.success("Article data updated successfully!");
      fetchArticleData();
    } else {
      toast.error("Failed to update article data. Please try again later.");
    }
    setLoading(false);
  };

  const handleApplyAI = (generatedData) => {
    const updatedForm = { ...formData };
    if (generatedData.keywords) updatedForm.keywords = generatedData.keywords;
    if (generatedData.tldr_summary) updatedForm.tldr_summary = generatedData.tldr_summary;
    if (generatedData.guide_insight_location) updatedForm.guide_insight_location = generatedData.guide_insight_location;
    if (generatedData.guide_insight_content) updatedForm.guide_insight_content = generatedData.guide_insight_content;
    
    if (generatedData.faq && Array.isArray(generatedData.faq)) {
       updatedForm.faq = JSON.stringify(generatedData.faq);
       setFaqs(generatedData.faq);
    }
    
    setFormData(updatedForm);
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
    <FormShell
      title="Edit Single Article"
      description="Update the title, author, keywords, and SEO insights for this article."
      headerExtra={
        <div className="mt-3">
          <Button type="button" variant="secondary" onClick={() => setIsAIModalOpen(true)}>
            Review &amp; AI Auto-fill
          </Button>
        </div>
      }
      actions={
        <FormActions
          left={
            <Button type="button" onClick={handleSubmit} loading={loading}>
              Save
            </Button>
          }
          right={
            onNext ? (
              <Button type="button" onClick={onNext}>
                Next to Edit Article Paragrafs
              </Button>
            ) : (
              <Link href={"/add-article/add-article-paragrafs"} className={buttonClass()}>
                Next to Edit Article Paragrafs
              </Link>
            )
          }
        />
      }
    >
      <div className="space-y-8">
        <FormSection title="Basic Info">
          <Input
            label="Title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
          />
          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
          />
          <Input
            label="Keywords"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
          />
          <Input
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
        </FormSection>

        <FormSection title="GEO Optimization & Local Insights (Optional)">
          <div className="sm:col-span-2">
            <Textarea
              label="Quick Summary (TL;DR)"
              name="tldr_summary"
              rows={3}
              placeholder="A concise 2-3 sentence summary of the article..."
              value={formData.tldr_summary || ""}
              onChange={handleChange}
            />
          </div>
          <Input
            label="Local Guide Name"
            name="guide_insight_author"
            placeholder="Putra Saskara"
            value={formData.guide_insight_author || ""}
            onChange={handleChange}
          />
          <Input
            label="Expertise / Location Context"
            name="guide_insight_location"
            placeholder="e.g. Ubud Tours Expert"
            value={formData.guide_insight_location || ""}
            onChange={handleChange}
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Authentic Guide Content / Tips"
              name="guide_insight_content"
              rows={3}
              placeholder="Authentic, first-hand tips or advice from the guide..."
              value={formData.guide_insight_content || ""}
              onChange={handleChange}
            />
          </div>
        </FormSection>

        <section>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Frequently Asked Questions (Optional)
            </h2>
            <Button type="button" variant="secondary" size="sm" onClick={addFaq}>
              + Add FAQ Item
            </Button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Question #{index + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFaq(index)}>
                    Delete
                  </Button>
                </div>
                <Input
                  label="Question"
                  name={`faq-question-${index}`}
                  placeholder="e.g. Is Kusamba Salt Farm worth visiting?"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                />
                <Textarea
                  label="Answer"
                  name={`faq-answer-${index}`}
                  rows={2}
                  placeholder="Answer..."
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <AIAssistantModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        mode="edit"
        targetSection="article"
        blogId={id}
        currentSectionData={formData}
        onApply={handleApplyAI}
      />
    </FormShell>
  );
}

export default EditSingleArticle;
