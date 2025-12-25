-- =================================================================================================
-- FULL SEED DATA FOR GRADUATION THESIS MANAGEMENT SYSTEM
-- =================================================================================================

-- 1. USERS
-- Password for all is '123' (hash handled by app logic or assumes plain for dev/testing if auth allows)
-- Students (5)
INSERT INTO users (id, username, password, role) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SV001', '123', 'student'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'SV002', '123', 'student'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'SV003', '123', 'student'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'SV004', '123', 'student'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'SV005', '123', 'student');

-- Teachers (5)
INSERT INTO users (id, username, password, role) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'GV001', '123', 'teacher'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'GV002', '123', 'teacher'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13', 'GV003', '123', 'teacher'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14', 'GV004', '123', 'teacher'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15', 'GV005', '123', 'teacher');

-- Heads (1)
INSERT INTO users (id, username, password, role) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', 'HD001', '123', 'head');

-- Secretaries (1)
INSERT INTO users (id, username, password, role) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01', 'SC001', '123', 'secretary');


-- 2. PROFILES
-- Students
INSERT INTO students (id, user_id, code, name, email, phone, class_name, major, gpa, credits_accumulated) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SV001', 'Nguyễn Minh Đức', 'duc.nm@student.edu.vn', '0901000001', 'CNTT-K17', 'Công nghệ thông tin', 3.5, 130),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'SV002', 'Phạm Thu Hà', 'ha.pt@student.edu.vn', '0901000002', 'CNTT-K17', 'Công nghệ thông tin', 3.2, 125),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'SV003', 'Trần Văn Nam', 'nam.tv@student.edu.vn', '0901000003', 'CNTT-K17', 'An ninh mạng', 2.8, 110),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'SV004', 'Lê Thị Mai', 'mai.lt@student.edu.vn', '0901000004', 'CNTT-K17', 'Hệ thống thông tin', 3.6, 135),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'SV005', 'Hoàng Văn Long', 'long.hv@student.edu.vn', '0901000005', 'CNTT-K17', 'Khoa học dữ liệu', 3.0, 118);

-- Teachers
INSERT INTO teachers (id, user_id, code, name, email, phone, date_of_birth, gender, title, title_coefficient, max_theses, current_theses, specialization) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'GV001', 'TS. Nguyễn Văn An', 'an.nv@edu.vn', '0911000001', '1980-01-01', 'Nam', 'Tiến sĩ', 1.5, 9, 3, 'Trí tuệ nhân tạo'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'GV002', 'PGS.TS. Trần Thị Bình', 'binh.tt@edu.vn', '0911000002', '1975-02-02', 'Nữ', 'Phó giáo sư', 2.0, 12, 1, 'Phát triển phần mềm'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13', 'GV003', 'ThS. Lê Minh Cường', 'cuong.lm@edu.vn', '0911000003', '1985-03-03', 'Nam', 'Thạc sĩ', 1.0, 6, 2, 'An ninh mạng'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14', 'GV004', 'TS. Phạm Văn Dũng', 'dung.pv@edu.vn', '0911000004', '1982-04-04', 'Nam', 'Tiến sĩ', 1.5, 8, 4, 'Khoa học dữ liệu'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b05', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15', 'GV005', 'ThS. Nguyễn Thị Mai', 'mai.nt@edu.vn', '0911000005', '1990-05-05', 'Nữ', 'Thạc sĩ', 1.0, 5, 0, 'Hệ thống thông tin');

-- Head
INSERT INTO heads (id, user_id, code, name, email, phone, gender) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', 'HD001', 'Trần Văn Quang', 'quang.tv@edu.vn', '0922000001', 'Nam');

-- Secretary
INSERT INTO secretaries (id, user_id, code, name, email, phone, gender) VALUES
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01', 'SC001', 'Nguyễn Thị Hương', 'huong.nt@edu.vn', '0933000001', 'Nữ');


-- 3. THESIS PERIODS (Active & Closed)
INSERT INTO thesis_periods (id, name, academic_year, start_date, end_date, status, max_group_size, milestones) VALUES
-- Active Period (e.g., Current Semester)
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01', 'Kỳ 1 - Năm học 2025-2026', '2025-2026', '2025-08-01', '2026-01-30', 'active', 3, 
'[
    {"id": "m1", "name": "Đăng ký đề tài", "type": "registration", "startDate": "2025-08-15", "endDate": "2025-09-15"},
    {"id": "m2", "name": "Nộp đề cương", "type": "outline", "startDate": "2025-09-20", "endDate": "2025-10-05"},
    {"id": "m3", "name": "Nộp khóa luận", "type": "submission", "startDate": "2025-12-01", "endDate": "2025-12-31"},
    {"id": "m4", "name": "Đăng ký bảo vệ", "type": "defense_registration", "startDate": "2026-01-01", "endDate": "2026-01-10"},
    {"id": "m5", "name": "Bảo vệ trước hội đồng", "type": "defense", "startDate": "2026-01-15", "endDate": "2026-01-25"}
]'::jsonb),

-- Past Period (Closed)
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e02', 'Kỳ 2 - Năm học 2024-2025', '2024-2025', '2025-01-15', '2025-06-15', 'closed', 3, 
'[
    {"id": "m_old_1", "name": "Bảo vệ", "type": "defense", "startDate": "2025-06-01", "endDate": "2025-06-10"}
]'::jsonb);


-- 4. TOPICS (In Active Period)
-- T1 (AI - GV001) - Approved, 2/2 full
INSERT INTO topics (id, code, title, description, requirements, teacher_id, approver_id, specialization, status, max_students, current_students, period_id) VALUES
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380f01', 'DT001', 'Xây dựng Chatbot AI tư vấn tuyển sinh', 'Nghiên cứu mô hình ngôn ngữ lớn (LLM)', 'Python, Deep Learning', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', 'Trí tuệ nhân tạo', 'approved', 2, 2, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01');

-- T2 (App - GV002) - Approved, 1/3
INSERT INTO topics (id, code, title, description, requirements, teacher_id, approver_id, specialization, status, max_students, current_students, period_id) VALUES
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380f02', 'DT002', 'Hệ thống E-learning Platform', 'Web App với React & NestJS', 'React, Node.js', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', 'Phát triển phần mềm', 'approved', 3, 1, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01');

-- T3 (Sec - GV003) - Pending (Not yet approved by Head)
INSERT INTO topics (id, code, title, description, requirements, teacher_id, approver_id, specialization, status, max_students, current_students, period_id) VALUES
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380f03', 'DT003', 'Phát hiện mã độc sử dụng Machine Learning', 'Phân tích hành vi mã độc', 'Malware Analysis, ML', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03', NULL, 'An ninh mạng', 'pending', 2, 0, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01');

-- T4 (Data - GV004) - Approved, 0/2 (Empty)
INSERT INTO topics (id, code, title, description, requirements, teacher_id, approver_id, specialization, status, max_students, current_students, period_id) VALUES
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380f04', 'DT004', 'Dự báo chứng khoán', 'Time series forecasting', 'Python, Statistics', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', 'Khoa học dữ liệu', 'approved', 2, 0, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01');


-- 5. REGISTRATIONS & WORKFLOW STATES
-- Reg 1: SV001 + SV002 -> Topic 1 (AI) -> State: Defense Ready
-- Both students working on DT001
INSERT INTO thesis_registrations (id, student_id, topic_id, teacher_id, status, registered_at, outline_submitted_at, outline_feedback, thesis_submitted_at, thesis_file_url, code_link, score) VALUES
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380r01', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', '10eebc99-9c0b-4ef8-bb6d-6bb9bd380f01', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01', 'defense_ready', '2025-08-20 10:00:00+07', '2025-09-30 10:00:00+07', 'Đề cương tốt, tiếp tục triển khai.', '2025-12-15 10:00:00+07', 'https://example.com/thesis_sv001.pdf', 'https://github.com/sv001/project', 8.5),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380r02', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', '10eebc99-9c0b-4ef8-bb6d-6bb9bd380f01', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01', 'defense_registered', '2025-08-20 10:05:00+07', '2025-09-30 10:00:00+07', 'Đồng ý với định hướng.', '2025-12-15 11:00:00+07', 'https://example.com/thesis_sv002.pdf', 'https://github.com/sv002/project', 8.2);

-- Reg 2: SV004 -> Topic 2 (App) -> State: In Progress (Outline Approved, but not yet submitted thesis)
INSERT INTO thesis_registrations (id, student_id, topic_id, teacher_id, status, registered_at, outline_submitted_at, outline_feedback) VALUES
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380r03', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', '10eebc99-9c0b-4ef8-bb6d-6bb9bd380f02', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', 'in_progress', '2025-08-25 09:00:00+07', '2025-10-01 14:00:00+07', 'Cần bổ sung sơ đồ ERD chi tiết hơn.');

-- Reg 3: SV003 -> No active registration (e.g., dropped or checking 'Not Registered' state)
-- (No insert)


-- 6. COUNCILS
-- Create a council for AI topic (DT001)
-- President: GV002 (Bình), Secretary: GV005 (Mai), Reviewer: GV003 (Cường), Member: GV004 (Dũng)
-- Topic: DT001
INSERT INTO councils (id, name, president_id, secretary_id, reviewer_id, member_ids, period_id, date, time, room, topic_ids, status, description) VALUES
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380g01', 'Hội đồng Bảo vệ AI - K17', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b05', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03', '{"c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04"}', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01', '2026-01-20', '08:00', 'C.301', '{"10eebc99-9c0b-4ef8-bb6d-6bb9bd380f01"}', 'published', 'Bảo vệ các đề tài chuyên ngành AI và Dữ liệu');


-- 7. DEFENSE REGISTRATIONS (For SV002 who has 'defense_registered')
INSERT INTO defense_registrations (id, student_id, registration_id, supervisor_approval, secretary_approval, status, submitted_at) VALUES
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380d01', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', '30eebc99-9c0b-4ef8-bb6d-6bb9bd380r02', TRUE, FALSE, 'pending', '2026-01-02 09:00:00+07');


-- 8. PLAGIARISM CHECKS (SV001 passed)
INSERT INTO plagiarism_checks (id, student_id, registration_id, similarity_percentage, status, check_date, report_file) VALUES
('50eebc99-9c0b-4ef8-bb6d-6bb9bd380p01', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', '30eebc99-9c0b-4ef8-bb6d-6bb9bd380r01', 12.5, 'passed', '2025-12-16', 'turnitin_report_sv001.pdf');


-- 9. NOTIFICATIONS
INSERT INTO notifications (id, title, content, type, user_id, is_read) VALUES
('60eebc99-9c0b-4ef8-bb6d-6bb9bd380n01', 'Thông báo nộp khóa luận', 'Hệ thống đã mở cổng nộp khóa luận. Hạn chót 31/12/2025.', 'info', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', FALSE),
('60eebc99-9c0b-4ef8-bb6d-6bb9bd380n02', 'Kết quả rà soát đạo văn', 'Bạn đã đạt yêu cầu rà soát đạo văn (12.5%).', 'success', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', FALSE);

