-- Remove RLS policies to make it an open service as requested
ALTER TABLE public.horse_categories DISABLE ROW LEVEL SECURITY;

-- Drop all the restrictive policies on horse-related tables to make it open
DROP POLICY IF EXISTS "Users can view categories of their own horses" ON public.horse_categories;
DROP POLICY IF EXISTS "Users can create categories for their own horses" ON public.horse_categories;  
DROP POLICY IF EXISTS "Users can update categories of their own horses" ON public.horse_categories;
DROP POLICY IF EXISTS "Users can delete categories of their own horses" ON public.horse_categories;

-- Make horse_categories completely open
ALTER TABLE public.horse_categories DISABLE ROW LEVEL SECURITY;

-- Create open policies for horse_categories
CREATE POLICY "Anyone can view horse categories" ON public.horse_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can insert horse categories" ON public.horse_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update horse categories" ON public.horse_categories FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete horse categories" ON public.horse_categories FOR DELETE USING (true);