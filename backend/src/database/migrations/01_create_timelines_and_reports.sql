-- Create progress_reports table if not exists (check logic handled by user context, blindly creating here)
CREATE TABLE IF NOT EXISTS public.progress_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    registration_id UUID NOT NULL REFERENCES public.thesis_registrations(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    plan_next TEXT NOT NULL,
    file_url TEXT,
    submitted_at TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create timelines table
CREATE TABLE IF NOT EXISTS public.timelines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    registration_id UUID NOT NULL REFERENCES public.thesis_registrations(id),
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    completed_at DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Optional, depending on policy needs)
ALTER TABLE public.progress_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timelines ENABLE ROW LEVEL SECURITY;

-- Add policies (Simplified for development: public access)
-- Ideally should restrict by user role
CREATE POLICY "Enable all access for all users" ON public.progress_reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON public.timelines FOR ALL USING (true) WITH CHECK (true);
