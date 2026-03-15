"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useArticleStore from '../stores/useArticleStore';

function AddArticleParagrafs() {
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

  const { articles: tourOptions, fetchArticles, createArticleParagraf } = useArticleStore();

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const { success, status, data, message } = await createArticleParagraf(formData);

    if (success) {
      console.log('Data submitted:', data);
      alert('Article paragraph saved successfully!');
      setFormData({
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
    } else {
      if (status) {
        console.error('Server responded with error status:', status);
        const errorMessage = data ? JSON.stringify(data) : message;
        alert(`Server responded with an error: ${status}. ${errorMessage}`);
      } else {
        alert(message || 'An error occurred during save.');
      }
    }
  };

  return (
    <div className='max-w-screen-lg mx-auto'>
      <h1 className='my-10 text-xl font-bold'>Please input Article Paragraphs</h1>

      <div className='my-5'>
        <h3>Note</h3>
        <p>*Link for Paragraph is used to associate the article paragraph with a blog post (e.g., https://baliholiday.xyz/blog/explanation-about-monkey-forest)</p>
      </div>

      {/* Select the blog post to associate the article paragraphs */}
      <div className="mb-6">
        <label htmlFor="tourId" className="block mb-2 text-sm font-medium text-gray-900">Choose Blog Post</label>
        <select id="tourId" name="blogId" value={formData.blogId} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="">Select a Blog Post</option>
          {tourOptions.map(blog => (
            <option key={blog?.id} value={blog?.id}>{blog?.title}</option>
          ))}
        </select>
      </div>

      {/* Paragraphs */}
      <label htmlFor={`paragraf1`} className="block text-sm font-medium text-gray-900">Paragraph 1</label>
      <textarea id={`paragraf1`} name={`paragraf1`} value={formData[`paragraf1`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-32 resize-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>

      {/* Repeat for each set of article paragraphs */}
      {[...Array(6)].map((_, index) => (
        <div key={index + 1} className="mb-6 mt-10">
          <label htmlFor={`titleparagraf${index + 2}`} className="block text-sm font-medium text-gray-900">Title for Paragraph {index + 2}</label>
          <input id={`titleparagraf${index + 2}`} name={`titleparagraf${index + 2}`} value={formData[`titleparagraf${index + 2}`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

          <label htmlFor={`paragraf${index + 2}`} className="block text-sm font-medium text-gray-900">Paragraph {index + 2}</label>
          <textarea id={`paragraf${index + 2}`} name={`paragraf${index + 2}`} value={formData[`paragraf${index + 2}`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-32 resize-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>


          <label htmlFor={`link${index + 2}`} className="block text-sm font-medium text-gray-900">Link for Paragraph {index + 2}</label>
          <input id={`link${index + 2}`} name={`link${index + 2}`} value={formData[`link${index + 2}`]} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
      ))}

      {/* Conclusion paragraph */}
      <div className="mb-6">
        <label htmlFor="Conclusion" className="block text-sm font-medium text-gray-900">Conclusion</label>
        <input id="Conclusion" name="Conclusion" value={formData.Conclusion} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>

      {/* Save button */}
      <div className='flex justify-between'>
        <button type="button" onClick={handleSubmit} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">Save</button>

        <Link href={'/add-article/add-article-images'} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-10">
          Next to Add Article Image
        </Link>
      </div>

    </div>

  );
}

export default AddArticleParagrafs;
