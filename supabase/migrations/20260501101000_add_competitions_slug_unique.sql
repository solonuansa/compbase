-- Unique constraint slug di competitions
-- Mencegah duplikat slug yang bisa merusak link detail kompetisi.

ALTER TABLE public.competitions
  ADD CONSTRAINT competitions_slug_unique UNIQUE (slug);
