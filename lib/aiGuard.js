// lib/aiGuard.js
// SERVER-ONLY request guard shared by /api/generate and /api/generate-global.
// Order: cheap size check -> JWT verification -> rate limit -> body parse ->
// model allowlist. Rejected requests get a ready-to-return NextResponse;
// accepted requests get the parsed body plus the normalized model name.

import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import { verifyToken } from './verifyToken';
import { ALLOWED_AI_MODELS, DEFAULT_AI_MODEL } from './aiModels';
import { rateLimit } from './rateLimit';

export const MAX_BODY_BYTES = 100 * 1024; // 100 KB hard cap on request bodies

const tooLarge = () =>
  NextResponse.json({ error: 'Request body too large (max 100 KB).' }, { status: 413 });

function clientKey(req) {
  // Single-instance rate limiting keyed per user/IP.
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

/**
 * @param {Request} req
 * @returns {Promise<
 *   { ok: false, response: NextResponse } |
 *   { ok: true, body: any, model: string }
 * >}
 */
export async function guardAiRequest(req) {
  // 1) Cheap pre-check on the declared content length.
  const contentLength = Number(req.headers.get('content-length') || '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return { ok: false, response: tooLarge() };
  }

  // 2) Require a valid JWT cookie (verified against the backend).
  const token = parse(req.headers.get('cookie') || '').token;
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  const { valid } = await verifyToken(token);
  if (!valid) {
    const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    res.cookies.delete('token');
    return { ok: false, response: res };
  }

  // 3) Rate limit: max 10 requests / 10 minutes per user/IP (in-memory, single instance).
  if (!rateLimit(clientKey(req))) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Too many AI requests. Please wait a few minutes and try again.' },
        { status: 429 }
      ),
    };
  }

  // 4) Read and size-check the raw body.
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return { ok: false, response: tooLarge() };
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 }),
    };
  }

  // 5) Model allowlist — only models offered by the AI assistant UI.
  const model = body && body.model != null ? body.model : DEFAULT_AI_MODEL;
  if (typeof model !== 'string' || !ALLOWED_AI_MODELS.includes(model)) {
    return {
      ok: false,
      response: NextResponse.json({ error: `Model not allowed: ${String(model)}` }, { status: 400 }),
    };
  }

  return { ok: true, body, model };
}

export default guardAiRequest;
