// lib/originCheck.js
// Same-origin gate for state-changing API routes (login/logout).
// Browsers always attach an Origin header on cross-origin POST, and on every
// same-origin POST issued by fetch/XHR. A POST without Origin therefore comes
// from a non-browser client and is rejected as well.

import { NextResponse } from 'next/server';

export function isSameOriginRequest(request) {
  const origin = request.headers.get('origin');
  if (!origin) {
    return false;
  }
  return origin === request.nextUrl.origin;
}

export function forbiddenResponse() {
  // Generic message: do not reveal which check failed.
  return NextResponse.json({ message: 'Permintaan ditolak' }, { status: 403 });
}
