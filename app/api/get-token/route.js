// app/api/get-token/route.js

import { NextResponse } from 'next/server';
import { parse } from 'cookie';

export async function GET(request) {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = parse(cookieHeader);
    const token = cookies.token;

    if (token) {
        return NextResponse.json({ token });
    } else {
        return NextResponse.json({ token: null }, { status: 401 });
    }
}
