-- RLS formalisasi competitions
-- Memastikan repo dan semua environment (local, staging, production) konsisten.

ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

-- Policy: public boleh read (data kompetisi bersifat publik)
CREATE POLICY "Public read competitions"
  ON public.competitions
  FOR SELECT
  TO public
  USING (true);

-- Policy: service_role boleh semua operasi (backend Node.js pakai service role key)
CREATE POLICY "Service role full access competitions"
  ON public.competitions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
