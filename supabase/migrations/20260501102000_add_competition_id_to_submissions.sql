-- Tambah kolom competition_id ke competition_submissions
-- Menyimpan ID kompetisi hasil approve untuk trace submission -> kompetisi.
-- Tanpa FK constraint agar submission tetap ada meski competition dihapus (audit trail).

ALTER TABLE public.competition_submissions
  ADD COLUMN competition_id TEXT;

-- Index untuk query cepat berdasarkan competition_id
CREATE INDEX idx_competition_submissions_competition_id
  ON public.competition_submissions(competition_id);
