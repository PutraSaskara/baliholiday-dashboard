// components/seo/seoScore.js
// Skor kelengkapan metadata SEO (total 100) tanpa dependency.
// Dipakai tab Metadata untuk badge skor, strip ringkas, dan urutan klien.

const toText = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  return String(value).trim();
};

const isFilled = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
};

// Check sederhana: terisi penuh atau kosong.
const filledCheck = (key, label, weight, value, emptyHint) => {
  const ok = isFilled(value);
  return {
    key,
    label,
    weight,
    points: ok ? weight : 0,
    ok,
    hint: ok ? `${label} sudah terisi.` : emptyHint,
  };
};

/**
 * Hitung skor kelengkapan metadata.
 * @param {object} item Record SEO (title, description, ogImage, dst).
 * @returns {{ score: number, checks: Array<{key:string,label:string,weight:number,ok:boolean,hint:string}> }}
 */
export function computeSeoScore(item = {}) {
  const data = item || {};
  const title = toText(data.title);
  const description = toText(data.description);
  const titleLength = title.length;
  const descriptionLength = description.length;

  // Title: 30-60 karakter = 20, ada tapi di luar rentang = 12, kosong = 0.
  let titlePoints = 0;
  let titleHint = "Title wajib diisi; ideal 30-60 karakter.";
  if (titleLength > 0) {
    if (titleLength >= 30 && titleLength <= 60) {
      titlePoints = 20;
      titleHint = "Title sudah ideal (30-60 karakter).";
    } else {
      titlePoints = 12;
      titleHint = `Title ideal 30-60 karakter (sekarang ${titleLength}).`;
    }
  }

  // Description: 120-160 = 25, 60-200 = 15, <60 = 8, kosong = 0.
  let descriptionPoints = 0;
  let descriptionHint = "Description wajib diisi; ideal 120-160 karakter.";
  if (descriptionLength > 0) {
    if (descriptionLength >= 120 && descriptionLength <= 160) {
      descriptionPoints = 25;
      descriptionHint = "Description sudah ideal (120-160 karakter).";
    } else if (descriptionLength >= 60) {
      descriptionPoints = 15;
      descriptionHint = `Description ideal 120-160 karakter (sekarang ${descriptionLength}).`;
    } else {
      descriptionPoints = 8;
      descriptionHint = `Description terlalu pendek; minimal 60 karakter (sekarang ${descriptionLength}).`;
    }
  }

  const checks = [
    {
      key: "title",
      label: "Title",
      weight: 20,
      points: titlePoints,
      ok: titlePoints === 20,
      hint: titleHint,
    },
    {
      key: "description",
      label: "Description",
      weight: 25,
      points: descriptionPoints,
      ok: descriptionPoints === 25,
      hint: descriptionHint,
    },
    filledCheck(
      "ogImage",
      "og:image",
      15,
      data.ogImage,
      "og:image belum diisi; tambahkan gambar pratinjau."
    ),
    filledCheck(
      "ogTitle",
      "og:title",
      5,
      data.ogTitle,
      "og:title belum diisi."
    ),
    filledCheck(
      "ogDescription",
      "og:description",
      5,
      data.ogDescription,
      "og:description belum diisi."
    ),
    filledCheck(
      "canonical",
      "Canonical",
      8,
      data.canonical,
      "Canonical belum diisi."
    ),
    filledCheck(
      "keywords",
      "Keywords",
      7,
      data.keywords,
      "Keywords belum diisi."
    ),
    filledCheck(
      "jsonld",
      "JSON-LD",
      10,
      data.jsonld,
      "JSON-LD belum diisi."
    ),
    filledCheck(
      "twitterCard",
      "Twitter card",
      5,
      data.twitterCard,
      "Twitter card belum diisi."
    ),
  ];

  const score = checks.reduce((total, check) => total + check.points, 0);

  return {
    score,
    checks: checks.map((check) => ({
      key: check.key,
      label: check.label,
      weight: check.weight,
      ok: check.ok,
      hint: check.hint,
    })),
  };
}

// Warna tone badge skor: >=85 success, 70-84 warning, <70 danger.
export function seoScoreTone(score) {
  const value = Number(score);
  if (Number.isFinite(value) && value >= 85) return "success";
  if (Number.isFinite(value) && value >= 70) return "warning";
  return "danger";
}
