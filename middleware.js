import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // If on login page and already has token, redirect to dashboard
  if (pathname === '/login') {
    const token = request.cookies.get('token');
    if (token && token.value) {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
    return NextResponse.next();
  }

  // Protect all other matched routes — require JWT token cookie
  const token = request.cookies.get('token');

  if (!token || !token.value) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply middleware to all dashboard routes and login page
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/add-article/:path*',
    '/add-tour-package/:path*',
    '/edit-article/:path*',
    '/edit-tour-package/:path*',
    '/edit-destination/:path*',
    '/destinations/:path*',
    '/pickup-areas/:path*',
    '/login',
  ],
};
