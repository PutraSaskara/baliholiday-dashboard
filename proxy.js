import { NextResponse } from 'next/server';
import { verifyToken } from './lib/verifyToken';

// Next 16 proxy (Node runtime). Runs on every matched route below.
// Contract: every route except /login needs a valid JWT cookie, verified
// against GET {BACKEND_URL}/auth/verify. Invalid/expired tokens are cleared
// and the user is sent to /login.

function redirectToLogin(request) {
  const res = NextResponse.redirect(new URL('/login', request.url));
  res.cookies.delete('token'); // clear dead cookie so the next request does not loop
  return res;
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // /login: no token -> show login page.
  //         valid token -> redirect to dashboard.
  //         invalid token -> clear cookie + show login page (cookie removal
  //         guarantees the follow-up request takes the "no token" branch,
  //         so no redirect loop is possible).
  if (pathname === '/login') {
    if (!token) {
      return NextResponse.next();
    }
    const { valid } = await verifyToken(token);
    if (valid) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    const res = NextResponse.next();
    res.cookies.delete('token');
    return res;
  }

  // All other matched routes: require a valid token.
  if (!token) {
    const res = NextResponse.redirect(new URL('/login', request.url));
    return res; // no cookie to clear
  }

  const { valid } = await verifyToken(token);
  if (!valid) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

// Apply proxy to dashboard routes and login page.
// NOTE: /api/* is intentionally NOT in this matcher — the AI routes
// (/api/generate, /api/generate-global) verify the token themselves.
export const config = {
  matcher: [
    '/',
    '/add-article/:path*',
    '/add-tour-package/:path*',
    '/edit-article/:path*',
    '/edit-tour-package/:path*',
    '/edit-destination/:path*',
    '/destinations/:path*',
    '/pickup-areas/:path*',
    '/activities/:path*',
    '/seo/:path*',
    '/login',
  ],
};
