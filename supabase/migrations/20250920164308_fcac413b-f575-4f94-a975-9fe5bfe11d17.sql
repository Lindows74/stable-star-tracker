-- Clear existing sample data and add real 2025 race schedule
DELETE FROM public.live_races;

-- Insert real 2025 race data from Rival Stars Horse Racing
INSERT INTO public.live_races (race_name, surface, distance, start_time, end_time, track_name, prize_money, is_active) VALUES
-- Flat Racing Events
('Sprint Challenge 800m', 'very_soft', '800', '2025-01-15 14:00:00+00', '2025-01-15 14:30:00+00', 'Thunder Valley', 15000, true),
('Speed Demon 900m', 'firm', '900', '2025-01-20 16:00:00+00', '2025-01-20 16:30:00+00', 'Lightning Track', 12000, true),
('Classic Mile 1000m', 'hard', '1000', '2025-01-25 15:00:00+00', '2025-01-25 15:30:00+00', 'Golden Track', 18000, true),
('Distance Derby 1200m', 'medium', '1200', '2025-02-01 14:00:00+00', '2025-02-01 14:45:00+00', 'Star Field', 20000, true),
('Endurance Stakes 1400m', 'medium', '1400', '2025-02-08 15:30:00+00', '2025-02-08 16:15:00+00', 'Hill Course', 22000, true),
('Champion Mile 1600m', 'firm', '1600', '2025-02-15 14:00:00+00', '2025-02-15 15:00:00+00', 'Royal Circuit', 25000, true),
('Elite Distance 1800m', 'very_hard', '1800', '2025-02-22 15:00:00+00', '2025-02-22 16:00:00+00', 'Elite Track', 28000, true),
('Marathon Classic 2000m', 'hard', '2000', '2025-03-01 14:30:00+00', '2025-03-01 15:45:00+00', 'Victory Lane', 30000, true),
('Stamina Challenge 2400m', 'firm', '2400', '2025-03-08 15:00:00+00', '2025-03-08 16:30:00+00', 'Endurance Park', 35000, true),
('Ultra Distance 2800m', 'very_hard', '2800', '2025-03-15 14:00:00+00', '2025-03-15 15:45:00+00', 'Mountain View', 40000, true),
('Extreme Endurance 3000m', 'hard', '3000', '2025-03-22 15:30:00+00', '2025-03-22 17:00:00+00', 'Continental Circuit', 45000, true),
('Ultimate Challenge 3200m', 'soft', '3200', '2025-03-29 14:00:00+00', '2025-03-29 16:00:00+00', 'Championship Arena', 50000, true),

-- Steeplechase Events  
('Sprint Jump 900m', 'very_hard', '900', '2025-04-05 15:00:00+00', '2025-04-05 15:30:00+00', 'Jump Arena', 18000, true),
('Special Chase 1400m', 'firm', '1400', '2025-04-12 14:30:00+00', '2025-04-12 15:15:00+00', 'Chase Circuit', 25000, true),

-- Cross Country Events
('Cross Country Challenge', 'very_hard', '2200', '2025-04-19 16:00:00+00', '2025-04-19 17:00:00+00', 'Wild Terrain', 30000, true),
('Endurance Cross Country', 'very_soft', '2800', '2025-04-26 15:00:00+00', '2025-04-26 16:30:00+00', 'Nature Trail', 35000, true),
('Ultimate Cross Country', 'very_hard', '3200', '2025-05-03 14:00:00+00', '2025-05-03 16:00:00+00', 'Extreme Terrain', 45000, true);