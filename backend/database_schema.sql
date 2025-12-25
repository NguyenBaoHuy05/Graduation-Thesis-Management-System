-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.complaints (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL,
  registration_id uuid,
  title text NOT NULL,
  description text,
  status text NOT NULL CHECK (status = ANY (ARRAY['pending'::text, 'reviewing'::text, 'resolved'::text, 'rejected'::text])),
  response text,
  created_at timestamp with time zone DEFAULT now(),
  resolved_at timestamp with time zone,
  CONSTRAINT complaints_pkey PRIMARY KEY (id),
  CONSTRAINT complaints_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT complaints_registration_id_fkey FOREIGN KEY (registration_id) REFERENCES public.thesis_registrations(id)
);
CREATE TABLE public.councils (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  president_id uuid NOT NULL,
  secretary_id uuid NOT NULL,
  reviewer_id uuid NOT NULL,
  commissioner_id uuid,
  member_ids ARRAY,
  period_id uuid NOT NULL,
  date date,
  time time without time zone,
  room text,
  topic_ids ARRAY,
  status text NOT NULL CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'completed'::text])),
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT councils_pkey PRIMARY KEY (id),
  CONSTRAINT councils_president_id_fkey FOREIGN KEY (president_id) REFERENCES public.teachers(id),
  CONSTRAINT councils_secretary_id_fkey FOREIGN KEY (secretary_id) REFERENCES public.teachers(id),
  CONSTRAINT councils_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.teachers(id),
  CONSTRAINT councils_commissioner_id_fkey FOREIGN KEY (commissioner_id) REFERENCES public.teachers(id),
  CONSTRAINT councils_period_id_fkey FOREIGN KEY (period_id) REFERENCES public.thesis_periods(id)
);
CREATE TABLE public.defense_registrations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL,
  registration_id uuid NOT NULL,
  supervisor_approval boolean DEFAULT false,
  secretary_approval boolean DEFAULT false,
  status text NOT NULL CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  submitted_at timestamp with time zone DEFAULT now(),
  report_file_url text,
  presentation_file_url text,
  CONSTRAINT defense_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT defense_registrations_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT defense_registrations_registration_id_fkey FOREIGN KEY (registration_id) REFERENCES public.thesis_registrations(id)
);
CREATE TABLE public.form_templates (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  file_url text NOT NULL,
  upload_date date DEFAULT CURRENT_DATE,
  type text NOT NULL CHECK (type = ANY (ARRAY['outline'::text, 'thesis'::text, 'report'::text, 'defense_request'::text, 'other'::text])),
  CONSTRAINT form_templates_pkey PRIMARY KEY (id)
);
CREATE TABLE public.heads (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  date_of_birth date,
  gender text,
  CONSTRAINT heads_pkey PRIMARY KEY (id),
  CONSTRAINT heads_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  content text,
  date timestamp with time zone DEFAULT now(),
  type text NOT NULL CHECK (type = ANY (ARRAY['public'::text, 'internal'::text, 'info'::text, 'success'::text, 'warning'::text, 'error'::text])),
  is_read boolean DEFAULT false,
  user_id uuid,
  message text,
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.plagiarism_checks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL,
  registration_id uuid NOT NULL,
  similarity_percentage numeric,
  check_date date DEFAULT CURRENT_DATE,
  status text NOT NULL CHECK (status = ANY (ARRAY['pending'::text, 'passed'::text, 'failed'::text])),
  report_file text,
  feedback text,
  CONSTRAINT plagiarism_checks_pkey PRIMARY KEY (id),
  CONSTRAINT plagiarism_checks_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT plagiarism_checks_registration_id_fkey FOREIGN KEY (registration_id) REFERENCES public.thesis_registrations(id)
);
CREATE TABLE public.progress_reports (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  registration_id uuid NOT NULL,
  title text NOT NULL,
  content text,
  plan_next text,
  file_url text,
  submitted_at timestamp with time zone DEFAULT now(),
  status text NOT NULL CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  feedback text,
  CONSTRAINT progress_reports_pkey PRIMARY KEY (id),
  CONSTRAINT progress_reports_registration_id_fkey FOREIGN KEY (registration_id) REFERENCES public.thesis_registrations(id)
);
CREATE TABLE public.secretaries (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  date_of_birth date,
  gender text,
  CONSTRAINT secretaries_pkey PRIMARY KEY (id),
  CONSTRAINT secretaries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.students (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  class_name text,
  major text,
  gpa numeric,
  credits_accumulated integer,
  CONSTRAINT students_pkey PRIMARY KEY (id),
  CONSTRAINT students_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.teachers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  date_of_birth date,
  gender text CHECK (gender = ANY (ARRAY['Nam'::text, 'Nữ'::text])),
  title text,
  title_coefficient numeric,
  max_theses integer,
  current_theses integer DEFAULT 0,
  specialization text,
  CONSTRAINT teachers_pkey PRIMARY KEY (id),
  CONSTRAINT teachers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.thesis_periods (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  academic_year text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['planning'::text, 'active'::text, 'closed'::text])),
  max_group_size integer DEFAULT 3,
  milestones jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT thesis_periods_pkey PRIMARY KEY (id)
);
CREATE TABLE public.thesis_registrations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL,
  topic_id uuid NOT NULL,
  teacher_id uuid NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['registered'::text, 'thesis_rejected'::text, 'defense_registered'::text, 'outline_pending'::text, 'outline_rejected'::text, 'outline_approved'::text, 'in_progress'::text, 'submitted'::text, 'defense_ready'::text, 'defended'::text, 'completed'::text])),
  registered_at timestamp with time zone DEFAULT now(),
  outline_submitted_at timestamp with time zone,
  outline_feedback text,
  thesis_submitted_at timestamp with time zone,
  thesis_number text,
  code_link text,
  score numeric,
  outline_file_url text,
  thesis_file_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT thesis_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT thesis_registrations_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT thesis_registrations_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id),
  CONSTRAINT thesis_registrations_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id)
);
CREATE TABLE public.timelines (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  registration_id uuid NOT NULL,
  milestone text NOT NULL,
  description text,
  due_date date,
  status text NOT NULL CHECK (status = ANY (ARRAY['pending'::text, 'completed'::text, 'overdue'::text])),
  completed_at timestamp with time zone,
  feedback text,
  CONSTRAINT timelines_pkey PRIMARY KEY (id),
  CONSTRAINT timelines_registration_id_fkey FOREIGN KEY (registration_id) REFERENCES public.thesis_registrations(id)
);
CREATE TABLE public.topic_invitations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  teacher_id uuid NOT NULL,
  student_id uuid NOT NULL,
  topic_id uuid NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text])),
  sent_at timestamp with time zone DEFAULT now(),
  responded_at timestamp with time zone,
  message text,
  CONSTRAINT topic_invitations_pkey PRIMARY KEY (id),
  CONSTRAINT topic_invitations_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id),
  CONSTRAINT topic_invitations_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT topic_invitations_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id)
);
CREATE TABLE public.topics (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  code text UNIQUE,
  title text NOT NULL,
  description text,
  requirements text,
  study_references ARRAY,
  teacher_id uuid NOT NULL,
  approver_id uuid,
  specialization text,
  status text NOT NULL CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'assigned'::text])),
  max_students integer DEFAULT 2,
  current_students integer DEFAULT 0,
  period_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT topics_pkey PRIMARY KEY (id),
  CONSTRAINT topics_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id),
  CONSTRAINT topics_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES public.heads(id),
  CONSTRAINT topics_period_id_fkey FOREIGN KEY (period_id) REFERENCES public.thesis_periods(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['student'::text, 'teacher'::text, 'secretary'::text, 'head'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);