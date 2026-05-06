-- Fix reviewed_by dari uuid ke text
-- Aplikasi menggunakan custom auth (email string), bukan Supabase Auth (uuid).
-- Hapus FK constraint ke auth.users terlebih dahulu karena tipe tidak kompatibel.

ALTER TABLE public.competition_submissions
  DROP CONSTRAINT IF EXISTS competition_submissions_reviewed_by_fkey;

ALTER TABLE public.competition_submissions
  ALTER COLUMN reviewed_by TYPE TEXT;
