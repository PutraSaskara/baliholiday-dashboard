"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/apiConfig";
import Link from "next/link";

export default function AddActivityPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
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
      alert("Please fill in Title, Description, and Price 1.");
      return;
    }
    if (!images.image1) {
      alert("Please upload at least Image 1.");
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

      alert("Activity created successfully!");
      router.push("/activities");
    } catch (err) {
      console.error("Error creating activity:", err);
      alert(err.response?.data?.error || "Failed to create activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-6">
        <Link href="/activities" className="text-sm text-blue-600 hover:underline">← Back to Activities</Link>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 md:p-10">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Add New Activity</h1>
        <p className="text-gray-500 mb-8">Fill in the details for a new activity, experience, transfer, or ticket.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="space-y-5">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Basic Info</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Title *</label>
                <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Bali ATV Ride Adventure" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white">
                  <option value="activity">Activity</option>
                  <option value="experience">Experience</option>
                  <option value="transfer">Transfer</option>
                  <option value="ticket">Ticket</option>
                </select>
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Sub Type</label>
                <input name="subType" value={formData.subType} onChange={handleChange} placeholder="e.g. atv, rafting, cooking-class" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Describe the activity..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none" />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Keywords (SEO)</label>
                <input name="keywords" value={formData.keywords} onChange={handleChange} placeholder="bali atv, adventure bali, quad bike" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="space-y-5">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Pricing</h2>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-2">
              <p className="text-xs text-amber-800 font-medium">⚠️ PayPal fee: ~4.4% + $0.30 per transaction. If you set $50, you&apos;ll receive ~$47.50. Consider adjusting your price to cover the fee.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => {
                const priceVal = parseFloat(formData[`price${n}`]) || 0;
                const fee = priceVal > 0 ? (priceVal * 0.044 + 0.30).toFixed(2) : null;
                const netAmount = fee ? (priceVal - parseFloat(fee)).toFixed(2) : null;
                return (
                  <div key={n} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                    <span className="text-xs font-bold text-gray-500">Price {n} {n === 1 && "*"}</span>
                    <input name={`price${n}`} value={formData[`price${n}`]} onChange={handleChange} placeholder="0" type="number" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-bold" />
                    <input name={`priceNote${n}`} value={formData[`priceNote${n}`]} onChange={handleChange} placeholder="Note (e.g. Per Person)" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-xs" />
                    {fee && (
                      <p className="text-[10px] text-gray-400">Fee: -${fee} → You receive: <span className="font-bold text-green-600">${netAmount}</span></p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Details */}
          <section className="space-y-5">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Duration</label>
                <input name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 2 hours" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Location</label>
                <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Ubud, Bali" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Latitude</label>
                <input name="lat" value={formData.lat} onChange={handleChange} placeholder="-8.5069" type="number" step="any" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Longitude</label>
                <input name="lng" value={formData.lng} onChange={handleChange} placeholder="115.2625" type="number" step="any" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Difficulty</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white">
                  <option value="">— None —</option>
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Min Age</label>
                <input name="minAge" value={formData.minAge} onChange={handleChange} placeholder="e.g. 7" type="number" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Max Participants</label>
                <input name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} placeholder="e.g. 20" type="number" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Time Slots</label>
                <input name="timeSlots" value={formData.timeSlots} onChange={handleChange} placeholder="08:00, 10:00, 14:00" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                <p className="text-[10px] text-gray-400 mt-1">Comma-separated</p>
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Operating Hours (Ticket)</label>
                <input name="operatingHours" value={formData.operatingHours} onChange={handleChange} placeholder="09:00 - 17:00" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" name="pickupIncluded" checked={formData.pickupIncluded} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label className="text-sm font-bold text-gray-700">Pickup Included</label>
              </div>
            </div>

            {/* Transfer-specific */}
            {formData.category === "transfer" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div>
                  <label className="block mb-1.5 text-sm font-bold text-indigo-700">From Location</label>
                  <input name="fromLocation" value={formData.fromLocation} onChange={handleChange} placeholder="e.g. Airport" className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-bold text-indigo-700">To Location</label>
                  <input name="toLocation" value={formData.toLocation} onChange={handleChange} placeholder="e.g. Ubud Hotel" className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                </div>
              </div>
            )}
          </section>

          {/* Includes / Not Includes / What to Bring */}
          <section className="space-y-5">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Includes & Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Includes</label>
                <textarea name="includes" value={formData.includes} onChange={handleChange} rows={3} placeholder="One item per line&#10;e.g. Hotel pickup&#10;Lunch&#10;Equipment" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none text-sm" />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Not Includes</label>
                <textarea name="notIncludes" value={formData.notIncludes} onChange={handleChange} rows={3} placeholder="One item per line&#10;e.g. Personal expenses&#10;Tips" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none text-sm" />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">What to Bring</label>
                <textarea name="whatToBring" value={formData.whatToBring} onChange={handleChange} rows={3} placeholder="One item per line&#10;e.g. Sunscreen&#10;Comfortable shoes" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none text-sm" />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Cancellation Policy</label>
                <textarea name="cancellationPolicy" value={formData.cancellationPolicy} onChange={handleChange} rows={2} placeholder="e.g. Free cancellation up to 24 hours before" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none text-sm" />
              </div>
            </div>
          </section>

          {/* GEO Optimization & Local Insights */}
          <section className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">🌴 GEO Optimization & Local Insights (Optional)</h2>
            <div className="space-y-5">
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Quick Summary (TL;DR)</label>
                <textarea name="tldr_summary" value={formData.tldr_summary} onChange={handleChange} rows={3} placeholder="A concise 2-3 sentence summary of the activity..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none text-sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-1.5 text-sm font-bold text-gray-700">Local Guide Name</label>
                  <input name="guide_insight_author" value={formData.guide_insight_author} onChange={handleChange} placeholder="e.g. Wayan" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-bold text-gray-700">Expertise / Location Context</label>
                  <input name="guide_insight_location" value={formData.guide_insight_location} onChange={handleChange} placeholder="e.g. Ubud Rafting Instructor" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Authentic Guide Content / Tips</label>
                <textarea name="guide_insight_content" value={formData.guide_insight_content} onChange={handleChange} rows={3} placeholder="Authentic, first-hand tips or advice from the guide..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none text-sm" />
              </div>
            </div>
          </section>

          {/* Frequently Asked Questions */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">❓ Frequently Asked Questions (Optional)</h2>
              <button type="button" onClick={addFaq} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-all">
                + Add FAQ
              </button>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 relative">
                  <button type="button" onClick={() => removeFaq(index)} className="absolute top-4 right-4 text-xs font-bold text-red-500 hover:text-red-700">
                    Delete
                  </button>
                  <div>
                    <label className="block mb-1 text-xs font-bold text-gray-500">Question #{index + 1}</label>
                    <input type="text" value={faq.question} onChange={(e) => handleFaqChange(index, "question", e.target.value)} placeholder="e.g. What should I wear?" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-bold text-gray-500">Answer</label>
                    <textarea value={faq.answer} onChange={(e) => handleFaqChange(index, "answer", e.target.value)} placeholder="Answer details..." rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium resize-none" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Images */}
          <section className="space-y-5">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Image {n} {n === 1 && "*"}</label>
                  <div className="relative">
                    <input
                      type="file"
                      name={`image${n}`}
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {previews[`image${n}`] && (
                    <img src={previews[`image${n}`]} alt={`Preview ${n}`} className="w-full h-32 object-cover rounded-xl border border-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Status */}
          <section>
            <div className="flex items-center gap-3">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <label className="text-sm font-bold text-gray-700">Active (visible to public)</label>
            </div>
          </section>

          {/* Submit */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
            <Link href="/activities" className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
