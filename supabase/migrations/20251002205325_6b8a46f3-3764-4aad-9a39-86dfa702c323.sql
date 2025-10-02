-- Update all instances of "Crystal Gift" to "Crystal Coat" in horse_traits table
UPDATE horse_traits 
SET trait_name = 'Crystal Coat' 
WHERE trait_name = 'Crystal Gift';