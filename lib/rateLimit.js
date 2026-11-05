// lib/rateLimit.js
// Simple in-memory fixed-window rate limiter for the AI generate routes.
//
// LIMITATION: this Map lives in the memory of a single Node.js process.
// It is only correct for a SINGLE INSTANCE deployment — it resets on server
// restart and is NOT shared between multiple instances/workers (no Redis).
// Keep the limit deliberately small so a burst from one instance is still bounded.

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 10; // max 10 requests per window per key (user/IP)
const MAX_KEYS = 10000; // safety cap so the Map cannot grow without bound

const hits = new Map(); // key -> array of request timestamps (ms)

/**
 * Record a request for `key`.
 * @param {string} key - usually the client IP
 * @returns {boolean} true = allowed, false = rate limited (429)
 */
export function rateLimit(key) {
  const now = Date.now();

  // Opportunistic cleanup: drop keys whose window fully elapsed.
  if (hits.size > MAX_KEYS) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);
  return true;
}

export default rateLimit;
