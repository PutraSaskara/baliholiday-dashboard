// lib/verifyToken.js
// SERVER-ONLY helper. Verify the JWT by asking the backend.
// Do NOT import this file from client components ('use client'):
// it runs server-side network calls (proxy.js and app/api routes).

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

/**
 * Verify a JWT against GET {BACKEND_URL}/auth/verify
 * with `Authorization: Bearer <token>`.
 *
 * @param {string} token - raw JWT string
 * @returns {Promise<{ valid: boolean, status: number }>}
 *   status: HTTP status returned by the backend, or 0 on network error/timeout.
 *   On any network error / timeout the token is treated as invalid.
 */
export async function verifyToken(token) {
  if (!token || typeof token !== 'string') {
    return { valid: false, status: 0 };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });

    if (!res.ok) {
      // 401 = expired, 403 = invalid (per backend contract)
      return { valid: false, status: res.status };
    }

    const data = await res.json().catch(() => null);
    if (data && data.valid === true) {
      return { valid: true, status: res.status };
    }
    // 200 but payload does not confirm validity — treat as invalid.
    return { valid: false, status: res.status };
  } catch {
    // Network error, DNS failure, abort/timeout — treat as invalid.
    return { valid: false, status: 0 };
  }
}

export default verifyToken;
