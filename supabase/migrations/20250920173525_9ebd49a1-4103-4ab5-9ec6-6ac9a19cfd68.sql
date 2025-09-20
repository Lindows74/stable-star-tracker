-- Fix Cross Country races - should be 2 races (very hard and very soft) with no distance restriction
-- First, update the existing Cross Country race
UPDATE public.live_races 
SET race_name = 'Cross Country Challenge I (Very Hard)',
    surface = 'very_hard',
    distance = '0',  -- Use 0 to indicate no distance restriction
    tier_restriction = null
WHERE race_name = 'Cross Country Challenge I';

-- Add the second Cross Country race (very soft)
INSERT INTO public.live_races (
  race_name,
  surface, 
  distance,
  start_time,
  track_name,
  prize_money,
  tier_restriction,
  is_active
) VALUES (
  'Cross Country Challenge II (Very Soft)',
  'very_soft',
  '0',  -- Use 0 to indicate no distance restriction
  '2026-03-28T15:30:00+00:00',
  'Cross Country Park',
  95000,
  null,
  true
);