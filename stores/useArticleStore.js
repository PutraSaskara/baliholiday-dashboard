'use client';

import { create } from 'zustand';
import { api, getAuthHeaders } from '@/apiConfig';

const useArticleStore = create((set, get) => ({
    articles: [],
    loading: false,
    error: null,

    fetchArticles: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/single-blog');
            set({ articles: response.data, loading: false });
        } catch (error) {
            console.error('Error fetching articles:', error);
            set({ error: 'Failed to fetch articles.', loading: false });
        }
    },

    fetchArticleById: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/single-blog/${id}`);
            set({ loading: false });
            return response.data;
        } catch (error) {
            console.error('Error fetching article:', error);
            set({ error: 'Failed to fetch article.', loading: false });
            return null;
        }
    },

    createArticle: async (formData) => {
        set({ loading: true, error: null });
        try {
            const authHeaders = await getAuthHeaders();
            const response = await api.post('/single-blog', formData, {
                headers: { ...authHeaders },
            });
            set({ loading: false });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error creating article:', error);
            set({ loading: false });
            if (error.response) {
                return { success: false, status: error.response.status };
            }
            return { success: false, message: 'An error occurred.' };
        }
    },

    updateArticle: async (id, formData) => {
        set({ loading: true, error: null });
        try {
            const authHeaders = await getAuthHeaders();
            const response = await api.patch(`/single-blog/${id}`, formData, {
                headers: { ...authHeaders },
            });
            set({ loading: false });
            return { success: response.status === 200, data: response.data };
        } catch (error) {
            console.error('Error updating article:', error);
            set({ loading: false });
            if (error.response) return { success: false, status: error.response.status, data: error.response.data, message: error.response.data?.message };
            return { success: false, message: 'An error occurred.' };
        }
    },

    // --- Sub-components Methods ---

    // Generic fetch helper
    _fetchSubEntity: async (endpoint) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/${endpoint}`);
            set({ loading: false });
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            set({ error: `Failed to fetch ${endpoint}.`, loading: false });
            return null;
        }
    },

    // Generic create helper
    _createSubEntity: async (endpoint, formData, isMultipart = false) => {
        set({ loading: true, error: null });
        try {
            const authHeaders = await getAuthHeaders();
            const config = {
                headers: {
                    ...authHeaders,
                    ...(isMultipart ? { "Content-Type": "multipart/form-data" } : {}),
                },
            };
            const response = await api.post(`/${endpoint}`, formData, config);
            set({ loading: false });
            return { success: true, data: response.data };
        } catch (error) {
            console.error(`Error creating ${endpoint}:`, error);
            set({ loading: false });
            if (error.response) return { success: false, status: error.response.status, data: error.response.data, message: error.response.data?.message };
            return { success: false, message: 'An error occurred.' };
        }
    },

    // Generic update helper
    _updateSubEntity: async (endpoint, formData, isMultipart = false) => {
        set({ loading: true, error: null });
        try {
            const authHeaders = await getAuthHeaders();
            const config = {
                headers: {
                    ...authHeaders,
                    ...(isMultipart ? { "Content-Type": "multipart/form-data" } : {}),
                },
            };
            const response = await api.patch(`/${endpoint}`, formData, config);
            set({ loading: false });
            return { success: response.status === 200, data: response.data };
        } catch (error) {
            console.error(`Error updating ${endpoint}:`, error);
            set({ loading: false });
            if (error.response) return { success: false, status: error.response.status, data: error.response.data, message: error.response.data?.message };
            return { success: false, message: 'An error occurred.' };
        }
    },

    // Images
    fetchArticleImage: (id) => get()._fetchSubEntity(`blog-images/${id}`),
    createArticleImage: (formData) => get()._createSubEntity('blog-image', formData, true),
    updateArticleImage: (id, formData) => get()._updateSubEntity(`blog-image/${id}`, formData, true),

    // Paragrafs
    fetchArticleParagraf: (id) => get()._fetchSubEntity(`paragrafs/${id}`),
    createArticleParagraf: (formData) => get()._createSubEntity('paragraf', formData),
    updateArticleParagraf: (id, formData) => get()._updateSubEntity(`paragrafs/${id}`, formData),

    deleteArticle: async (id) => {
        try {
            const authHeaders = await getAuthHeaders();
            await api.delete(`/single-blog/${id}`, {
                headers: { ...authHeaders },
            });
            set((state) => ({
                articles: state.articles.filter((article) => article.id !== id),
            }));
            return true;
        } catch (error) {
            console.error('Error deleting article:', error);
            return false;
        }
    },
}));

export default useArticleStore;
