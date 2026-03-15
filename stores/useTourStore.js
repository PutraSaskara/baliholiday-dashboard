'use client';

import { create } from 'zustand';
import axios from 'axios';
import baseURL from '@/apiConfig';

const useTourStore = create((set, get) => ({
    tours: [],
    loading: false,
    error: null,

    fetchTours: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${baseURL}/tours`);
            set({ tours: response.data, loading: false });
        } catch (error) {
            console.error('Error fetching tours:', error);
            set({ error: 'Failed to fetch tours.', loading: false });
        }
    },

    fetchTourById: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${baseURL}/tourssimple/${id}`);
            set({ loading: false });
            return response.data;
        } catch (error) {
            console.error('Error fetching tour data:', error);
            set({ error: 'Failed to fetch tour data.', loading: false });
            return null;
        }
    },

    createTour: async (formData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`${baseURL}/tours`, formData);
            set({ loading: false });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error creating tour:', error);
            set({ loading: false });
            if (error.response) {
                return { success: false, status: error.response.status };
            } else if (error.request) {
                return { success: false, message: 'No response from server.' };
            }
            return { success: false, message: 'An error occurred.' };
        }
    },

    updateTour: async (id, formData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.patch(`${baseURL}/tours/${id}`, formData);
            set({ loading: false });
            return { success: response.status === 200, data: response.data };
        } catch (error) {
            console.error('Error updating tour:', error);
            set({ loading: false });
            return { success: false };
        }
    },

    // --- Sub-components Methods ---

    // Generic fetch helper for sub-entities
    _fetchSubEntity: async (endpoint) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${baseURL}/${endpoint}`);
            set({ loading: false });
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            set({ error: `Failed to fetch ${endpoint}.`, loading: false });
            return null;
        }
    },

    // Generic create helper for sub-entities
    _createSubEntity: async (endpoint, formData, isMultipart = false) => {
        set({ loading: true, error: null });
        try {
            const config = isMultipart ? { headers: { "Content-Type": "multipart/form-data" } } : {};
            const response = await axios.post(`${baseURL}/${endpoint}`, formData, config);
            set({ loading: false });
            return { success: true, data: response.data };
        } catch (error) {
            console.error(`Error creating ${endpoint}:`, error);
            set({ loading: false });
            if (error.response) return { success: false, status: error.response.status, data: error.response.data, message: error.response.data?.message };
            return { success: false, message: 'An error occurred.' };
        }
    },

    // Generic update helper for sub-entities
    _updateSubEntity: async (endpoint, formData, isMultipart = false) => {
        set({ loading: true, error: null });
        try {
            const config = isMultipart ? { headers: { "Content-Type": "multipart/form-data" } } : {};
            const response = await axios.patch(`${baseURL}/${endpoint}`, formData, config);
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
    fetchTourImage: (id) => get()._fetchSubEntity(`images/${id}`),
    createTourImage: (formData) => get()._createSubEntity('image', formData, true),
    updateTourImage: (id, formData) => get()._updateSubEntity(`image/${id}`, formData, true),

    // Details
    fetchTourDetail: (id) => get()._fetchSubEntity(`details/${id}`),
    createTourDetail: (formData) => get()._createSubEntity('detail', formData),
    updateTourDetail: (id, formData) => get()._updateSubEntity(`details/${id}`, formData),

    // Descriptions
    fetchTourDesc: (id) => get()._fetchSubEntity(`descs/${id}`),
    createTourDesc: (formData) => get()._createSubEntity('desc', formData),
    updateTourDesc: (id, formData) => get()._updateSubEntity(`desc/${id}`, formData),

    // Plans
    fetchTourPlan: (id) => get()._fetchSubEntity(`plans/${id}`),
    createTourPlan: (formData) => get()._createSubEntity('plan', formData),
    updateTourPlan: (id, formData) => get()._updateSubEntity(`plans/${id}`, formData),

    // Includes
    fetchTourInclude: (id) => get()._fetchSubEntity(`includes/${id}`),
    createTourInclude: (formData) => get()._createSubEntity('include', formData),
    updateTourInclude: (id, formData) => get()._updateSubEntity(`includes/${id}`, formData),

    // Not-Includes
    fetchTourNotInclude: (id) => get()._fetchSubEntity(`not-includes/${id}`),
    createTourNotInclude: (formData) => get()._createSubEntity('not-include', formData),
    updateTourNotInclude: (id, formData) => get()._updateSubEntity(`not-includes/${id}`, formData),

    // Cancellations
    fetchTourCancellation: (id) => get()._fetchSubEntity(`cancellations/${id}`),
    createTourCancellation: (formData) => get()._createSubEntity('cancellation', formData),
    updateTourCancellation: (id, formData) => get()._updateSubEntity(`cancellation/${id}`, formData),

    deleteTour: async (id) => {
        try {
            await axios.delete(`${baseURL}/tours/${id}`);
            // Remove from local state instead of refetching
            set((state) => ({
                tours: state.tours.filter((tour) => tour.id !== id),
            }));
            return true;
        } catch (error) {
            console.error('Error deleting tour:', error);
            return false;
        }
    },
}));

export default useTourStore;
