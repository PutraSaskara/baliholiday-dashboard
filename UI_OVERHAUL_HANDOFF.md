# Dashboard UI/UX Overhaul — Handoff

Diperbarui: 2026-11-06. Baca file ini sebelum melanjutkan pekerjaan UI dashboard.

## Tujuan
Merombak UI/UX dashboard menjadi modern, mobile-friendly, dan performa baik.
Keputusan user (final): tema TERANG (tanpa dark mode), slate netral + teal `#008199` +
gold `#c9a96e`, semua form bisa diedit penuh di mobile, UI Reviewer diaktifkan
(batch per milestone, bukan per komponen).

## Status fase
| Fase | Commit | Isi | Status |
|---|---|---|---|
| P1 | `99c58b0` | token, primitives (`components/ui/*`), `AppShell`, login split-screen | SELESAI |
| P2 | `6e4e76a` | `DashboardHome` + stat card, `NavList` tabs, list pages tabel/kartu, toast/confirm | SELESAI |
| P3 | `bedcc44` | `Stepper`, `FormShell`, `FormSection`, `FormActions`, wizard tour 6 langkah, article 3 langkah, edit flow, CRUD, 91 alert -> toast | SELESAI |
| P4 | — | sisa polish, aksesibilitas, AI modal, adopsi ConfirmDialog | BELUM |
| P5 | — | performance pass + UI Reviewer + final | BELUM |

Branch: `upgrade/next-16`. 7 commit di atas `origin/main`. Belum di-push.

## P4 — tugas yang tersisa (detail)
1. `components/AIAssistantModal.jsx`: restyle memakai `Card`/`Select`/`Button`,
   state loading skeleton, lazy mount (baru dimuat saat dibuka), model list dari
   `lib/aiModels.js`, tampilkan error generik.
2. Adopsi `ConfirmDialog` untuk aksi destruktif yang masih memakai confirm bawaan
   (cek `grep -rn "window.confirm" components app`).
3. Aksesibilitas: audit `grep -c "<input"` vs `htmlFor`; lengkapi label, `aria-label`
   pada tombol ikon, `aria-live` untuk toast, fokus kembali ke pemicu setelah dialog tutup.
4. `SessionTimer`: tampilkan sebagai badge ringkas, peringatan < 5 menit.
5. Loading/empty state konsisten di semua list dan form (Skeleton/EmptyState).
6. Hapus komponen yatim yang tersisa setelah refactor (cek import 0 sebelum hapus).

## P5 — performance + review
1. CSP dev: tambahkan `http://localhost:5000` ke `connect-src` HANYA saat
   `NODE_ENV !== "production"` supaya QA lokal tidak perlu patch manual.
2. Pindahkan script Cloudinary (`media-library.cloudinary.com`) dari `app/layout.jsx`
   ke halaman upload (Add/Edit Image) agar tidak dimuat di semua halaman.
3. Ukur Lighthouse mobile untuk `/login` dan `/` (dengan login) — target perf >= 90,
   TBT < 200 ms, CLS 0. Catat di dokumen ini.
4. Jalankan UI Reviewer batch: shell + home + 6 list + 3 wizard + CRUD utama.
   Simpan screenshot ke `ui-review-final/`.
5. Build + lint final, lalu commit.

## Blocker / isu yang diketahui
1. **Backend produksi `https://api.saskaraputra.my.id/auth/verify` = 404.**
   Dashboard versi baru memvalidasi JWT ke endpoint itu. Deploy backend dulu
   (commit `96e907f` di repo backend), baru deploy dashboard. Tanpa itu login
   produksi akan loop ke `/login`.
2. CSP `connect-src` belum memuat `http://localhost:5000`; untuk QA lokal pakai
   build dengan `NEXT_PUBLIC_BACKEND_URL=http://localhost:5000` + patch CSP sementara
   (kembalikan setelah QA), atau kerjakan P5 poin 1 lebih dulu.
3. Rate limit backend: global 100 req/menit/IP, login 10/15 menit, AI 20/15 menit.
   QA otomasi cepat bisa memicu redirect `/login` (fail-closed). Beri jeda antar navigasi.
4. Lint warning 36 (pre-existing: `set-state-in-effect` dll). Budget jangan naik.
5. Wizard article = 3 langkah (Single Article, Paragraphs, Images), bukan 4.
6. `Checklist QA`: jangan submit form yang mengubah data produksi; backend lokal dipakai.

## Resep QA lokal
```bash
# 1) backend
cd D:/Saskara/Programming/baliholiday-backend-terbaru/backend && npm start   # :5000
# 2) dashboard (build QA, jangan saat dev server memegang .next)
cd ../dashboard
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000 npm run build
npx next start -p 3012
# 3) login pakai ADMIN_USERNAME/ADMIN_PASSWORD dari backend/.env (jangan dicetak)
```
Catatan: `next build` gagal/hang bila dev server masih memegang `.next`. Matikan dulu.

## Artefak visual
- `p1-screenshots/` — login, dashboard, drawer, sidebar collapsed.
- `ui-review-p2/` — home, tabs, semua list (desktop + mobile).
- `ui-p3/` — wizard tour/article, activities, destinations, areas, edit tour.
- Lighthouse JSON: `dashboard/.playwright-mcp/lh/` (bila ada).

## Aturan kerja
- Jangan push tanpa instruksi user (permission push diblokir di lingkungan ini).
- Commit lokal per fase setelah build + lint hijau.
- Jangan cetak kredensial di laporan/log.
- Jangan mengubah store/API/skema data saat restyle.
