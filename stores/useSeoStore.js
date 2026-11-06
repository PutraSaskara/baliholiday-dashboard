'use client';

// Store data SEO untuk halaman /seo: daftar metadata (filter + pagination),
// daftar agent key, dan audit log. Fetching dipusatkan di sini agar komponen
// memanggil store dari useEffect tanpa setState sinkron di effect
// (pola yang sama dengan store lain — lihat stores/README.md).

import { create } from 'zustand';
import { api } from '@/apiConfig';

const useSeoStore = create((set) => ({
    // --- Daftar metadata SEO ---
    seoItems: [],
    seoTotal: 0,
    seoTotalPages: 1,
    seoLoading: true,

    fetchSeoList: async ({ page = 1, limit = 10, status = '', q = '' } = {}) => {
        set({ seoLoading: true });
        try {
            const res = await api.get('/api/seo', {
                params: {
                    page,
                    limit,
                    ...(status ? { status } : {}),
                    ...(q ? { q } : {}),
                },
            });
            set({
                seoItems: res.data.items || [],
                seoTotal: res.data.totalItems || 0,
                seoTotalPages: res.data.totalPages || 1,
                seoLoading: false,
            });
        } catch (error) {
            console.error('Error fetching SEO metadata:', error);
            set({ seoItems: [], seoLoading: false });
            return false;
        }
        return true;
    },

    // --- Agent key + audit log ---
    agentKeys: [],
    auditLogs: [],
    agentLoading: true,

    fetchAgentData: async () => {
        set({ agentLoading: true });
        try {
            const [keysRes, auditRes] = await Promise.all([
                api.get('/api/agent-keys'),
                api.get('/api/agent-keys/audit', { params: { limit: 100 } }),
            ]);
            set({
                agentKeys: keysRes.data.items || [],
                auditLogs: auditRes.data.items || [],
                agentLoading: false,
            });
        } catch (error) {
            console.error('Error fetching agent keys:', error);
            set({ agentKeys: [], auditLogs: [], agentLoading: false });
            return false;
        }
        return true;
    },
}));

export default useSeoStore;
