"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useTourStore from '../stores/useTourStore';
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';
import FormShell from './forms/FormShell';
import FormSection from './forms/FormSection';
import FormActions from './forms/FormActions';
import Button, { buttonClass } from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import { useToast } from './ui/Toast';

function AddTour() {
  const { 
    draftTour, 
    setDraftTour, 
    hasUnsavedTourChanges 
  } = useTourStore();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    price1: '',
    pricenote1: '',
    price2: '',
    pricenote2: '',
    price3: '',
    pricenote3: '',
    keywords: '',
    tldr_summary: '',
    guide_insight_author: 'Putra Saskara',
    guide_insight_location: '',
    guide_insight_content: '',
    faq: '[]'
  });
  const [faqs, setFaqs] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useWarnIfUnsavedChanges(hasUnsavedTourChanges);

  // Pre-fill form on mount
  useEffect(() => {
    setMounted(true);
    if (draftTour) {
      setFormData(draftTour);
      setIsSaved(true);
      try {
        setFaqs(JSON.parse(draftTour.faq || '[]'));
      } catch (e) {
        setFaqs([]);
      }
    }
  }, [draftTour]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
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
    // Basic validation
    if (!formData.title || !formData.price1) {
      toast.error("Please fill in at least Tour Title and Tour Price 1.");
      return;
    }

    setDraftTour(formData);

    toast.success('Draft Tour saved locally. Please proceed to the next step!');
    setIsSaved(true);
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <FormShell
      title="Create New Tour"
      description="Define the name, multiple price tiers, and SEO keywords."
      actions={
        <FormActions
          left={
            <Button variant="secondary" onClick={handleSubmit}>
              {isSaved ? 'Draf Saved' : 'Save as Draf'}
            </Button>
          }
          right={
            isSaved ? (
              <Link
                href={'/add-tour-package/add-tour-detail'}
                className={buttonClass()}
              >
                Continue to Details
              </Link>
            ) : (
              <Button disabled>Continue to Details</Button>
            )
          }
        />
      }
    >
      <div className="space-y-8">
        <FormSection title="Basic Package Info">
          <Input
            label="Tour Title"
            name="title"
            required
            placeholder="e.g. Stunning Monkey Forest Tour"
            value={formData.title}
            onChange={handleChange}
          />
          <Input
            label="Custom URL Slug (Optional)"
            name="slug"
            placeholder="Leave empty to auto-generate from title"
            value={formData.slug}
            onChange={handleChange}
          />
          <div className="sm:col-span-2">
            <Input
              label="Keywords (SEO)"
              name="keywords"
              placeholder="Ubud, Nature, Culture"
              value={formData.keywords}
              onChange={handleChange}
              hint="Pisahkan kata kunci dengan koma."
            />
          </div>
        </FormSection>

        <FormSection title="Pricing Tiers" columns={1}>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-medium text-amber-800">
              PayPal fee: ~4.4% + $0.30 per transaction. If you set $50, you&apos;ll
              receive ~$47.50. Consider adjusting your price to cover the fee.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((num) => {
              const priceVal = parseFloat(formData[`price${num}`]) || 0;
              const fee = priceVal > 0 ? (priceVal * 0.044 + 0.30).toFixed(2) : null;
              const netAmount = fee ? (priceVal - parseFloat(fee)).toFixed(2) : null;
              return (
                <div
                  key={num}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                      {num}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-tight text-slate-500">
                      Price Tier {num}
                    </span>
                  </div>

                  <Input
                    label={`Price ${num}`}
                    name={`price${num}`}
                    type="number"
                    placeholder="0"
                    leading={<span className="text-xs font-bold text-slate-400">$</span>}
                    value={formData[`price${num}`]}
                    onChange={handleChange}
                  />
                  <Input
                    label={`Note ${num} (Optional)`}
                    name={`pricenote${num}`}
                    placeholder="e.g. Per Person"
                    value={formData[`pricenote${num}`]}
                    onChange={handleChange}
                  />
                  {fee ? (
                    <p className="text-[11px] text-slate-500">
                      Fee: -${fee} → You receive:{' '}
                      <span className="font-semibold text-emerald-600">${netAmount}</span>
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </FormSection>

        {/* GEO Optimization & Local Insights */}
        <FormSection title="GEO Optimization & Local Insights (Optional)">
          <div className="sm:col-span-2">
            <Textarea
              label="Quick Summary (TL;DR)"
              name="tldr_summary"
              rows={3}
              placeholder="A concise 2-3 sentence summary of the tour..."
              value={formData.tldr_summary || ''}
              onChange={handleChange}
            />
          </div>
          <Input
            label="Local Guide Name"
            name="guide_insight_author"
            placeholder="Putra Saskara"
            value={formData.guide_insight_author || ''}
            onChange={handleChange}
          />
          <Input
            label="Expertise / Location Context"
            name="guide_insight_location"
            placeholder="e.g. Ubud Tours Expert"
            value={formData.guide_insight_location || ''}
            onChange={handleChange}
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Authentic Guide Content / Tips"
              name="guide_insight_content"
              rows={3}
              placeholder="Authentic, first-hand tips or advice from the guide..."
              value={formData.guide_insight_content || ''}
              onChange={handleChange}
            />
          </div>
        </FormSection>

        {/* Frequently Asked Questions */}
        <section>
          <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Frequently Asked Questions (Optional)
            </h2>
            <Button variant="secondary" size="sm" onClick={addFaq}>
              + Add FAQ Item
            </Button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="relative space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    Question #{index + 1}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => removeFaq(index)}>
                    Delete
                  </Button>
                </div>
                <Input
                  label="Question"
                  name={`faq-question-${index}`}
                  placeholder="e.g. Is Kusamba Salt Farm worth visiting?"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                />
                <Textarea
                  label="Answer"
                  name={`faq-answer-${index}`}
                  rows={2}
                  placeholder="Answer..."
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                />
              </div>
            ))}
            {faqs.length === 0 ? (
              <p className="text-sm text-slate-500">
                Belum ada FAQ. Tekan &quot;+ Add FAQ Item&quot; untuk menambahkan.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </FormShell>
  );
}

export default AddTour
