
-- Add gender column to horses table
ALTER TABLE public.horses 
ADD COLUMN gender TEXT CHECK (gender IN ('stallion', 'mare'));
