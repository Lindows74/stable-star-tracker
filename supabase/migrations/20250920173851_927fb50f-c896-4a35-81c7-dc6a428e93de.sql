-- Add the missing 1100m steeplechase race (under repair)
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
  'Steeplechase Championship 1100m (Under Repair)',
  'very_hard',
  '1100',
  '2026-03-10T15:00:00+00:00',
  'Steeplechase Park',
  75000,
  'even_grades',
  false  -- Set to inactive since it's under repair
);