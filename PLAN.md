# Plan - CompBase (Monorepo)

## Phase 1: Frontend Foundation
- Status: Selesai
- Catatan: Landing page publik, filter URL-based, spotlight, dan kartu kompetisi sudah siap.

## Phase 2: Monorepo Split frontend/backend
- Status: Selesai
- Catatan: Struktur repo dipisah menjadi folder frontend dan backend dengan pnpm workspace.

## Phase 3: Backend Service Baseline
- Status: Selesai awal
- Catatan: Backend TypeScript sudah berjalan dengan endpoint health check di `/health`.

## Phase 4: Integrasi Frontend <-> Backend API
- Status: Selesai
- Catatan: Backend sudah menyediakan endpoint katalog kompetisi, frontend memakai data backend dengan fallback ke data lokal saat koneksi bermasalah.

### Checklist Teknis Phase 4
- [x] Menambahkan endpoint data kompetisi di backend (read-only).
- [x] Menghubungkan frontend ke endpoint backend untuk data nyata.
- [x] Menambahkan penanganan error dan fallback UI di frontend.
- [x] Menyiapkan konfigurasi environment (`BACKEND_BASE_URL`) untuk dev dan production.

## Phase 5: Konsolidasi Data Admin
- Status: Selesai
- Catatan: Panel admin kini terhubung penuh ke mutasi backend untuk aksi create/update/delete, dengan validasi input di sisi client dan server action sebelum request dikirim.

### Checklist Teknis Phase 5
- [x] Menghubungkan panel admin ke endpoint backend untuk data baca awal.
- [x] Menambahkan login admin dasar untuk melindungi route `/admin/panel`.
- [x] Merapikan editor admin agar bisa mengelola deskripsi, prioritas, validasi, reset draft, dan duplikasi data secara lokal.
- [x] Menyiapkan endpoint create/update/delete kompetisi di backend.
- [x] Menghubungkan aksi simpan/hapus admin ke backend.
- [x] Menambahkan validasi input admin sebelum mutasi data dikirim.

## Phase 6: Deployment ke VPS Pribadi
- Status: Selesai
- Catatan: Jalur deploy aktif ke VPS pribadi dengan GitHub Actions. Workflow sekarang mencakup lint, test backend, test frontend, build, deploy, health check backend, dan health check frontend (port 3100).

### Checklist Teknis Phase 6
- [x] Menyusun panduan deployment step-by-step di `DEPLOYMENT.md`.
- [x] Menyesuaikan dokumentasi environment untuk kebutuhan production.
- [x] Menambahkan workflow GitHub Actions untuk build dan deploy ke VPS.
- [x] Menentukan branch deploy utama dan daftar GitHub Secrets yang wajib diisi.
- [x] Menambahkan checklist verifikasi pascadeploy untuk frontend dan backend.
- [x] Menambahkan proteksi token untuk endpoint write backend (`POST/PUT/DELETE`) — token wajib diisi.
- [x] Menambahkan quality gate lint + test di CI/CD sebelum build & deploy.
- [x] Menambahkan frontend health check setelah deploy (port 3100).

## Phase 7: Persistensi Data dan Mutasi Admin
- Status: Selesai
- Catatan: Validasi Zod sudah ditambahkan, mutasi panel admin aktif ke backend, cache homepage sudah bisa diinvalidasi, audit log admin sudah tersimpan di Supabase, hardening auth/rate limiting dasar sudah diterapkan, dan CORS sudah direstrict.

### Checklist Teknis Phase 7
- [x] Menambahkan dependency validasi yang disetujui untuk alur write.
- [x] Menyusun schema input kompetisi yang dipakai client dan server.
- [x] Menyambungkan panel admin ke alur simpan/hapus data nyata.
- [x] Menambahkan cache server pada fetch kompetisi homepage.
- [x] Menambahkan invalidasi cache berbasis tag setelah mutasi admin.
- [x] Menambahkan tabel audit log + helper logging pada server action admin.
- [x] Menambahkan rate limiting backend untuk submit publik dan write admin.
- [x] Memperkuat auth admin (hash password scrypt + signed session cookie).
- [x] Menghapus fallback plaintext password admin (`ADMIN_PASSWORD`).
- [x] Menambahkan script helper `pnpm admin:hash-password` untuk generate hash scrypt.
- [x] Menentukan penyimpanan data production yang persisten (Supabase).
- [x] Menghapus auth bypass fallback di backend (token wajib untuk write).
- [x] Menghapus CORS wildcard (`*`) dan mengganti dengan allowed origins dari env.

## Phase 8: Operasional Production & Keamanan
- Status: Selesai
- Catatan: Dokumentasi deployment sudah diperbarui untuk env keamanan (`ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, `BACKEND_TRUST_PROXY`, `ALLOWED_ORIGINS`), migration policy audit log RLS, CI/CD quality gates, structured logging, dan error handling production-safe.

### Checklist Teknis Phase 8
- [x] Menambahkan migration `admin_audit_logs`.
- [x] Menambahkan migration perbaikan policy RLS audit log.
- [x] Memperbarui dokumentasi README + deployment untuk konfigurasi keamanan.
- [x] Memperbarui dokumentasi untuk menghapus referensi `ADMIN_PASSWORD` plaintext.
- [x] Menambahkan CI/CD quality gates (lint, test) sebelum deploy.
- [x] Menambahkan frontend health check di workflow deploy.
- [x] Menambahkan structured logging (JSON) di backend dengan request ID tracing.
- [x] Menambahkan loading boundary (`loading.tsx`) dan error boundary (`error.tsx`) di root dan admin.
- [x] Menambahkan accessibility improvements (`aria-live`, tab roles).
- [x] Error 500 di production tidak lagi leak detail stack trace ke client.
- [ ] Menambahkan observability sederhana (error-rate, rate-limit hit, auth failure) untuk operasi harian.

## Phase 9: Skalabilitas & Data Integrity (Sebagian Selesai)
- Status: In Progress
- Catatan: Migration database, unique slug, competition_id, dan index sudah diterapkan. Pagination dan populasi `reviewed_by` masih tersisa.

### Checklist Teknis Phase 9
- [ ] Pagination di endpoint `/competitions` dan `/submissions`.
- [x] Unique constraint `slug` di database + auto-suffix di backend.
- [x] Tambah kolom `competition_id` di `competition_submissions` untuk trace submission → kompetisi.
- [x] Fix kolom `reviewed_by` dari `uuid` ke `text` (karena aplikasi pakai custom auth, bukan Supabase Auth).
- [x] Tambah index `created_at`, `submitter_email`, dan `competition_id` di `competition_submissions`.
- [x] Migration formalisasi RLS `competitions` di repo.
- [ ] Populasi `reviewed_by` dengan email admin saat approve/reject submission (deferred — butuh perubahan alur frontend-backend).
