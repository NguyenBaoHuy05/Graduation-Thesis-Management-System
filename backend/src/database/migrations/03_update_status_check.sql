-- Drop the old constraint
ALTER TABLE public.thesis_registrations DROP CONSTRAINT IF EXISTS thesis_registrations_status_check;

-- Add the new constraint with expanded values including defense_registered
ALTER TABLE public.thesis_registrations
ADD CONSTRAINT thesis_registrations_status_check
CHECK (status IN (
  'registered', 
  'outline_pending',
  'outline_rejected',
  'outline_approved',
  'in_progress',
  'submitted', 
  'thesis_approved', 
  'thesis_rejected', 
  'defense_ready',
  'defense_registered',
  'defended',
  'completed'
));
