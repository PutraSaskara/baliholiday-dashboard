// app/api/logout/route.js

import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import { isSameOriginRequest, forbiddenResponse } from '../../../lib/originCheck';

export async function POST(request) {
  // Origin check: reject cross-origin and Origin-less POST outright.
  if (!isSameOriginRequest(request)) {
    return forbiddenResponse();
  }

  // Clear the JWT token cookie by setting it to expire immediately
  const cookie = serialize('token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return new NextResponse(
    JSON.stringify({ message: 'Logged out successfully' }),
    {
      status: 200,
      headers: {
        'Set-Cookie': cookie,
        'Content-Type': 'application/json',
      },
    }
  );
}
