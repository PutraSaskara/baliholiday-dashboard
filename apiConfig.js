// apiConfig.js
import axios from 'axios';

const baseURL = 'https://api.saskaraputra.my.id';
// const baseURL = 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
    baseURL,
});

// Cache for the JWT token to avoid fetching on every request
let cachedToken = null;
let tokenExpiry = null; // Unix timestamp (seconds) when token expires

// Decode JWT payload without external library
const decodeJwtPayload = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

// Function to fetch JWT token from the Next.js API (httpOnly cookie)
export const fetchToken = async () => {
    try {
        const res = await fetch('/api/get-token', {
            method: 'GET',
            credentials: 'include',
        });
        if (res.ok) {
            const data = await res.json();
            cachedToken = data.token;

            // Decode and cache expiry time
            if (data.token) {
                const payload = decodeJwtPayload(data.token);
                tokenExpiry = payload?.exp || null;
            }

            return data.token;
        }
        cachedToken = null;
        tokenExpiry = null;
        return null;
    } catch (error) {
        console.error('Error fetching token:', error);
        cachedToken = null;
        tokenExpiry = null;
        return null;
    }
};

// Get the cached token or fetch a new one
export const getToken = async () => {
    if (cachedToken) {
        // Check if token is expired
        if (tokenExpiry && Date.now() / 1000 >= tokenExpiry) {
            cachedToken = null;
            tokenExpiry = null;
            return null;
        }
        return cachedToken;
    }
    return await fetchToken();
};

// Get token expiry timestamp (in seconds)
export const getTokenExpiry = () => tokenExpiry;

// Clear cached token (call on logout)
export const clearTokenCache = () => {
    cachedToken = null;
    tokenExpiry = null;
};

// Helper to get auth headers for write operations (POST/PATCH/DELETE)
export const getAuthHeaders = async () => {
    const token = await getToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
};

// Request interceptor — adds x-api-key and Bearer token for all requests
api.interceptors.request.use(
    async (config) => {
        // Add API Key header for all requests to backend
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        if (apiKey) {
            config.headers['x-api-key'] = apiKey;
        }

        // Add Bearer token if available (auto-attach to every request)
        const token = await getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401 unauthorized (expired token)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid — clear cache and redirect to login
            clearTokenCache();

            // Redirect to login (only in browser)
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export { api };
export default baseURL;
