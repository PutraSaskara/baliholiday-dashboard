// app/api/get-token/route.js

import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import { verifyToken } from '../../../lib/verifyToken';

export async function GET(request) {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = parse(cookieHeader);
    const token = cookies.token;

    if (!token) {
        return NextResponse.json({ token: null }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    }

    // Verify against the backend before handing the token out.
    const { valid } = await verifyToken(token);

    if (!valid) {
        // Invalid/expired: clear the cookie and do NOT return the token.
        const res = NextResponse.json({ token: null }, { status: 401 });
        res.cookies.delete('token');
        res.headers.set('Cache-Control', 'no-store');
        return res;
    }

    return NextResponse.json(
        { token },
        { headers: { 'Cache-Control': 'no-store' } }
    );
}
