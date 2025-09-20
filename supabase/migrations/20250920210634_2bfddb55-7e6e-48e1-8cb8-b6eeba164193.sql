-- Fix Cross Country races to have distance 0 (no specific distance)
UPDATE live_races 
SET distance = '0' 
WHERE race_name LIKE '%Cross Country%' AND distance != '0';