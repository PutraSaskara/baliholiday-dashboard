// app/api/seo-static/route.js
// Proxy read-only ke endpoint publik web GET {SEO_WEB_URL}/api/seo-static.
// Wajib cookie JWT `token` yang valid; tanpa login → 401.

import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import { verifyToken } from '../../../lib/verifyToken';

const WEB_BASE_URL = (process.env.SEO_WEB_URL || 'https://baliholiday.xyz').replace(/\/+$/, '');

export async function GET(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = parse(cookieHeader);
  const token = cookies.token;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }

  // Ask the backend whether the JWT is actually valid (not just present).
  const { valid } = await verifyToken(token);
  if (!valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    const res = await fetch(`${WEB_BASE_URL}/api/seo-static`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!res.ok) {
      throw new Error(`Upstream status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json(
      { error: 'Gagal mengambil data SEO statis' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
