-- Add student_id to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS student_id text UNIQUE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON public.profiles(student_id);

-- Create function to authenticate with student_id
CREATE OR REPLACE FUNCTION public.authenticate_with_student_id(
  _student_id text,
  _password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
  _email text;
  _result json;
BEGIN
  -- Find user by student_id
  SELECT id INTO _user_id
  FROM public.profiles
  WHERE student_id = _student_id;
  
  IF _user_id IS NULL THEN
    RETURN json_build_object('error', 'Invalid student ID or password');
  END IF;
  
  -- Get email from auth.users
  SELECT email INTO _email
  FROM auth.users
  WHERE id = _user_id;
  
  IF _email IS NULL THEN
    RETURN json_build_object('error', 'User not found');
  END IF;
  
  RETURN json_build_object('email', _email);
END;
$$;