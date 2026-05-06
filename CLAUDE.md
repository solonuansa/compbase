@AGENTS.md

## Ringkasan Perubahan Terkini (May 2026)

### CI/CD Pipeline (Tier 1)
- Workflow `.github/workflows/deploy.yml` sekarang menjalankan `lint frontend`, `test backend`, dan `test frontend` sebelum build & deploy.
- Frontend health check ditambahkan setelah deploy (`curl` ke port 3100).
- Deploy akan otomatis di-cancel kalau salah satu quality gate gagal.

### Backend Security (Critical Fix)
- Auth bypass fallback dihapus dari `backend/src/server.ts` — `BACKEND_ADMIN_TOKEN` wajib diisi di production, kalau tidak semua write request ditolak (401).
- CORS wildcard (`*`) dihapus — sekarang hanya mengizinkan origin yang terdaftar di `ALLOWED_ORIGINS` env.

### Frontend UX & Accessibility (Tier 3)
- Submit form sekarang redirect ke `?status=terkirim` setelah sukses, sehingga form otomatis reset.
- `aria-live="polite"` ditambahkan di semua error/success message (SubmitForm, AdminLoginForm, AdminCompetitionEditorPanel).
- Tab switcher admin panel sekarang accessible dengan `role="tab"`, `aria-selected`, dan `role="tabpanel"`.
- Loading skeleton dan error boundary dibuat untuk root (`app/`) dan admin (`app/admin/`).

### Backend Robustness (Tier 2 — Selesai)
- Structured JSON logging (`backend/src/logger.ts`) dengan `request_id` per request.
- Request ID tracing: frontend otomatis kirim `X-Request-ID`, backend generate UUID fallback.
- Error 500 di production tidak leak stack trace — client hanya menerima `"Terjadi kesalahan internal."`.
- Server startup log sekarang juga format JSON.

### Database Integrity (Tier 4 — Selesai)
- 5 migration SQL baru:
  1. RLS formalisasi `competitions` (select public, all service_role)
  2. Unique constraint `slug` di `competitions`
  3. Kolom `competition_id` di `competition_submissions` (tanpa FK, nullable)
  4. Fix `reviewed_by` dari `uuid` → `text`
  5. Index performa (`created_at`, `submitter_email`, `competition_id`, `slug`)
- `createUniqueSlug(name, existingSlugs)` — auto-suffix `-2`, `-3` kalau slug duplikat.
- `approveSubmission` sekarang mengisi `competition_id` dengan ID kompetisi baru.

### Deferred / Direncanakan
- **Populasi `reviewed_by` dengan email admin** — butuh frontend kirim `X-Admin-Email` header + backend pass ke store. Ditunda karena perubahan interface lebih besar.
- **Pagination** `/competitions` dan `/submissions` — belum diterapkan.
- **Observability** (error-rate, rate-limit hit metrics) — belum diterapkan.
