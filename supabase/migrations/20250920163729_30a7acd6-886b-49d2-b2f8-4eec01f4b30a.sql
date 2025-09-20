-- Enable RLS on all tables that have policies but RLS is disabled
ALTER TABLE public.horse_surfaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horse_breeding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horse_distances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horse_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horse_traits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horse_categories ENABLE ROW LEVEL SECURITY;