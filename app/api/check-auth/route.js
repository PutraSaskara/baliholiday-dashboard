// app/api/check-auth/route.js

import { NextResponse } from 'next/server';
import { parse } from 'cookie';

export async function GET(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = parse(cookieHeader);
  const isAuthenticated = cookies.auth === 'true';

  console.log('Check-auth: isAuthenticated =', isAuthenticated); // Log auth status

  if (isAuthenticated) {
    return NextResponse.json({ authenticated: true });
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
