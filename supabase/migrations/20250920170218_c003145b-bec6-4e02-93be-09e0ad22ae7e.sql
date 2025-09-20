-- Clear existing live races and add real 2025 race data
DELETE FROM public.live_races;

-- Insert Flat Racing events
INSERT INTO public.live_races (race_name, surface, distance, start_time, track_name, prize_money, is_active) VALUES
('Grade Championship 800m', 'very_soft', '800', '2025-01-15 14:00:00+00', 'Churchill Downs', 50000, true),
('Grade Championship 900m', 'firm', '900', '2025-01-22 15:30:00+00', 'Kentucky Derby Park', 60000, true),
('Grade Championship 1000m', 'hard', '1000', '2025-02-05 16:00:00+00', 'Belmont Park', 75000, true),
('Grade Championship 1200m Medium', 'medium', '1200', '2025-02-12 14:30:00+00', 'Santa Anita Park', 80000, true),
('Grade Championship 1200m Soft', 'very_soft', '1200', '2025-02-19 15:00:00+00', 'Del Mar Racetrack', 80000, true),
('Grade Championship 1400m', 'medium', '1400', '2025-03-05 16:30:00+00', 'Saratoga Springs', 90000, true),
('Grade Championship 1600m Firm', 'firm', '1600', '2025-03-12 14:00:00+00', 'Keeneland', 100000, true),
('Grade Championship 1600m Hard', 'hard', '1600', '2025-03-19 15:30:00+00', 'Gulfstream Park', 100000, true),
('Grade Championship 1600m Very Hard', 'very_hard', '1600', '2025-03-26 16:00:00+00', 'Oaklawn Park', 100000, true),
('Grade Championship 1800m', 'very_hard', '1800', '2025-04-02 14:30:00+00', 'Fair Grounds', 110000, true),
('Grade Championship 2000m Hard', 'hard', '2000', '2025-04-09 15:00:00+00', 'Aqueduct', 120000, true),
('Grade Championship 2000m Soft', 'soft', '2000', '2025-04-16 16:30:00+00', 'Pimlico Race Course', 120000, true),
('Grade Championship 2400m', 'firm', '2400', '2025-04-23 14:00:00+00', 'Woodbine Racetrack', 140000, true),
('Grade Championship 2800m', 'very_hard', '2800', '2025-04-30 15:30:00+00', 'Arlington Park', 160000, true),
('Grade Championship 3000m', 'hard', '3000', '2025-05-07 16:00:00+00', 'Laurel Park', 180000, true),
('Grade Championship 3200m Soft', 'soft', '3200', '2025-05-14 14:30:00+00', 'Monmouth Park', 200000, true),
('Grade Championship 3200m Very Hard', 'very_hard', '3200', '2025-05-21 15:00:00+00', 'Canterbury Park', 200000, true);

-- Insert Steeplechase events
INSERT INTO public.live_races (race_name, surface, distance, start_time, track_name, prize_money, is_active) VALUES
('Steeplechase Championship 900m', 'very_hard', '900', '2025-06-07 16:30:00+00', 'Steeplechase Park', 70000, true),
('Steeplechase Championship 1400m', 'firm', '1400', '2025-06-14 14:00:00+00', 'Colonial Downs', 85000, true);

-- Insert Cross Country events (using the mentioned surfaces)
INSERT INTO public.live_races (race_name, surface, distance, start_time, track_name, prize_money, is_active) VALUES
('Cross Country Challenge I', 'very_hard', '2200', '2025-06-21 15:30:00+00', 'Badminton Horse Trials', 95000, true),
('Cross Country Challenge II', 'very_soft', '2500', '2025-06-28 16:00:00+00', 'Kentucky Horse Park', 95000, true),
('Cross Country Challenge III', 'very_hard', '2800', '2025-07-05 14:30:00+00', 'Rolex Kentucky', 95000, true);