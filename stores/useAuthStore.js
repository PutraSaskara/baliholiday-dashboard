'use client';

import { create } from 'zustand';
import { clearTokenCache, fetchToken } from '@/apiConfig';

const useAuthStore = create((set) => ({
    isAuthenticated: null,

    checkAuth: async () => {
        try {
            const res = await fetch('/api/check-auth', {
                method: 'GET',
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                set({ isAuthenticated: data.authenticated });
                // Pre-load the JWT token into cache
                if (data.authenticated) {
                    fetchToken();
                }
                return data.authenticated;
            } else {
                set({ isAuthenticated: false });
                return false;
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
            set({ isAuthenticated: false });
            return false;
        }
    },

    login: async (username, password) => {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                set({ isAuthenticated: true });
                // Pre-fetch the JWT token into cache after login
                await fetchToken();
                return { success: true };
            } else {
                const data = await res.json();
                return { success: false, message: data.message || 'Login gagal' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Terjadi kesalahan saat login.' };
        }
    },

    logout: async () => {
        try {
            const res = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (res.ok) {
                set({ isAuthenticated: false });
                clearTokenCache();
                return true;
            } else {
                console.error('Failed to logout');
                return false;
            }
        } catch (error) {
            console.error('Logout error:', error);
            return false;
        }
    },
}));

export default useAuthStore;
