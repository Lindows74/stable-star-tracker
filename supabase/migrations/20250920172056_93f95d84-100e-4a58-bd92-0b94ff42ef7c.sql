-- Add tier restriction column to live_races table
ALTER TABLE public.live_races 
ADD COLUMN tier_restriction TEXT CHECK (tier_restriction IN ('odd_grades', 'even_grades'));