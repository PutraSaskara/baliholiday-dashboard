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
| P4 | `72317fe` | polish, aksesibilitas, AI modal, adopsi ConfirmDialog, SessionTimer badge, Skeleton/EmptyState | SELESAI |
| P5 | — (belum di-commit) | CSP dev kondisional, script Cloudinary per halaman, Lighthouse, bersih-bersih, QA final | SELESAI |

Branch: `upgrade/next-16`. 7 commit di atas `origin/main`. Belum di-push.

## Hasil P5 (2026-11-06)

### Lighthouse (build produksi QA, `next start :3012`, backend lokal :5000)
| Halaman | Perf | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|
| `/` mobile | 100 | 764 ms | 764 ms | 38 ms | 0.008 |
| `/` desktop | 93 | 215 ms | 1724 ms | 0 ms | 0.014 |
| `/login` mobile | 100 | 758 ms | 758 ms | 55 ms | 0.000 |

Target terpenuhi: perf >= 90, TBT < 200 ms, CLS ~ 0. JSON: `dashboard/.playwright-mcp/lh/`.

### Perubahan inti
1. **CSP kondisional dev** (`next.config.mjs`): `connect-src` memuat `http://localhost:5000`
   hanya saat `process.env.NODE_ENV !== "production"`. Build produksi tetap ketat
   (diverifikasi di `.next/routes-manifest.json`: tanpa localhost).
   Deviasi kecil: `frame-src` kini ikut memuat `https://console.cloudinary.com` —
   widget media library Cloudinary baru memuat iframe dari domain itu; tanpa itu
   modal widget terblokir ("This content is blocked"). Lainnya tidak berubah.
2. **Script Cloudinary per halaman**: `<Script>` dihapus dari `app/layout.jsx`;
   `components/CloudinaryWidgetScript.jsx` (client, `lazyOnload`) dirender hanya di
   `AddTourImage`, `EditImage`, `AddArticleImage`, `EditArticleImage` (satu-satunya
   pemakai `openMediaLibrary` — sudah dicek grep).
3. **Bersih-bersih**: `console.log` sisa di `components/` + `app/` dihapus
   (`console.error` dipertahankan), 3 `alert()` di `ViewArea.jsx` -> toast.

### QA Playwright (1440x900 desktop + 390x844 mobile)
- Login lokal sukses (cookie via API, kredensial tidak dicetak).
- 11 pemeriksaan route: home, 6 sidebar, 2 tombol in-page (Add Destination,
  Add Area), wizard tour (desktop), home + wizard article (mobile) — semua
  mendarat di path benar, breadcrumb tampil, **0 respons HTTP 404**.
- **0 console error**, **0 overflow horizontal** (desktop 1425/1440,
  mobile 375/390), **0 error backend / 0 redirect paksa**.
- Widget Cloudinary: script termuat (`lazyOnload`), klik "Select from Cloudinary"
  tanpa `ReferenceError`, iframe `console.cloudinary.com` terbuka dan UI modal
  tampil (bukti: `ui-p5/wizard-desktop-cloudinary.png`).
  `ui-p5/widget-probe.png` = kondisi sebelum `frame-src` diperbaiki (terblokir).

### Validasi akhir
- `npm run lint`: exit 0, **0 error, 35 warning** (budget <= 35).
- `npm run build` (env default): exit 0, **28/28 halaman**.
- `.env` tidak diubah; `next.config.mjs` kembali ke kondisi benar
  (kondisional dev permanen, patch QA sementara sudah dihapus).

### Deviasi / catatan QA
1. **Backend perlu tahu origin QA**: `backend/.env` `CORS_ORIGIN` tidak memuat
   `http://localhost:3012`, sehingga semua panggilan API dari build QA diblokir
   CORS. Backend dijalankan ulang dengan env shell
   `CORS_ORIGIN=...,http://localhost:3012` — **file `.env` tidak diubah**.
   Untuk QA lokal berikutnya, lakukan hal yang sama.
2. **Rate limit backend 100 req/menit/IP** membuat navigasi QA cepat memicu
   429 -> `verifyToken` fail-closed -> redirect `/login`. QA harus di-pacing
   (jeda ~9 dtk antar step) dan backend di-reset (restart) sebelum run.
   Login rate limit 10/15 menit juga pernah menghambat; pakai cookie JWT
   yang masih berlaku (1 jam) untuk QA.
3. Lighthouse + QA memakai build QA sementara (patch `connect-src` localhost
   dihapus setelahnya). Angka performa tidak dipengaruhi patch tersebut.

## Sisa backlog
- Deploy backend (commit `96e907f`) sebelum deploy dashboard — lihat blocker 1.
- Desktop LCP 1724 ms (kartu/list menunggu data API); bisa ditingkatkan dengan
  SWR/preload atau placeholder statis bila target < 1,5 s diperlukan.
- Widget Cloudinary di QA headless menampilkan layar "Sign in to Cloudinary"
  (akun Cloudinary belum autentikasi di browser QA) — fungsionalitas pemilihan
  aset perlu diverifikasi sekali dengan akun Cloudinary yang sudah login.
- UI Reviewer batch penuh (shell + home + 6 list + 3 wizard + CRUD) belum
  dijalankan sebagai sesi terpisah; QA P5 mencakup shell, home, list via
  tab/sidebar, dan 2 wizard.


## Blocker / isu yang diketahui
1. **Backend produksi `https://api.saskaraputra.my.id/auth/verify` = 404.**
   Dashboard versi baru memvalidasi JWT ke endpoint itu. Deploy backend dulu
   (commit `96e907f` di repo backend), baru deploy dashboard. Tanpa itu login
   produksi akan loop ke `/login`.
2. ~~CSP `connect-src` belum memuat `http://localhost:5000`~~ — **SELESAI (P5)**:
   kondisional dev sudah permanen. Build QA produksi tinggal set
   `NEXT_PUBLIC_BACKEND_URL=http://localhost:5000`; origin lokal hanya masuk
   `connect-src` saat `NODE_ENV !== "production"` (lihat catatan deviasi P5
   untuk patch sementara yang dipakai saat QA).
   Catatan CORS: backend harus dijalankan dengan origin QA di `CORS_ORIGIN`
   (env shell, jangan edit `.env`), kalau tidak semua fetch API dari
   `:3012` diblokir.
3. Rate limit backend: global 100 req/menit/IP, login 10/15 menit, AI 20/15 menit.
   QA otomasi cepat bisa memicu redirect `/login` (fail-closed). Beri jeda antar
   navigasi (~9 dtk) dan restart backend untuk reset counter sebelum run panjang.
4. Lint warning 35 (pre-existing: `set-state-in-effect` dll). Budget jangan naik.
5. Wizard article = 3 langkah (Single Article, Paragraphs, Images), bukan 4.
6. `Checklist QA`: jangan submit form yang mengubah data produksi; backend lokal dipakai.

## Resep QA lokal
```powershell
# 1) backend — sertakan origin QA di CORS (env shell saja, .env tidak diubah)
cd D:/Saskara/Programming/baliholiday-backend-terbaru/backend
$env:CORS_ORIGIN = 'http://localhost:3000,https://baliholiday-dashboard.vercel.app,https://baliholiday.xyz,http://localhost:3001,http://localhost:3012'
npm.cmd start        # :5000
# 2) dashboard (build QA, jangan saat dev server memegang .next)
cd ../dashboard
$env:NEXT_PUBLIC_BACKEND_URL='http://localhost:5000'; npm.cmd run build
npx.cmd next start -p 3012   # env NEXT_PUBLIC_BACKEND_URL sama
# 3) login pakai ADMIN_USERNAME/ADMIN_PASSWORD dari backend/.env (jangan dicetak)
```
Catatan: `next build` gagal/hang bila dev server masih memegang `.next`. Matikan dulu.
Catatan: navigasi QA harus di-pacing (rate limit 100 req/menit); restart backend
untuk reset counter sebelum run Lighthouse/Playwright panjang.

## Artefak visual
- `p1-screenshots/` — login, dashboard, drawer, sidebar collapsed.
- `ui-review-p2/` — home, tabs, semua list (desktop + mobile).
- `ui-p3/` — wizard tour/article, activities, destinations, areas, edit tour.
- `ui-p5/` — home desktop/mobile, wizard article mobile, modal widget Cloudinary
  (bukti `frame-src` diperbaiki), `widget-probe.png` (kondisi terblokir sebelum fix).
- Lighthouse JSON: `dashboard/.playwright-mcp/lh/` (token sudah di-redact).

## Aturan kerja
- Jangan push tanpa instruksi user (permission push diblokir di lingkungan ini).
- Commit lokal per fase setelah build + lint hijau.
- Jangan cetak kredensial di laporan/log.
- Jangan mengubah store/API/skema data saat restyle.
