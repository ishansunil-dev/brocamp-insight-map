-- Update the authentication function to check for role as well
CREATE OR REPLACE FUNCTION public.authenticate_with_student_id(
  _student_id text,
  _password text,
  _role app_role
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  _user_id uuid;
  _email text;
  _result json;
BEGIN
  -- Find user by student_id (which now stores the user ID)
  SELECT id INTO _user_id
  FROM public.profiles
  WHERE student_id = _student_id;
  
  IF _user_id IS NULL THEN
    RETURN json_build_object('error', 'Invalid ID or password');
  END IF;
  
  -- Check if user has the selected role
  IF NOT has_role(_user_id, _role) THEN
    RETURN json_build_object('error', 'You do not have access as ' || _role);
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