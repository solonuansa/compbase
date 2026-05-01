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

### Database Plan (Tier 4 — Direncanakan)
- RLS formalisasi untuk `competitions`.
- Unique constraint `slug`.
- Kolom `competition_id` di `competition_submissions`.
- Index tambahan di `competition_submissions`.
- Fix kolom `reviewed_by` dari `uuid` ke `text`.
