-- Remove any tier restrictions from Cross Country races (they have none)
UPDATE live_races
SET tier_restriction = NULL
WHERE (distance = '0' OR race_name ILIKE '%cross country%')
  AND tier_restriction IS NOT NULL;