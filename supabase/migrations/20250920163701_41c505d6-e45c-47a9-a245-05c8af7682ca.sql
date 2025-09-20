-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create live_races table to store race schedule information
CREATE TABLE public.live_races (
  id SERIAL PRIMARY KEY,
  race_name TEXT NOT NULL,
  surface TEXT NOT NULL,
  distance TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  track_name TEXT,
  prize_money INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on live_races
ALTER TABLE public.live_races ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing live races (public data)
CREATE POLICY "Anyone can view live races" 
ON public.live_races 
FOR SELECT 
USING (true);

-- Create index for better performance on active races
CREATE INDEX idx_live_races_active ON public.live_races (is_active, start_time) WHERE is_active = true;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_live_races_updated_at
BEFORE UPDATE ON public.live_races
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample live race data
INSERT INTO public.live_races (race_name, surface, distance, start_time, end_time, track_name, prize_money) VALUES
('Sprint Championship', 'turf', 'short', now() + interval '2 hours', now() + interval '2 hours 30 minutes', 'Golden Track', 10000),
('Distance Classic', 'dirt', 'long', now() + interval '4 hours', now() + interval '4 hours 45 minutes', 'Thunder Valley', 15000),
('Middle Distance Stakes', 'synthetic', 'medium', now() + interval '6 hours', now() + interval '6 hours 30 minutes', 'Star Field', 12000),
('Cross Country Challenge', 'turf', 'long', now() + interval '8 hours', now() + interval '9 hours', 'Hill Course', 20000),
('Speed Demon Sprint', 'dirt', 'short', now() + interval '1 day', now() + interval '1 day 30 minutes', 'Lightning Track', 8000);