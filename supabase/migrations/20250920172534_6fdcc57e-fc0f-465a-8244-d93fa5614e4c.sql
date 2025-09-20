-- Update existing races with proper tier restrictions based on the official race list
UPDATE public.live_races 
SET tier_restriction = 'odd_grades' 
WHERE distance = '800' AND surface = 'very_soft';

UPDATE public.live_races 
SET tier_restriction = 'even_grades' 
WHERE distance = '900' AND surface = 'firm';

UPDATE public.live_races 
SET tier_restriction = 'odd_grades' 
WHERE distance = '1000' AND surface = 'hard';

UPDATE public.live_races 
SET tier_restriction = 'odd_grades' 
WHERE distance = '1200' AND surface = 'medium';

UPDATE public.live_races 
SET tier_restriction = 'even_grades' 
WHERE distance = '1200' AND surface = 'very_soft';

UPDATE public.live_races 
SET tier_restriction = 'odd_grades' 
WHERE distance = '1400' AND surface = 'medium';

UPDATE public.live_races 
SET tier_restriction = 'odd_grades' 
WHERE distance = '1600' AND surface = 'firm';

UPDATE public.live_races 
SET tier_restriction = 'even_grades' 
WHERE distance = '1600' AND surface = 'hard';

UPDATE public.live_races 
SET tier_restriction = 'odd_grades' 
WHERE distance = '1600' AND surface = 'very_hard';

UPDATE public.live_races 
SET tier_restriction = 'odd_grades' 
WHERE distance = '1800' AND surface = 'very_hard';

UPDATE public.live_races 
SET tier_restriction = 'even_grades' 
WHERE distance = '2000' AND surface = 'hard';

UPDATE public.live_races 
SET tier_restriction = 'even_grades' 
WHERE distance = '2000' AND surface = 'soft';

UPDATE public.live_races 
SET tier_restriction = 'odd_grades' 
WHERE distance = '2400' AND surface = 'firm';

UPDATE public.live_races 
SET tier_restriction = 'odd_grades' 
WHERE distance = '2800' AND surface = 'very_hard';

UPDATE public.live_races 
SET tier_restriction = 'even_grades' 
WHERE distance = '3000' AND surface = 'hard';

UPDATE public.live_races 
SET tier_restriction = 'even_grades' 
WHERE distance = '3200' AND surface = 'soft';

UPDATE public.live_races 
SET tier_restriction = 'odd_grades' 
WHERE distance = '3200' AND surface = 'very_hard';

-- Update steeplechase races
UPDATE public.live_races 
SET tier_restriction = 'odd_grades' 
WHERE distance = '900' AND surface = 'very_hard' AND race_name LIKE '%Steeplechase%';

UPDATE public.live_races 
SET tier_restriction = 'even_grades' 
WHERE distance = '1400' AND surface = 'firm' AND race_name LIKE '%Steeplechase%';