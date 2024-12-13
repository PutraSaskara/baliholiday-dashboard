// app/api/logout/route.js

import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  // Clear the 'auth' cookie by setting it to expire in the past
  const cookie = serialize('auth', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0), // Expire the cookie immediately
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production', // Set secure flag in production
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
