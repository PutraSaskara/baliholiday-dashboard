"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/apiConfig";
import Link from "next/link";
import { useToast } from "../../../components/ui/Toast";
import FormShell from "../../../components/forms/FormShell";
import FormSection from "../../../components/forms/FormSection";
import FormActions from "../../../components/forms/FormActions";
import Button, { buttonClass } from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

export default function AddActivityPage() {
  const toast = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "activity",
    subType: "",
    description: "",
    price1: "",
    priceNote1: "",
    price2: "",
    priceNote2: "",
    price3: "",
    priceNote3: "",
    duration: "",
    location: "",
    lat: "",
    lng: "",
    fromLocation: "",
    toLocation: "",
    timeSlots: "",
    difficulty: "",
    minAge: "",
    maxParticipants: "",
    pickupIncluded: false,
    operatingHours: "",
    whatToBring: "",
    includes: "",
    notIncludes: "",
    cancellationPolicy: "",
    keywords: "",
    isActive: true,
    tldr_summary: "",
    guide_insight_author: "",
    guide_insight_location: "",
    guide_insight_content: "",
    faq: "[]",
  });
  const [faqs, setFaqs] = useState([]);
  const [images, setImages] = useState({ image1: null, image2: null, image3: null });
  const [previews, setPreviews] = useState({ image1: null, image2: null, image3: null });

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setImages((prev) => ({ ...prev, [name]: files[0] }));
      setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(files[0]) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price1 || !formData.description) {
      toast.error("Please fill in Title, Description, and Price 1.");
      return;
    }
    if (!images.image1) {
      toast.error("Please upload at least Image 1.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();

      // Append all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "timeSlots" && value) {
          // Convert comma-separated to JSON array
          data.append(key, JSON.stringify(value.split(",").map((s) => s.trim()).filter(Boolean)));
        } else if (value !== "" && value !== null) {
          data.append(key, value);
        }
      });

      // Append images
      if (images.image1) data.append("image1", images.image1);
      if (images.image2) data.append("image2", images.image2);
      if (images.image3) data.append("image3", images.image3);

      await api.post("/api/activities", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Activity created successfully!");
      router.push("/activities");
    } catch (err) {
      console.error("Error creating activity:", err);
      toast.error(err.response?.data?.error || "Failed to create activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <Link href="/activities" className="text-sm font-medium text-brand-700 hover:underline">← Back to Activities</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <FormShell
          title="Add New Activity"
          description="Fill in the details for a new activity, experience, transfer, or ticket."
          actions={
            <FormActions
              left={
                <Link href="/activities" className={buttonClass({ variant: "secondary" })}>
                  Cancel
                </Link>
              }
              right={<Button type="submit" loading={isSubmitting}>{isSubmitting ? "Creating..." : "Create Activity"}</Button>}
            />
          }
        >
          <div className="space-y-8">
            {/* Basic Info */}
            <FormSection title="Basic Info">
              <div className="sm:col-span-2">
                <Input label="Title" name="title" required placeholder="e.g. Bali ATV Ride Adventure" value={formData.title} onChange={handleChange} />
              </div>
              <div className="sm:col-span-2">
                <Input label="Custom URL Slug (Optional)" name="slug" placeholder="Leave empty to auto-generate from title" value={formData.slug} onChange={handleChange} />
              </div>
              <Select label="Category" name="category" required value={formData.category} onChange={handleChange}>
                <option value="activity">Activity</option>
                <option value="experience">Experience</option>
                <option value="transfer">Transfer</option>
                <option value="ticket">Ticket</option>
              </Select>
              <Input label="Sub Type" name="subType" placeholder="e.g. atv, rafting, cooking-class" value={formData.subType} onChange={handleChange} />
              <div className="sm:col-span-2">
                <Textarea label="Description" name="description" required rows={4} placeholder="Describe the activity..." value={formData.description} onChange={handleChange} />
              </div>
              <div className="sm:col-span-2">
                <Input label="Keywords (SEO)" name="keywords" placeholder="bali atv, adventure bali, quad bike" value={formData.keywords} onChange={handleChange} />
              </div>
            </FormSection>

            {/* Pricing */}
            <FormSection title="Pricing" columns={1}>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-medium text-amber-800">PayPal fee: ~4.4% + $0.30 per transaction. If you set $50, you&apos;ll receive ~$47.50. Consider adjusting your price to cover the fee.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((n) => {
                  const priceVal = parseFloat(formData[`price${n}`]) || 0;
                  const fee = priceVal > 0 ? (priceVal * 0.044 + 0.30).toFixed(2) : null;
                  const netAmount = fee ? (priceVal - parseFloat(fee)).toFixed(2) : null;
                  return (
                    <div key={n} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                      <Input
                        label={`Price ${n}${n === 1 ? "" : " (Optional)"}`}
                        name={`price${n}`}
                        type="number"
                        required={n === 1}
                        placeholder="0"
                        value={formData[`price${n}`]}
                        onChange={handleChange}
                      />
                      <Input
                        label={`Price Note ${n} (Optional)`}
                        name={`priceNote${n}`}
                        placeholder="Note (e.g. Per Person)"
                        value={formData[`priceNote${n}`]}
                        onChange={handleChange}
                      />
                      {fee && (
                        <p className="text-[11px] text-slate-500">Fee: -${fee} → You receive: <span className="font-semibold text-emerald-600">${netAmount}</span></p>
                      )}
                    </div>
                  );
                })}
              </div>
            </FormSection>

            {/* Details */}
            <FormSection title="Details">
              <Input label="Duration" name="duration" placeholder="e.g. 2 hours" value={formData.duration} onChange={handleChange} />
              <Input label="Location" name="location" placeholder="e.g. Ubud, Bali" value={formData.location} onChange={handleChange} />
              <Input label="Latitude" name="lat" type="number" step="any" placeholder="-8.5069" value={formData.lat} onChange={handleChange} />
              <Input label="Longitude" name="lng" type="number" step="any" placeholder="115.2625" value={formData.lng} onChange={handleChange} />
              <Select label="Difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange}>
                <option value="">— None —</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="hard">Hard</option>
              </Select>
              <Input label="Min Age" name="minAge" type="number" placeholder="e.g. 7" value={formData.minAge} onChange={handleChange} />
              <Input label="Max Participants" name="maxParticipants" type="number" placeholder="e.g. 20" value={formData.maxParticipants} onChange={handleChange} />
              <Input label="Time Slots" name="timeSlots" placeholder="08:00, 10:00, 14:00" hint="Comma-separated" value={formData.timeSlots} onChange={handleChange} />
              <Input label="Operating Hours (Ticket)" name="operatingHours" placeholder="09:00 - 17:00" value={formData.operatingHours} onChange={handleChange} />
              <label className="flex h-11 cursor-pointer items-center gap-3">
                <input type="checkbox" name="pickupIncluded" checked={formData.pickupIncluded} onChange={handleChange} className="h-5 w-5 rounded border-slate-300 accent-brand-600" />
                <span className="text-sm font-medium text-slate-700">Pickup Included</span>
              </label>

              {/* Transfer-specific */}
              {formData.category === "transfer" && (
                <div className="grid grid-cols-1 gap-4 rounded-xl border border-brand-200 bg-brand-50 p-4 sm:col-span-2 sm:grid-cols-2">
                  <Input label="From Location" name="fromLocation" placeholder="e.g. Airport" value={formData.fromLocation} onChange={handleChange} />
                  <Input label="To Location" name="toLocation" placeholder="e.g. Ubud Hotel" value={formData.toLocation} onChange={handleChange} />
                </div>
              )}
            </FormSection>

            {/* Includes / Not Includes / What to Bring */}
            <FormSection title="Includes & Info" columns={1}>
              <Textarea label="Includes" name="includes" rows={3} placeholder={"One item per line\ne.g. Hotel pickup\nLunch\nEquipment"} value={formData.includes} onChange={handleChange} />
              <Textarea label="Not Includes" name="notIncludes" rows={3} placeholder={"One item per line\ne.g. Personal expenses\nTips"} value={formData.notIncludes} onChange={handleChange} />
              <Textarea label="What to Bring" name="whatToBring" rows={3} placeholder={"One item per line\ne.g. Sunscreen\nComfortable shoes"} value={formData.whatToBring} onChange={handleChange} />
              <Textarea label="Cancellation Policy" name="cancellationPolicy" rows={2} placeholder="e.g. Free cancellation up to 24 hours before" value={formData.cancellationPolicy} onChange={handleChange} />
            </FormSection>

            {/* GEO Optimization & Local Insights */}
            <FormSection title="GEO Optimization & Local Insights (Optional)">
              <div className="sm:col-span-2">
                <Textarea label="Quick Summary (TL;DR)" name="tldr_summary" rows={3} placeholder="A concise 2-3 sentence summary of the activity..." value={formData.tldr_summary} onChange={handleChange} />
              </div>
              <Input label="Local Guide Name" name="guide_insight_author" placeholder="e.g. Wayan" value={formData.guide_insight_author} onChange={handleChange} />
              <Input label="Expertise / Location Context" name="guide_insight_location" placeholder="e.g. Ubud Rafting Instructor" value={formData.guide_insight_location} onChange={handleChange} />
              <div className="sm:col-span-2">
                <Textarea label="Authentic Guide Content / Tips" name="guide_insight_content" rows={3} placeholder="Authentic, first-hand tips or advice from the guide..." value={formData.guide_insight_content} onChange={handleChange} />
              </div>
            </FormSection>

            {/* Frequently Asked Questions */}
            <section>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Frequently Asked Questions (Optional)</h2>
                <Button type="button" variant="secondary" size="sm" onClick={addFaq}>+ Add FAQ</Button>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">Question #{index + 1}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFaq(index)}>Delete</Button>
                    </div>
                    <Input label="Question" name={`faq-question-${index}`} value={faq.question} onChange={(e) => handleFaqChange(index, "question", e.target.value)} placeholder="e.g. What should I wear?" />
                    <Textarea label="Answer" name={`faq-answer-${index}`} rows={2} value={faq.answer} onChange={(e) => handleFaqChange(index, "answer", e.target.value)} placeholder="Answer details..." />
                  </div>
                ))}
              </div>
            </section>

            {/* Images */}
            <FormSection title="Images">
              {[1, 2, 3].map((n) => (
                <div key={n} className="space-y-2">
                  <Input
                    label={`Image ${n}${n === 1 ? " *" : " (Optional)"}`}
                    name={`image${n}`}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium"
                  />
                  {previews[`image${n}`] && (
                    <img src={previews[`image${n}`]} alt={`Preview ${n}`} className="h-32 w-full rounded-xl border border-slate-200 object-cover" />
                  )}
                </div>
              ))}
            </FormSection>

            {/* Status */}
            <label className="flex h-11 cursor-pointer items-center gap-3">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-5 w-5 rounded border-slate-300 accent-brand-600" />
              <span className="text-sm font-medium text-slate-700">Active (visible to public)</span>
            </label>
          </div>
        </FormShell>
      </form>
    </div>
  );
}
