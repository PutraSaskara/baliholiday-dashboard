// app/api/login/route.js

import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(request) {
  const { username, password } = await request.json();

  // Define your valid credentials
  const VALID_USERNAME = process.env.VALID_USERNAME;
  const VALID_PASSWORD = process.env.VALID_PASSWORD;

  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    // Create a cookie named 'auth' with value 'true'
    const cookie = serialize('auth', 'true', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60, // 1 hour in seconds
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production', // Set secure flag in production
    });

    return new NextResponse(
      JSON.stringify({ message: 'Login successful' }),
      {
        status: 200,
        headers: {
          'Set-Cookie': cookie,
          'Content-Type': 'application/json',
        },
      }
    );
  } else {
    return new NextResponse(
      JSON.stringify({ message: 'Invalid credentials' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
