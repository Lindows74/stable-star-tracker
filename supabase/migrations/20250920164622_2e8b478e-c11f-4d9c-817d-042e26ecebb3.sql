-- Drop all RLS policies to remove restrictions for development
DROP POLICY IF EXISTS "Users can view all horses (including legacy data)" ON public.horses;
DROP POLICY IF EXISTS "Users can create horses" ON public.horses;
DROP POLICY IF EXISTS "Users can update their own horses" ON public.horses;
DROP POLICY IF EXISTS "Users can delete their own horses" ON public.horses;

DROP POLICY IF EXISTS "Users can view traits of their own horses" ON public.horse_traits;
DROP POLICY IF EXISTS "Users can create traits for their own horses" ON public.horse_traits;
DROP POLICY IF EXISTS "Users can update traits of their own horses" ON public.horse_traits;
DROP POLICY IF EXISTS "Users can delete traits of their own horses" ON public.horse_traits;
DROP POLICY IF EXISTS "Anyone can view horse traits" ON public.horse_traits;
DROP POLICY IF EXISTS "Anyone can insert horse traits" ON public.horse_traits;
DROP POLICY IF EXISTS "Anyone can update horse traits" ON public.horse_traits;
DROP POLICY IF EXISTS "Anyone can delete horse traits" ON public.horse_traits;

DROP POLICY IF EXISTS "Users can view distances of their own horses" ON public.horse_distances;
DROP POLICY IF EXISTS "Users can create distances for their own horses" ON public.horse_distances;
DROP POLICY IF EXISTS "Users can update distances of their own horses" ON public.horse_distances;
DROP POLICY IF EXISTS "Users can delete distances of their own horses" ON public.horse_distances;

DROP POLICY IF EXISTS "Users can view surfaces of their own horses" ON public.horse_surfaces;
DROP POLICY IF EXISTS "Users can create surfaces for their own horses" ON public.horse_surfaces;
DROP POLICY IF EXISTS "Users can update surfaces of their own horses" ON public.horse_surfaces;
DROP POLICY IF EXISTS "Users can delete surfaces of their own horses" ON public.horse_surfaces;

DROP POLICY IF EXISTS "Users can view positions of their own horses" ON public.horse_positions;
DROP POLICY IF EXISTS "Users can create positions for their own horses" ON public.horse_positions;
DROP POLICY IF EXISTS "Users can update positions of their own horses" ON public.horse_positions;
DROP POLICY IF EXISTS "Users can delete positions of their own horses" ON public.horse_positions;

DROP POLICY IF EXISTS "Users can view breeding of their own horses" ON public.horse_breeding;
DROP POLICY IF EXISTS "Users can create breeding for their own horses" ON public.horse_breeding;
DROP POLICY IF EXISTS "Users can update breeding of their own horses" ON public.horse_breeding;
DROP POLICY IF EXISTS "Users can delete breeding of their own horses" ON public.horse_breeding;

-- Create completely open policies for all tables
CREATE POLICY "Allow all access to horses" ON public.horses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to horse_traits" ON public.horse_traits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to horse_distances" ON public.horse_distances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to horse_surfaces" ON public.horse_surfaces FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to horse_positions" ON public.horse_positions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to horse_breeding" ON public.horse_breeding FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to horse_categories" ON public.horse_categories FOR ALL USING (true) WITH CHECK (true);