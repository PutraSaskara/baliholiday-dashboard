// components/seo/seoUtils.js
// Konstanta + helper untuk halaman /seo. Tanpa dependency tambahan.

// Opsi pageKey sesuai rute web (baliholiday-new). `*` = fallback global.
export const PAGE_KEY_OPTIONS = [
  { value: "/", label: "/  (homepage)" },
  { value: "/about", label: "/about" },
  { value: "/activity", label: "/activity" },
  { value: "/activity/[slug]", label: "/activity/[slug]" },
  { value: "/bali-local-guide", label: "/bali-local-guide" },
  { value: "/bali-private-driver", label: "/bali-private-driver" },
  { value: "/bali-private-tour", label: "/bali-private-tour" },
  { value: "/bali-tour-packages", label: "/bali-tour-packages" },
  { value: "/blog/[slug]", label: "/blog/[slug]" },
  { value: "/blogs", label: "/blogs" },
  { value: "/booking/[slug]", label: "/booking/[slug]" },
  { value: "/booking-activity/[slug]", label: "/booking-activity/[slug]" },
  { value: "/contact", label: "/contact" },
  { value: "/custom-bali-itinerary", label: "/custom-bali-itinerary" },
  { value: "/custom-tour", label: "/custom-tour" },
  { value: "/custom-tour-booking", label: "/custom-tour-booking" },
  { value: "/package/[slug]", label: "/package/[slug]" },
  { value: "/packages", label: "/packages" },
  { value: "/privacy-policy", label: "/privacy-policy" },
  { value: "/refund-policy", label: "/refund-policy" },
  { value: "/terms", label: "/terms" },
  { value: "/thank-you", label: "/thank-you" },
  { value: "*", label: "*  (global fallback)" },
];

export const CUSTOM_PAGE_KEY = "__custom__";

// pageKey global: fallback untuk seluruh halaman, wajib scope seo:global di agent.
export const GLOBAL_PAGE_KEY = "*";

// Field tambahan yang hanya berlaku di record global (siteName/titleTemplate/locale).
export const LOCALE_PATTERN = /^[a-z]{2}(_[A-Z]{2})?$/;

export const SITE_NAME_MAX = 120;
export const TITLE_TEMPLATE_MAX = 200;

// Path yang dijalankan web dengan robots noindex terpaksa.
export const NOINDEX_PAGE_KEYS = [
  "/booking/[slug]",
  "/booking-activity/[slug]",
  "/thank-you",
  "/custom-tour-booking",
];

export const ENTITY_TYPES = [
  { value: "page", label: "Page" },
  { value: "tour", label: "Tour" },
  { value: "blog", label: "Blog" },
  { value: "activity", label: "Activity" },
  { value: "destination", label: "Destination" },
];

export const AGENT_SCOPES = [
  { value: "seo:read", label: "seo:read", hint: "Membaca daftar metadata" },
  {
    value: "content:read",
    label: "content:read",
    hint: "Baca konten (tour, blog, activity, destinasi)",
  },
  { value: "seo:write", label: "seo:write", hint: "Membuat & mengubah metadata" },
  { value: "seo:publish", label: "seo:publish", hint: "Publish & revalidate" },
  {
    value: "seo:global",
    label: "seo:global",
    hint: "Wajib untuk record global '*' (tulis, hapus, publish, rollback)",
  },
];

// Mode publish per key: draft-only menolak publish/rollback dengan 403.
export const PUBLISH_MODES = [
  { value: "publish", label: "Publish", hint: "Boleh publish & rollback." },
  {
    value: "draft-only",
    label: "Draft-only",
    hint: "Publish & rollback ditolak 403.",
  },
];

// Base URL situs untuk preview SERP/OG.
export const SITE_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://baliholiday.xyz";

export function isPresetPageKey(value) {
  return PAGE_KEY_OPTIONS.some((opt) => opt.value === value);
}

// URL absolut http(s) — dipakai validasi canonical/preview.
export function isAbsoluteHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// pageKey efektif dari state editor (preset atau custom).
export function resolvePageKey(form) {
  if (form.pageKeyMode === "custom") return form.pageKeyCustom.trim();
  return form.pageKey;
}

// Record global = pageKey '*'. Hanya di sini siteName/titleTemplate/locale berlaku.
export function isGlobalPageKey(pageKey) {
  return pageKey === GLOBAL_PAGE_KEY;
}

export function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Pesan error konsisten dari respons axios backend.
export function extractApiError(err, fallback) {
  const data = err && err.response && err.response.data;
  if (data) {
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.join(", ");
    }
    if (typeof data.error === "string" && data.error) return data.error;
    if (typeof data.message === "string" && data.message) return data.message;
  }
  return fallback;
}
