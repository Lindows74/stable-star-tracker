
-- Enable Row Level Security on the horses table
ALTER TABLE public.horses ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to view all horses
CREATE POLICY "Users can view all horses" 
  ON public.horses 
  FOR SELECT 
  USING (true);

-- Create a policy that allows users to insert horses (with their user_id)
CREATE POLICY "Users can create horses" 
  ON public.horses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create a policy that allows users to update horses they own
CREATE POLICY "Users can update their own horses" 
  ON public.horses 
  FOR UPDATE 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Create a policy that allows users to delete horses they own
CREATE POLICY "Users can delete their own horses" 
  ON public.horses 
  FOR DELETE 
  USING (auth.uid() = user_id OR user_id IS NULL);
