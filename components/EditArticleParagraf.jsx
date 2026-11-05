"use client"
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import useArticleStore from '../stores/useArticleStore';
import AIAssistantModal from './AIAssistantModal';
import { useToast } from "./ui/Toast";
import FormShell from './forms/FormShell';
import FormSection from './forms/FormSection';
import FormActions from './forms/FormActions';
import Button, { buttonClass } from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';

function EditArticleParagraf({ id, onNext }) {
  const toast = useToast();
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

  const { articles: tourOptions, fetchArticles, fetchArticleParagraf, updateArticleParagraf } = useArticleStore();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const loadData = useCallback(async () => {
    if (!id) return;
    const data = await fetchArticleParagraf(id);
    if (data && Object.keys(data).length > 0) {
      setFormData(data);
    }
  }, [id, fetchArticleParagraf]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const { success, status, data, message } = await updateArticleParagraf(id, formData);

    if (success) {
      toast.success('Article paragraph saved successfully!');
    } else {
      if (status) {
        console.error('Server responded with error status:', status);
        const errorMessage = data ? JSON.stringify(data) : message;
        toast.error(`Server responded with an error: ${status}. ${errorMessage}`);
      } else {
        toast.error(message || 'An error occurred during save.');
      }
    }
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

  return (
    <FormShell
      title="Edit Article Paragraphs"
      description="*Link for Paragraph is used to associate the article paragraph with a blog post (e.g., https://baliholiday.xyz/blog/explanation-about-monkey-forest)"
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
            <Button type="button" onClick={handleSubmit}>
              Save
            </Button>
          }
          right={
            onNext ? (
              <Button type="button" onClick={onNext}>
                Next to Edit Article Image
              </Button>
            ) : (
              <Link href={'/add-article/add-article-images'} className={buttonClass()}>
                Next to Edit Article Image
              </Link>
            )
          }
        />
      }
    >
      <div className="space-y-6">
        <Select
          label="Choose Blog Post"
          name="blogId"
          value={formData.blogId}
          onChange={handleChange}
        >
          <option value="">Select a Blog Post</option>
          {tourOptions.map(blog => (
            <option key={blog?.id} value={blog?.id}>{blog?.title}</option>
          ))}
        </Select>

        <FormSection title="Paragraphs" columns={1}>
          <Textarea
            label="Paragraph 1"
            name="paragraf1"
            rows={6}
            value={formData[`paragraf1`]}
            onChange={handleChange}
          />

          {[...Array(6)].map((_, index) => (
            <div key={index + 1} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <Input
                label={`Title for Paragraph ${index + 2}`}
                name={`titleparagraf${index + 2}`}
                value={formData[`titleparagraf${index + 2}`]}
                onChange={handleChange}
              />
              <Textarea
                label={`Paragraph ${index + 2}`}
                name={`paragraf${index + 2}`}
                rows={5}
                value={formData[`paragraf${index + 2}`]}
                onChange={handleChange}
              />
              <Input
                label={`Link for Paragraph ${index + 2}`}
                name={`link${index + 2}`}
                value={formData[`link${index + 2}`]}
                onChange={handleChange}
              />
            </div>
          ))}

          <Input
            label="Conclusion"
            name="Conclusion"
            value={formData.Conclusion}
            onChange={handleChange}
          />
        </FormSection>
      </div>

      <AIAssistantModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        mode="edit"
        targetSection="article-paragraphs"
        blogId={id}
        currentSectionData={formData}
        onApply={handleApplyAI}
      />
    </FormShell>
  );
}

export default EditArticleParagraf;
