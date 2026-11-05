// app/api/login/route.js

import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import { isSameOriginRequest, forbiddenResponse } from '../../../lib/originCheck';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000';

// Input limits (Sprint 1): keep attacker-controlled input small and typed.
const MAX_BODY_BYTES = 2048;
const USERNAME_MAX = 64;
const PASSWORD_MAX = 128;

function invalidRequest() {
  // Generic 400: never echo parsing errors or field-level internals.
  return NextResponse.json({ message: 'Permintaan tidak valid' }, { status: 400 });
}

export async function POST(request) {
  // Origin check: reject cross-origin and Origin-less POST outright.
  if (!isSameOriginRequest(request)) {
    return forbiddenResponse();
  }

  const contentType = request.headers.get('content-type') || '';
  if (contentType.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return NextResponse.json({ message: 'Konten tipe tidak didukung' }, { status: 415 });
  }

  let raw;
  try {
    raw = await request.text();
  } catch {
    return invalidRequest();
  }

  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
    return invalidRequest();
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return invalidRequest();
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return invalidRequest();
  }

  const { username, password } = parsed;
  if (typeof username !== 'string' || typeof password !== 'string') {
    return invalidRequest();
  }
  if (username.length < 1 || username.length > USERNAME_MAX) {
    return invalidRequest();
  }
  if (password.length < 1 || password.length > PASSWORD_MAX) {
    return invalidRequest();
  }

  try {
    // Proxy login request to backend Express.js server
    const backendRes = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    // Tolerate non-JSON upstream bodies so the mapping below never throws.
    const text = await backendRes.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }

    if (!backendRes.ok) {
      // Keep upstream status mapping: 401 wrong credentials, 429 rate limit.
      return NextResponse.json(
        { message: typeof data.message === 'string' ? data.message : 'Login gagal' },
        { status: backendRes.status }
      );
    }

    // Extract JWT token from backend response
    const token = data.token;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { message: 'Token tidak diterima dari server' },
        { status: 500 }
      );
    }

    // Store JWT in httpOnly cookie
    const cookie = serialize('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60, // 1 hour (match backend JWT expiry)
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return new NextResponse(
      JSON.stringify({ message: 'Login berhasil' }),
      {
        status: 200,
        headers: {
          'Set-Cookie': cookie,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
