-- Index performa untuk query kompetisi dan submission

-- Index untuk sorting submission by created_at DESC (listSubmissions)
CREATE INDEX idx_competition_submissions_created_at
  ON public.competition_submissions(created_at DESC);

-- Index untuk pencarian submission berdasarkan email submitter
CREATE INDEX idx_competition_submissions_submitter_email
  ON public.competition_submissions(submitter_email);

-- Index untuk lookup kompetisi berdasarkan slug (detail page)
CREATE INDEX idx_competitions_slug
  ON public.competitions(slug);
