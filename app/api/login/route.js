// app/api/login/route.js

import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Proxy login request to backend Express.js server
    const backendRes = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data.message || 'Login gagal' },
        { status: backendRes.status }
      );
    }

    // Extract JWT token from backend response
    const token = data.token;

    if (!token) {
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
