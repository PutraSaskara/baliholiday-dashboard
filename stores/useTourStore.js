'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, getAuthHeaders } from '@/apiConfig';

const useTourStore = create(
    persist(
        (set, get) => ({
    tours: [],
    loading: false,
    error: null,

    // Draft states for Tour Creation Flow
    draftTour: null,
    draftTourDetail: null,
    draftTourDesc: null,
    draftTourPlan: null,
    draftTourInclude: null,
    draftTourNotInclude: null,
    draftTourCancellation: null,
    hasUnsavedTourChanges: false,

    setDraftTour: (data) => set({ draftTour: data, hasUnsavedTourChanges: true }),
    setDraftTourDetail: (data) => set({ draftTourDetail: data, hasUnsavedTourChanges: true }),
    setDraftTourDesc: (data) => set({ draftTourDesc: data, hasUnsavedTourChanges: true }),
    setDraftTourPlan: (data) => set({ draftTourPlan: data, hasUnsavedTourChanges: true }),
    setDraftTourInclude: (data) => set({ draftTourInclude: data, hasUnsavedTourChanges: true }),
    setDraftTourNotInclude: (data) => set({ draftTourNotInclude: data, hasUnsavedTourChanges: true }),
    setDraftTourCancellation: (data) => set({ draftTourCancellation: data, hasUnsavedTourChanges: true }),
    setHasUnsavedTourChanges: (status) => set({ hasUnsavedTourChanges: status }),
    
    clearTourDrafts: () => set({ 
        draftTour: null, 
        draftTourDetail: null, 
        draftTourDesc: null, 
        draftTourPlan: null, 
        draftTourInclude: null,
        draftTourNotInclude: null,
        draftTourCancellation: null,
        hasUnsavedTourChanges: false 
    }),

    fetchTours: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/tours');
            set({ tours: response.data, loading: false });
        } catch (error) {
            console.error('Error fetching tours:', error);
            set({ error: 'Failed to fetch tours.', loading: false });
        }
    },

    fetchTourById: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/tourssimple/${id}`);
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
            const authHeaders = await getAuthHeaders();
            const response = await api.post('/tours', formData, {
                headers: { ...authHeaders },
            });
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
            const authHeaders = await getAuthHeaders();
            const response = await api.patch(`/tours/${id}`, formData, {
                headers: { ...authHeaders },
            });
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
            const response = await api.get(`/${endpoint}`);
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

    // Generic update helper for sub-entities
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
            const authHeaders = await getAuthHeaders();
            await api.delete(`/tours/${id}`, {
                headers: { ...authHeaders },
            });
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

    // Master Orchestrator for Draft Flow
    submitAllTourDrafts: async (imageFormData) => {
        const state = get();
        set({ loading: true, error: null });

        try {
            // 1. Submit Tour (Base Entity)
            if (!state.draftTour) throw new Error("Missing Base Tour data.");
            const tourRes = await get().createTour(state.draftTour);
            if (!tourRes.success) throw new Error(tourRes.message || "Failed to create tour.");
            
            // Extract the newly created tour ID.
            const newTourId = tourRes.data?.id || tourRes.data?.tourId || tourRes.data?.data?.id; 
            if (!newTourId) throw new Error("Could not retrieve new Tour ID from server response.");

            // 2. Submit Detail
            if (state.draftTourDetail) {
                const detailData = { ...state.draftTourDetail, tourId: newTourId };
                const res = await get().createTourDetail(detailData);
                if (!res.success) throw new Error(res.message || "Failed to create details.");
            }

            // 3. Submit Desc
            if (state.draftTourDesc) {
                const descData = { ...state.draftTourDesc, tourId: newTourId };
                const res = await get().createTourDesc(descData);
                if (!res.success) throw new Error(res.message || "Failed to create description.");
            }

            // 4. Submit Plan
            if (state.draftTourPlan) {
                const planData = { ...state.draftTourPlan, tourId: newTourId };
                const res = await get().createTourPlan(planData);
                if (!res.success) throw new Error(res.message || "Failed to create plan.");
            }

            // 5. Submit Other Info: Include, Not Include, Cancellation
            if (state.draftTourInclude) {
                const incData = { ...state.draftTourInclude, tourId: newTourId };
                const res = await get().createTourInclude(incData);
                if (!res.success) throw new Error(res.message || "Failed to create Includes.");
            }
            if (state.draftTourNotInclude) {
                const notIncData = { ...state.draftTourNotInclude, tourId: newTourId };
                const res = await get().createTourNotInclude(notIncData);
                if (!res.success) throw new Error(res.message || "Failed to create Not Includes.");
            }
            if (state.draftTourCancellation) {
                const cancelData = { ...state.draftTourCancellation, tourId: newTourId };
                const res = await get().createTourCancellation(cancelData);
                if (!res.success) throw new Error(res.message || "Failed to create Cancellations.");
            }

            // 6. Upload Images (Final Step)
            if (imageFormData) {
                imageFormData.set("tourId", newTourId); 
                const iRes = await get().createTourImage(imageFormData);
                if (!iRes.success) throw new Error(iRes.message || "Failed to upload images.");
            }

            // Success: clear drafts
            get().clearTourDrafts();
            set({ loading: false });
            return { success: true, message: "All Tour data submitted successfully!" };

        } catch (error) {
            console.error("Error in submitAllTourDrafts:", error);
            set({ loading: false, error: error.message });
            return { success: false, message: error.message };
        }
    },
    }),
    {
      name: 'tour-draft-storage',
      partialize: (state) => ({ 
        draftTour: state.draftTour,
        draftTourDetail: state.draftTourDetail,
        draftTourDesc: state.draftTourDesc,
        draftTourPlan: state.draftTourPlan,
        draftTourInclude: state.draftTourInclude,
        draftTourNotInclude: state.draftTourNotInclude,
        draftTourCancellation: state.draftTourCancellation,
        hasUnsavedTourChanges: state.hasUnsavedTourChanges
      }), // Persist ONLY draft state
    }
  )
);

export default useTourStore;
