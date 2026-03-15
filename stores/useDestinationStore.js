'use client';

import { create } from 'zustand';
import axios from 'axios';
import baseURL from '@/apiConfig';

const useDestinationStore = create((set, get) => ({
    destinations: [],
    totalPages: 1,
    currentPage: 1,
    loading: false,
    error: null,

    fetchDestinations: async (page = 1) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${baseURL}/api/destinations`, {
                params: { page, limit: 10 },
            });
            set({
                destinations: response.data.destinations,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
                loading: false,
            });
        } catch (error) {
            console.error('Error fetching destinations:', error);
            set({ error: 'Failed to fetch destinations.', loading: false });
        }
    },

    fetchDestinationById: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${baseURL}/api/destinations/${id}`);
            set({ loading: false, error: null });
            return response.data;
        } catch (error) {
            console.error('Error fetching destination:', error);
            set({ error: 'Failed to fetch destination details.', loading: false });
            return null;
        }
    },

    searchDestinations: async (query) => {
        if (!query.trim()) {
            return get().fetchDestinations();
        }

        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${baseURL}/api/destinations/search`, {
                params: { query },
            });
            set({
                destinations: response.data,
                totalPages: 1,
                currentPage: 1,
                loading: false,
            });
        } catch (error) {
            console.error('Error searching destinations:', error);
            set({ error: 'Failed to search destinations.', loading: false });
        }
    },

    createDestination: async (formData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`${baseURL}/api/destinations`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            set({ loading: false });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error creating destination:', error);
            set({ loading: false });
            if (error.response && error.response.data) {
                return { success: false, message: error.response.data.message };
            }
            return { success: false, message: 'Failed to add destination.' };
        }
    },

    updateDestination: async (id, formData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.patch(`${baseURL}/api/destinations/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            set({ loading: false });
            return { success: response.status === 200 };
        } catch (error) {
            console.error('Error updating destination:', error);
            set({ loading: false });
            return { success: false };
        }
    },

    deleteDestination: async (id) => {
        try {
            await axios.delete(`${baseURL}/destinations/${id}`);
            const { destinations, currentPage } = get();
            if (destinations.length === 1 && currentPage > 1) {
                get().fetchDestinations(currentPage - 1);
            } else {
                get().fetchDestinations(currentPage);
            }
            return true;
        } catch (error) {
            console.error('Error deleting destination:', error);
            return false;
        }
    },
}));

export default useDestinationStore;
