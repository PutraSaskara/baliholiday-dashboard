// app/api/check-auth/route.js

import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import { verifyToken } from '../../../lib/verifyToken';

export async function GET(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = parse(cookieHeader);
  const token = cookies.token;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Ask the backend whether the JWT is actually valid (not just present).
  const { valid } = await verifyToken(token);

  if (valid) {
    return NextResponse.json({ authenticated: true });
  }

  // Invalid/expired token (or backend unreachable): clear the cookie.
  const res = NextResponse.json({ authenticated: false }, { status: 401 });
  res.cookies.delete('token');
  return res;
}
