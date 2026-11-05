"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useArticleStore from '../stores/useArticleStore';
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';
import AIAssistantModal from './AIAssistantModal';
import { useToast } from "./ui/Toast";
import FormShell from './forms/FormShell';
import FormSection from './forms/FormSection';
import FormActions from './forms/FormActions';
import Button, { buttonClass } from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';

function AddSingleArticle() {
  const toast = useToast();
  const { draftArticle, setDraftArticle, hasUnsavedChanges } = useArticleStore();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    author: '',
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
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Pre-fill form with draft data on mount (avoid hydration mismatch)
  useEffect(() => {
    setMounted(true);
    if (draftArticle) {
      setFormData(draftArticle);
      setIsSaved(true); // If they already saved the draft, allow them to proceed
      try {
        setFaqs(JSON.parse(draftArticle.faq || '[]'));
      } catch (e) {
        setFaqs([]);
      }
    }
  }, [draftArticle]);

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

  // Warn user if they try to leave with unsaved changes
  useWarnIfUnsavedChanges(hasUnsavedChanges);

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title || !formData.author) {
      toast.error("Please fill in Title and Author.");
      return;
    }

    // Save to Zustand Draft memory instead of calling API
    setDraftArticle(formData);

    toast.success('Draft Article saved locally. Please proceed to the next step!');
    setIsSaved(true);
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

  if (!mounted) {
    return null; // Avoid hydration mismatch on initial render
  }

  return (
    <>
    <FormShell
      title="Create New Article"
      description="Let's start with the basics. Enter the title, keywords, and author."
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
            <Button variant="secondary" onClick={handleSubmit}>
              {isSaved ? 'Draf Saved' : 'Save as Draf'}
            </Button>
          }
          right={
            isSaved ? (
              <Link
                href={'/add-article/add-article-paragrafs'}
                className={buttonClass()}
              >
                Continue to Paragraphs
              </Link>
            ) : (
              <Button disabled>Continue to Paragraphs</Button>
            )
          }
        />
      }
    >
        <div className="space-y-8">
          <FormSection title="Basic Info">
            <div className="sm:col-span-2">
              <Input
                label="Article Title"
                name="title"
                required
                placeholder="Enter a catchy title..."
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <Input
              label="Custom URL Slug (Optional)"
              name="slug"
              placeholder="Leave empty to auto-generate from title"
              value={formData.slug}
              onChange={handleChange}
            />
            <Input
              label="Author Name"
              name="author"
              required
              placeholder="Your name or organization"
              value={formData.author}
              onChange={handleChange}
            />
            <div className="sm:col-span-2">
              <Input
                label="Keywords (SEO)"
                name="keywords"
                placeholder="e.g. Bali, Travel, Beach"
                value={formData.keywords}
                onChange={handleChange}
              />
            </div>
          </FormSection>

          {/* GEO Optimization & Local Insights */}
          <FormSection title="GEO Optimization & Local Insights (Optional)">
            <div className="sm:col-span-2">
              <Textarea
                label="Quick Summary (TL;DR)"
                name="tldr_summary"
                rows={3}
                placeholder="A concise 2-3 sentence summary of the article..."
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
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
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
                  className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
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

      <AIAssistantModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        mode="add"
        targetSection="article"
        drafts={{ ...formData }}
        onApply={handleApplyAI}
      />
    </>
  );
}

export default AddSingleArticle