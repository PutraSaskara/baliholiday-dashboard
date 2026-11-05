"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useArticleStore from '../stores/useArticleStore';
import useWarnIfUnsavedChanges from '../hooks/useWarnIfUnsavedChanges';
import AIAssistantModal from './AIAssistantModal';
import { useToast } from "./ui/Toast";
import FormShell from './forms/FormShell';
import FormActions from './forms/FormActions';
import Button, { buttonClass } from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';

function AddArticleParagrafs() {
  const toast = useToast();
  const {
    articles: tourOptions, 
    fetchArticles, 
    setDraftParagraph, 
    draftArticle,
    draftParagraph,
    hasUnsavedChanges 
  } = useArticleStore();
  
  const [formData, setFormData] = useState({
    paragraf1: '',
    titleparagraf2: '',
    paragraf2: '',
    link2: '',
    titleparagraf3: '',
    paragraf3: '',
    link3: '',
    titleparagraf4: '',
    paragraf4: '',
    link4: '',
    titleparagraf5: '',
    paragraf5: '',
    link5: '',
    titleparagraf6: '',
    paragraf6: '',
    link6: '',
    titleparagraf7: '',
    paragraf7: '',
    link7: '',
    Conclusion: '',
    blogId: ''
  });

  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  useWarnIfUnsavedChanges(hasUnsavedChanges);

  useEffect(() => {
    setMounted(true);
    // Pre-fill form with draft data
    if (draftParagraph) {
        setFormData(draftParagraph);
        setIsSaved(true);
    }
    // Only fetch existing articles if we're not currently making a draft
    if (!draftArticle) {
        fetchArticles();
    }
  }, [fetchArticles, draftArticle, draftParagraph]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!draftArticle && !formData.blogId) {
       toast.error("Please choose a Blog Post to associate these paragraphs with.");
       return;
    }

    // Save to Zustand Draft memory instead of calling API
    setDraftParagraph(formData);

    toast.success('Draft Paragraph saved locally. Please proceed to the final step!');
    setIsSaved(true);
  };

  const handleApplyAI = (generatedData) => {
    const updatedForm = { ...formData };
    if (generatedData.paragraf1) updatedForm.paragraf1 = generatedData.paragraf1;
    if (generatedData.Conclusion) updatedForm.Conclusion = generatedData.Conclusion;
    for (let i = 2; i <= 7; i++) {
      if (generatedData[`titleparagraf${i}`]) updatedForm[`titleparagraf${i}`] = generatedData[`titleparagraf${i}`];
      if (generatedData[`paragraf${i}`]) updatedForm[`paragraf${i}`] = generatedData[`paragraf${i}`];
    }
    setFormData(updatedForm);
  };

  if (!mounted) {
      return null; // Avoid hydration mismatch
  }

  return (
    <>
    <FormShell
      title="Article Content"
      description="Tip: Use paragraphs to break down your article into readable sections."
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
            <>
              <Link
                href={'/add-article/add-single-article'}
                className={buttonClass({ variant: "secondary" })}
              >
                Back
              </Link>
              <Button variant="secondary" onClick={handleSubmit}>
                {isSaved ? 'Draf Saved' : 'Save as Draf'}
              </Button>
            </>
          }
          right={
            isSaved ? (
              <Link href={'/add-article/add-article-images'} className={buttonClass()}>
                Next to Final Step
              </Link>
            ) : (
              <Button disabled>Next to Final Step</Button>
            )
          }
        />
      }
    >
        {/* Draft Mode Notice */}
        {draftArticle && (
            <div className="mb-6 flex items-center gap-4 rounded-xl border border-brand-200 bg-brand-50 p-4">
                <div>
                    <h4 className="font-semibold text-brand-900">Draft Mode Active</h4>
                    <p className="text-sm text-brand-700">Assigning paragraphs to &quot;{draftArticle.title}&quot;</p>
                </div>
            </div>
        )}

        {!draftArticle && (
            <div className="mb-6">
                <Select
                    label="Select Blog Post"
                    name="blogId"
                    required
                    value={formData.blogId}
                    onChange={handleChange}
                >
                    <option value="">Choose a Blog Post...</option>
                    {tourOptions.map(blog => (
                        <option key={blog?.id} value={blog?.id}>{blog?.title}</option>
                    ))}
                </Select>
            </div>
        )}

        <div className="space-y-6">
            {/* Paragraph 1 (Introduction) */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <Textarea
                    label="Introduction (Paragraph 1)"
                    name="paragraf1"
                    rows={6}
                    value={formData.paragraf1}
                    onChange={handleChange}
                    placeholder="Enter the introduction..."
                />
            </div>

            {/* Dynamic Paragraphs 2-7 */}
            {[...Array(6)].map((_, index) => (
                <div key={index + 2} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">{index + 2}</span>
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Section {index + 2}</h2>
                    </div>

                    <Input
                        label="Section Title"
                        name={`titleparagraf${index + 2}`}
                        value={formData[`titleparagraf${index + 2}`]}
                        onChange={handleChange}
                        placeholder="Enter sub-heading title..."
                    />
                    <Textarea
                        label="Section Content"
                        name={`paragraf${index + 2}`}
                        rows={5}
                        value={formData[`paragraf${index + 2}`]}
                        onChange={handleChange}
                        placeholder="Enter paragraph content..."
                    />
                    <Input
                        label="External Link (Optional)"
                        name={`link${index + 2}`}
                        value={formData[`link${index + 2}`]}
                        onChange={handleChange}
                        placeholder="https://..."
                    />
                </div>
            ))}

            {/* Conclusion */}
            <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-4">
                <Textarea
                    label="Conclusion"
                    name="Conclusion"
                    rows={4}
                    value={formData.Conclusion}
                    onChange={handleChange}
                    placeholder="Enter the conclusion..."
                />
            </div>
        </div>
      </FormShell>

      <AIAssistantModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        mode="add"
        targetSection="article-paragraphs"
        drafts={{ draftArticle, draftParagraph: formData }}
        onApply={handleApplyAI}
      />
    </>
  );
}

export default AddArticleParagrafs;
