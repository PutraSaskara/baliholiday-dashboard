'use client';

import { create } from 'zustand';
import { api, getAuthHeaders } from '@/apiConfig';

const useAreaStore = create((set, get) => ({
    areas: [],
    totalPages: 1,
    currentPage: 1,
    loading: false,
    error: null,

    fetchAreas: async (page = 1) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/api/pickup-areas', {
                params: { page, limit: 10 },
            });
            set({
                areas: response.data.areas,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
                loading: false,
            });
        } catch (error) {
            console.error('Error fetching areas:', error);
            set({ error: 'Failed to fetch pickup areas.', loading: false });
        }
    },

    fetchAreaById: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/api/pickup-areas/${id}`);
            set({ loading: false });
            return response.data;
        } catch (error) {
            console.error('Error fetching pickup area:', error);
            set({ error: 'Failed to fetch pickup area details.', loading: false });
            return null;
        }
    },

    searchAreas: async (query) => {
        if (!query.trim()) {
            return get().fetchAreas();
        }

        set({ loading: true, error: null });
        try {
            const response = await api.get('/api/pickup-areas/search', {
                params: { query },
            });
            set({
                areas: response.data,
                totalPages: 1,
                currentPage: 1,
                loading: false,
            });
        } catch (error) {
            console.error('Error searching areas:', error);
            set({ error: 'Failed to search pickup areas.', loading: false });
        }
    },

    createArea: async (formData) => {
        set({ loading: true, error: null });
        try {
            const authHeaders = await getAuthHeaders();
            const response = await api.post('/api/pickup-areas', formData, {
                headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' },
            });
            set({ loading: false });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error creating area:', error);
            set({ loading: false });
            if (error.response && error.response.data) {
                return { success: false, status: error.response.status, data: error.response.data };
            }
            return { success: false, message: 'An error occurred.' };
        }
    },

    updateArea: async (id, formData) => {
        set({ loading: true, error: null });
        try {
            const authHeaders = await getAuthHeaders();
            const response = await api.patch(`/api/pickup-areas/${id}`, formData, {
                headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' },
            });
            set({ loading: false });
            return { success: response.status === 200 };
        } catch (error) {
            console.error('Error updating area:', error);
            set({ loading: false });
            return { success: false };
        }
    },

    deleteArea: async (id) => {
        try {
            const authHeaders = await getAuthHeaders();
            await api.delete(`/api/pickup-areas/${id}`, {
                headers: { ...authHeaders },
            });
            const { areas, currentPage } = get();
            // If last item on page, go to previous page
            if (areas.length === 1 && currentPage > 1) {
                get().fetchAreas(currentPage - 1);
            } else {
                get().fetchAreas(currentPage);
            }
            return true;
        } catch (error) {
            console.error('Error deleting area:', error);
            return false;
        }
    },
}));

export default useAreaStore;
