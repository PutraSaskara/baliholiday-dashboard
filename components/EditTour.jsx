"use client";
import { useState, useEffect, useCallback } from "react";
import useTourStore from "../stores/useTourStore";
import Link from "next/link";
import AIAssistantModal from "./AIAssistantModal";
import { useToast } from "./ui/Toast";
import FormShell from "./forms/FormShell";
import FormSection from "./forms/FormSection";
import FormActions from "./forms/FormActions";
import Button, { buttonClass } from "./ui/Button";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";

function EditTour({ id, onNext }) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    price1: "",
    pricenote1: "",
    price2: "",
    pricenote2: "",
    price3: "",
    pricenote3: "",
    keywords: "",
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

  const { fetchTourById, updateTour } = useTourStore();

  const fetchTourData = useCallback(async () => {
    setLoading(true);
    const data = await fetchTourById(id);
    if (data) {
      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        price1: data.price1 || "",
        pricenote1: data.pricenote1 || "",
        price2: data.price2 || "",
        pricenote2: data.pricenote2 || "",
        price3: data.price3 || "",
        pricenote3: data.pricenote3 || "",
        keywords: data.keywords || "",
        tldr_summary: data.tldr_summary || "",
        guide_insight_author: data.guide_insight_author || "",
        guide_insight_location: data.guide_insight_location || "",
        guide_insight_content: data.guide_insight_content || "",
        faq: data.faq || "[]",
      });
      try {
        setFaqs(JSON.parse(data.faq || "[]"));
      } catch (e) {
        setFaqs([]);
      }
    } else {
      setError("Failed to fetch tour data. Please try again later.");
    }
    setLoading(false);
  }, [id, fetchTourById]);

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
    const { success } = await updateTour(id, formData);
    if (success) {
      toast.success("Tour data updated successfully!");
      fetchTourData();
    } else {
      toast.error("Failed to update tour data. Please try again later.");
    }
    setLoading(false);
  };

  const handleApplyAI = (generatedData) => {
    setFormData((prev) => ({
      ...prev,
      keywords: generatedData.keywords || prev.keywords,
      tldr_summary: generatedData.tldr_summary || prev.tldr_summary,
      guide_insight_location: generatedData.guide_insight_location || prev.guide_insight_location,
      guide_insight_content: generatedData.guide_insight_content || prev.guide_insight_content,
      faq: generatedData.faq ? JSON.stringify(generatedData.faq) : prev.faq,
    }));

    if (generatedData.faq && Array.isArray(generatedData.faq)) {
      setFaqs(generatedData.faq);
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
    <FormShell
      title="Edit Tour"
      description="Please Edit Tour Title and Tour Price"
      headerExtra={
        <div className="mt-3">
          <Button variant="secondary" onClick={() => setIsAIModalOpen(true)}>
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
                Next to Edit Tour Detail
              </Button>
            ) : (
              <Link href={"/add-tour-package/add-tour-detail"} className={buttonClass()}>
                Next to Edit Tour Detail
              </Link>
            )
          }
        />
      }
    >
      <div className="space-y-8">
        <FormSection title="Basic Info" columns={1}>
          <Input
            label="Tour Title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
          />
        </FormSection>

        {/* Tour Price Tiers */}
        <FormSection title="Tour Price" columns={1}>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-medium text-amber-800">
              PayPal fee: ~4.4% + $0.30 per transaction. If you set $50, you&apos;ll receive ~$47.50. Consider adjusting your price to cover the fee.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((num) => {
              const priceVal = parseFloat(String(formData[`price${num}`] || "").replace(/[^0-9.]/g, "")) || 0;
              const fee = priceVal > 0 ? (priceVal * 0.044 + 0.30).toFixed(2) : null;
              const netAmount = fee ? (priceVal - parseFloat(fee)).toFixed(2) : null;
              return (
                <div key={num} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <Input
                    label={`Price Tier ${num}`}
                    name={`price${num}`}
                    placeholder="0"
                    value={formData[`price${num}`] || ""}
                    onChange={handleChange}
                    leading={<span className="text-xs font-bold text-slate-400">$</span>}
                  />
                  <Input
                    label={`Note ${num} (Optional)`}
                    name={`pricenote${num}`}
                    placeholder="Note (e.g. Per Person)"
                    value={formData[`pricenote${num}`] || ""}
                    onChange={handleChange}
                  />
                  {fee && (
                    <p className="text-[11px] text-slate-500">
                      Fee: -${fee} → You receive: <span className="font-semibold text-emerald-600">${netAmount}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </FormSection>

        <FormSection title="Custom URL Slug (Optional)" columns={1}>
          <Input
            label="Custom URL Slug (Optional)"
            name="slug"
            placeholder="Leave empty to keep current slug"
            value={formData.slug}
            onChange={handleChange}
          />
        </FormSection>

        <FormSection title="Keywords" columns={1}>
          <Input
            label="Keywords"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
          />
        </FormSection>

        {/* GEO Optimization & Local Insights */}
        <FormSection title="GEO Optimization & Local Insights (Optional)">
          <div className="sm:col-span-2">
            <Textarea
              label="Quick Summary (TL;DR)"
              name="tldr_summary"
              rows={3}
              placeholder="A concise 2-3 sentence summary of the tour..."
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

        {/* FAQ Optimization */}
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
        tourId={id}
        targetSection="tour"
        drafts={formData}
        onApply={handleApplyAI}
      />
    </FormShell>
  );
}

export default EditTour;
