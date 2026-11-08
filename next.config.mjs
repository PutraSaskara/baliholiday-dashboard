// Sprint 1 (hardening): conservative, enforced CSP + baseline security headers
// applied to every path. Keep origin lists in sync with the actual runtime
// dependencies (Cloudinary widgets, backend API). AI provider calls go through
// the backend proxy, so no OpenRouter origin is needed here.
const CONNECT_SRC = [
    "'self'",
    "https://api.saskaraputra.my.id",
    "https://res.cloudinary.com",
];

// Local backend origin is allowed ONLY outside production builds so QA/dev
// against http://localhost:5000 needs no manual CSP patch. Production stays tight.
if (process.env.NODE_ENV !== "production") {
    CONNECT_SRC.push("http://localhost:5000");
}

const CONTENT_SECURITY_POLICY = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://media-library.cloudinary.com https://product-gallery.cloudinary.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://res.cloudinary.com https://api.saskaraputra.my.id https://localhost",
    `connect-src ${CONNECT_SRC.join(" ")}`,
    "frame-src 'self' https://media-library.cloudinary.com https://product-gallery.cloudinary.com https://console.cloudinary.com",
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Do not advertise the framework version in responses.
    poweredByHeader: false,
    images: {
        remotePatterns: [
            { hostname: 'api.saskaraputra.my.id' },
            { hostname: 'localhost' },
            { hostname: 'res.cloudinary.com' },
        ],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'Referrer-Policy', value: 'no-referrer' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    // Only honoured over HTTPS, so it is a no-op on http://localhost dev.
                    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
                    { key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY },
                ],
            },
        ];
    },
};

export default nextConfig;
