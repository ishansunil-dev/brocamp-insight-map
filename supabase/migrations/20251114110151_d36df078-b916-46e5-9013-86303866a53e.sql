-- Create complaints table
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  reference_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  anonymous BOOLEAN NOT NULL DEFAULT false,
  attachment_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- RLS Policies for complaints
CREATE POLICY "Users can view their own complaints"
ON public.complaints FOR SELECT
USING (auth.uid() = user_id OR NOT anonymous);

CREATE POLICY "Admins can view all complaints"
ON public.complaints FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create complaints"
ON public.complaints FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update complaints"
ON public.complaints FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create complaint_comments table
CREATE TABLE IF NOT EXISTS public.complaint_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  comment TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.complaint_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comments
CREATE POLICY "Users can view comments on their complaints"
ON public.complaint_comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.complaints
    WHERE complaints.id = complaint_comments.complaint_id
    AND (complaints.user_id = auth.uid() OR NOT complaints.anonymous)
  )
);

CREATE POLICY "Admins can view all comments"
ON public.complaint_comments FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can add comments to their complaints"
ON public.complaint_comments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.complaints
    WHERE complaints.id = complaint_comments.complaint_id
    AND complaints.user_id = auth.uid()
  ) AND user_id = auth.uid()
);

CREATE POLICY "Admins can add comments to any complaint"
ON public.complaint_comments FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND user_id = auth.uid());

-- Create call_requests table
CREATE TABLE IF NOT EXISTS public.call_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE UNIQUE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  preferred_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  admin_notes TEXT,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.call_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for call_requests
CREATE POLICY "Users can view their own call requests"
ON public.call_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all call requests"
ON public.call_requests FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create call requests for their complaints"
ON public.call_requests FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.complaints
    WHERE complaints.id = call_requests.complaint_id
    AND complaints.user_id = auth.uid()
  ) AND user_id = auth.uid()
);

CREATE POLICY "Users can update their pending call requests"
ON public.call_requests FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can update any call request"
ON public.call_requests FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for complaint attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'complaint-attachments',
  'complaint-attachments',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for complaint attachments
CREATE POLICY "Users can upload their own attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'complaint-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'complaint-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'complaint-attachments' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Create function to generate reference ID
CREATE OR REPLACE FUNCTION generate_reference_id()
RETURNS TEXT AS $$
BEGIN
  RETURN 'CMP-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate reference_id
CREATE OR REPLACE FUNCTION set_reference_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_id IS NULL OR NEW.reference_id = '' THEN
    NEW.reference_id := generate_reference_id();
    WHILE EXISTS (SELECT 1 FROM public.complaints WHERE reference_id = NEW.reference_id) LOOP
      NEW.reference_id := generate_reference_id();
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_reference_id
BEFORE INSERT ON public.complaints
FOR EACH ROW
EXECUTE FUNCTION set_reference_id();

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_complaints_updated_at
BEFORE UPDATE ON public.complaints
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_call_requests_updated_at
BEFORE UPDATE ON public.call_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();