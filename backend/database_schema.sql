-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. USERS & PROFILES
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'secretary', 'head')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    class_name TEXT,
    major TEXT,
    gpa NUMERIC(4, 2),
    credits_accumulated INT
);

CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('Nam', 'Nữ')),
    title TEXT,
    title_coefficient NUMERIC(3, 1),
    max_theses INT,
    current_theses INT DEFAULT 0,
    specialization TEXT
);

CREATE TABLE IF NOT EXISTS heads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT
);

CREATE TABLE IF NOT EXISTS secretaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT
);

-- ==========================================
-- 2. ACADEMIC & THESIS CORE
-- ==========================================

CREATE TABLE IF NOT EXISTS thesis_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('planning', 'active', 'closed')),
    max_group_size INT DEFAULT 3,
    milestones JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    requirements TEXT,
    study_references TEXT[],
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    approver_id UUID REFERENCES heads(id),
    specialization TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'assigned')),
    max_students INT DEFAULT 2,
    current_students INT DEFAULT 0,
    period_id UUID NOT NULL REFERENCES thesis_periods(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS councils (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    president_id UUID NOT NULL REFERENCES teachers(id),
    secretary_id UUID NOT NULL REFERENCES teachers(id),
    reviewer_id UUID NOT NULL REFERENCES teachers(id),
    commissioner_id UUID REFERENCES teachers(id),
    member_ids UUID[], -- Array of teacher IDs
    period_id UUID NOT NULL REFERENCES thesis_periods(id) ON DELETE CASCADE,
    date DATE,
    time TIME,
    room TEXT,
    topic_ids UUID[], -- Array of topic IDs
    status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'completed')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. REGISTRATION & PROCESS FLOW
-- ==========================================

CREATE TABLE IF NOT EXISTS thesis_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id),
    topic_id UUID NOT NULL REFERENCES topics(id),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    status TEXT NOT NULL CHECK (status IN ('registered', 'outline_pending', 'outline_rejected', 'outline_approved', 'in_progress', 'submitted', 'defense_ready', 'defended', 'completed')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    outline_submitted_at TIMESTAMP WITH TIME ZONE,
    outline_feedback TEXT,
    thesis_submitted_at TIMESTAMP WITH TIME ZONE,
    thesis_number TEXT,
    code_link TEXT,
    score NUMERIC(4, 2),
    outline_file_url TEXT,
    thesis_file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS defense_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id),
    registration_id UUID NOT NULL REFERENCES thesis_registrations(id) ON DELETE CASCADE,
    supervisor_approval BOOLEAN DEFAULT FALSE,
    secretary_approval BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    report_file_url TEXT,
    presentation_file_url TEXT
);

-- Timelines usually track milestones for a specific registration
CREATE TABLE IF NOT EXISTS timelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID NOT NULL REFERENCES thesis_registrations(id) ON DELETE CASCADE,
    milestone TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'overdue')),
    completed_at TIMESTAMP WITH TIME ZONE,
    feedback TEXT
);

CREATE TABLE IF NOT EXISTS plagiarism_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id),
    registration_id UUID NOT NULL REFERENCES thesis_registrations(id) ON DELETE CASCADE,
    similarity_percentage NUMERIC(5, 2),
    check_date DATE DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'passed', 'failed')),
    report_file TEXT,
    feedback TEXT
);

CREATE TABLE IF NOT EXISTS topic_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    student_id UUID NOT NULL REFERENCES students(id),
    topic_id UUID NOT NULL REFERENCES topics(id),
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    message TEXT
);

CREATE TABLE IF NOT EXISTS progress_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID NOT NULL REFERENCES thesis_registrations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    plan_next TEXT,
    file_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    feedback TEXT
);

-- ==========================================
-- 4. UTILITIES (NOTIFICATIONS, FORMS, COMPLAINTS)
-- ==========================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    type TEXT NOT NULL CHECK (type IN ('public', 'internal', 'info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES users(id), -- Specific user or NULL for public
    message TEXT
);

CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id),
    registration_id UUID REFERENCES thesis_registrations(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'reviewing', 'resolved', 'rejected')),
    response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS form_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    upload_date DATE DEFAULT CURRENT_DATE,
    type TEXT NOT NULL CHECK (type IN ('outline', 'thesis', 'report', 'defense_request', 'other'))
);
