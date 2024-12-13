import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Define paths that require authentication
  const protectedPaths = ['/dashboard'];

  // Check if the request is for a protected path
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const auth = request.cookies.get('auth');

    if (!auth || auth.value !== 'true') {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Specify which paths to apply the middleware to
export const config = {
  matcher: ['/dashboard/:path*'],
};
