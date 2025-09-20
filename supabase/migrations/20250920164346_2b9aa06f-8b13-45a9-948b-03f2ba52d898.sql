-- Update RLS policy to allow viewing all horses for development
DROP POLICY IF EXISTS "Users can view all horses" ON public.horses;

CREATE POLICY "Users can view all horses (including legacy data)" 
ON public.horses 
FOR SELECT 
USING (true);

-- Also update the breeding suggestions edge function to handle null user_id
-- Make the function accessible without strict authentication for development
UPDATE supabase.functions 
SET verify_jwt = false 
WHERE name = 'breeding-suggestions';