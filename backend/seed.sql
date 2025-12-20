-- SEED DATA with Valid UUIDs
-- Users
-- Students (u1-u5)
INSERT INTO users (id, username, password, role) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SV001', '123', 'student'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'SV002', '123', 'student'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'SV003', '123', 'student'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'SV004', '123', 'student'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'SV005', '123', 'student'),
-- Teachers (u11-u15)
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'GV001', '123', 'teacher'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'GV002', '123', 'teacher'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13', 'GV003', '123', 'teacher'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14', 'GV004', '123', 'teacher'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15', 'GV005', '123', 'teacher'),
-- Head (u16)
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', 'HD001', '123', 'head'),
-- Secretary (u17)
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01', 'SC001', '123', 'secretary');

-- Students Profiles
INSERT INTO students (id, user_id, code, name, email, phone, class_name, major, gpa, credits_accumulated) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SV001', 'Nguyễn Minh Đức', 'duc.nm@student.edu.vn', '0934567890', 'CNTT-K17', 'Công nghệ thông tin', 3.5, 130),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'SV002', 'Phạm Thu Hà', 'ha.pt@student.edu.vn', '0945678901', 'CNTT-K17', 'Công nghệ thông tin', 3.2, 125),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'SV003', 'Trần Văn Nam', 'nam.tv@student.edu.vn', '0956789012', 'CNTT-K17', 'Công nghệ thông tin', 2.8, 110),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'SV004', 'Lê Thị Mai', 'mai.lt@student.edu.vn', '0967890123', 'CNTT-K17', 'Công nghệ thông tin', 3.6, 132),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'SV005', 'Hoàng Văn Long', 'long.hv@student.edu.vn', '0978901234', 'CNTT-K17', 'An ninh mạng', 3.0, 120);

-- Teachers Profiles
INSERT INTO teachers (id, user_id, code, name, email, phone, date_of_birth, gender, title, title_coefficient, max_theses, current_theses, specialization) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'GV001', 'TS. Nguyễn Văn An', 'nva@university.edu.vn', '0901234567', '1980-05-15', 'Nam', 'Tiến sĩ', 1.5, 9, 3, 'Trí tuệ nhân tạo'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'GV002', 'PGS.TS. Trần Thị Bình', 'ttb@university.edu.vn', '0912345678', '1975-08-20', 'Nữ', 'Phó giáo sư', 2.0, 12, 2, 'Phát triển phần mềm'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13', 'GV003', 'ThS. Lê Minh Cường', 'lmc@university.edu.vn', '0923456789', '1985-12-10', 'Nam', 'Thạc sĩ', 1.0, 6, 2, 'An ninh mạng'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14', 'GV004', 'TS. Phạm Văn Dũng', 'dung.pv@university.edu.vn', '0934567891', '1982-02-14', 'Nam', 'Tiến sĩ', 1.5, 8, 1, 'Khoa học dữ liệu'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b05', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15', 'GV005', 'ThS. Nguyễn Thị Mai', 'mai.nt@university.edu.vn', '0945678912', '1990-09-09', 'Nữ', 'Thạc sĩ', 1.0, 5, 0, 'Hệ thống thông tin');

-- Head Profiles
INSERT INTO heads (id, user_id, code, name, email, phone, date_of_birth, gender) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', 'HD001', 'Trần Văn Quang', 'quang.tv@university.edu.vn', '0976543210', '1970-11-05', 'Nam');

-- Secretary Profiles
INSERT INTO secretaries (id, user_id, code, name, email, phone, date_of_birth, gender) VALUES
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01', 'SC001', 'Nguyễn Thị Hương', 'huong.nt@university.edu.vn', '0987654321', '1988-03-22', 'Nữ');

-- Thesis Periods
INSERT INTO thesis_periods (id, name, academic_year, start_date, end_date, status, max_group_size, milestones) VALUES
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01', 'Kỳ 1 - Năm học 2025-2026', '2025-2026', '2025-08-01', '2026-01-15', 'active', 3, 
'[{"id": "m01", "name": "Đăng ký đề tài", "startDate": "2025-08-15", "endDate": "2025-08-30", "type": "registration"}, {"id": "m05", "name": "Bảo vệ trước hội đồng", "startDate": "2026-12-20", "endDate": "2026-12-25", "type": "defense"}]'::jsonb),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e02', 'Kỳ 2 - Năm học 2024-2025', '2024-2025', '2025-01-15', '2025-06-15', 'closed', 3, 
'[{"id": "m_old_03", "name": "Bảo vệ", "startDate": "2025-06-01", "endDate": "2025-06-10", "type": "defense"}]'::jsonb);

-- Topics
INSERT INTO topics (id, code, title, description, requirements, teacher_id, approver_id, specialization, status, max_students, current_students, period_id) VALUES
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380f01', 'DT001', 'Xây dựng hệ thống chatbot hỗ trợ tư vấn sử dụng AI', 'Nghiên cứu chatbot thông minh', 'Python, NLP', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', 'Trí tuệ nhân tạo', 'approved', 2, 2, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01'),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380f02', 'DT002', 'Ứng dụng quản lý bán hàng trực tuyến với React và Node.js', 'Xây dựng app bán hàng', 'React, Node', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', 'Phát triển phần mềm', 'approved', 3, 3, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01');

-- Councils
-- Note: Member IDs must match Teacher IDs above.
-- President: t1 (c0eebc99...b01)
-- Secretary: t5 (c0eebc99...b15)
-- Reviewer: t4 (c0eebc99...b14)
-- Members: t3 (c0eebc99...b13)
-- Topics: tp1 (10eebc99...f01)
INSERT INTO councils (
    id, name, 
    president_id, secretary_id, reviewer_id, commissioner_id, 
    member_ids, 
    period_id, 
    date, time, room, 
    topic_ids, 
    status, description
) VALUES (
    '20eebc99-9c0b-4ef8-bb6d-6bb9bd380g01', 
    'Hội đồng bảo vệ K17 - Đợt 1', 
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01', 
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15', 
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14', 
    NULL, -- commissioner_id
    '{"c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13"}', 
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01', 
    '2026-12-20', 
    '08:00', 
    'C.301', 
    '{"10eebc99-9c0b-4ef8-bb6d-6bb9bd380f01"}', 
    'published', 
    'Hội đồng bảo vệ đợt 1 - Khoa CNTT'
);
