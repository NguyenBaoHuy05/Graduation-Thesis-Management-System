import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env from backend module
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- Data Definitions ---

const users = [
  // Students
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    username: 'SV001',
    password: '123',
    role: 'student',
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    username: 'SV002',
    password: '123',
    role: 'student',
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    username: 'SV003',
    password: '123',
    role: 'student',
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    username: 'SV004',
    password: '123',
    role: 'student',
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    username: 'SV005',
    password: '123',
    role: 'student',
  },
  // Teachers
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11',
    username: 'GV001',
    password: '123',
    role: 'teacher',
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12',
    username: 'GV002',
    password: '123',
    role: 'teacher',
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13',
    username: 'GV003',
    password: '123',
    role: 'teacher',
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14',
    username: 'GV004',
    password: '123',
    role: 'teacher',
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15',
    username: 'GV005',
    password: '123',
    role: 'teacher',
  },
  // Head
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01',
    username: 'HD001',
    password: '123',
    role: 'head',
  },
  // Secretary
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01',
    username: 'SC001',
    password: '123',
    role: 'secretary',
  },
];

const students = [
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    code: 'SV001',
    name: 'Nguyễn Minh Đức',
    email: 'duc.nm@student.edu.vn',
    phone: '0901000001',
    class_name: 'CNTT-K17',
    major: 'Công nghệ thông tin',
    gpa: 3.5,
    credits_accumulated: 130,
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    code: 'SV002',
    name: 'Phạm Thu Hà',
    email: 'ha.pt@student.edu.vn',
    phone: '0901000002',
    class_name: 'CNTT-K17',
    major: 'Công nghệ thông tin',
    gpa: 3.2,
    credits_accumulated: 125,
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    code: 'SV003',
    name: 'Trần Văn Nam',
    email: 'nam.tv@student.edu.vn',
    phone: '0901000003',
    class_name: 'CNTT-K17',
    major: 'An ninh mạng',
    gpa: 2.8,
    credits_accumulated: 110,
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    code: 'SV004',
    name: 'Lê Thị Mai',
    email: 'mai.lt@student.edu.vn',
    phone: '0901000004',
    class_name: 'CNTT-K17',
    major: 'Hệ thống thông tin',
    gpa: 3.6,
    credits_accumulated: 135,
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    code: 'SV005',
    name: 'Hoàng Văn Long',
    email: 'long.hv@student.edu.vn',
    phone: '0901000005',
    class_name: 'CNTT-K17',
    major: 'Khoa học dữ liệu',
    gpa: 3.0,
    credits_accumulated: 118,
  },
];

const teachers = [
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11',
    code: 'GV001',
    name: 'TS. Nguyễn Văn An',
    email: 'an.nv@edu.vn',
    phone: '0911000001',
    date_of_birth: '1980-01-01',
    gender: 'Nam',
    title: 'Tiến sĩ',
    title_coefficient: 1.5,
    max_theses: 9,
    current_theses: 3,
    specialization: 'Trí tuệ nhân tạo',
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12',
    code: 'GV002',
    name: 'PGS.TS. Trần Thị Bình',
    email: 'binh.tt@edu.vn',
    phone: '0911000002',
    date_of_birth: '1975-02-02',
    gender: 'Nữ',
    title: 'Phó giáo sư',
    title_coefficient: 2.0,
    max_theses: 12,
    current_theses: 1,
    specialization: 'Phát triển phần mềm',
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13',
    code: 'GV003',
    name: 'ThS. Lê Minh Cường',
    email: 'cuong.lm@edu.vn',
    phone: '0911000003',
    date_of_birth: '1985-03-03',
    gender: 'Nam',
    title: 'Thạc sĩ',
    title_coefficient: 1.0,
    max_theses: 6,
    current_theses: 2,
    specialization: 'An ninh mạng',
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14',
    code: 'GV004',
    name: 'TS. Phạm Văn Dũng',
    email: 'dung.pv@edu.vn',
    phone: '0911000004',
    date_of_birth: '1982-04-04',
    gender: 'Nam',
    title: 'Tiến sĩ',
    title_coefficient: 1.5,
    max_theses: 8,
    current_theses: 4,
    specialization: 'Khoa học dữ liệu',
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b05',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15',
    code: 'GV005',
    name: 'ThS. Nguyễn Thị Mai',
    email: 'mai.nt@edu.vn',
    phone: '0911000005',
    date_of_birth: '1990-05-05',
    gender: 'Nữ',
    title: 'Thạc sĩ',
    title_coefficient: 1.0,
    max_theses: 5,
    current_theses: 0,
    specialization: 'Hệ thống thông tin',
  },
];

const heads = [
  {
    id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01',
    code: 'HD001',
    name: 'Trần Văn Quang',
    email: 'quang.tv@edu.vn',
    phone: '0922000001',
    date_of_birth: '1970-11-05',
    gender: 'Nam',
  },
];

const secretaries = [
  {
    id: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01',
    code: 'SC001',
    name: 'Nguyễn Thị Hương',
    email: 'huong.nt@edu.vn',
    phone: '0933000001',
    date_of_birth: '1988-03-22',
    gender: 'Nữ',
  },
];

const thesisPeriods = [
  {
    id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01',
    name: 'Kỳ 1 - Năm học 2025-2026',
    academic_year: '2025-2026',
    start_date: '2025-08-01',
    end_date: '2026-01-30',
    status: 'active',
    max_group_size: 3,
    milestones: [
      {
        id: 'm1',
        name: 'Đăng ký đề tài',
        type: 'registration',
        startDate: '2025-08-15',
        endDate: '2025-09-15',
      },
      {
        id: 'm2',
        name: 'Nộp đề cương',
        type: 'outline',
        startDate: '2025-09-20',
        endDate: '2025-10-05',
      },
      {
        id: 'm3',
        name: 'Nộp khóa luận',
        type: 'submission',
        startDate: '2025-12-01',
        endDate: '2025-12-31',
      },
      {
        id: 'm4',
        name: 'Đăng ký bảo vệ',
        type: 'defense_registration',
        startDate: '2026-01-01',
        endDate: '2026-01-10',
      },
      {
        id: 'm5',
        name: 'Bảo vệ trước hội đồng',
        type: 'defense',
        startDate: '2026-01-15',
        endDate: '2026-01-25',
      },
    ],
  },
  {
    id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e02',
    name: 'Kỳ 2 - Năm học 2024-2025',
    academic_year: '2024-2025',
    start_date: '2025-01-15',
    end_date: '2025-06-15',
    status: 'closed',
    max_group_size: 3,
    milestones: [
      {
        id: 'm_old_1',
        name: 'Bảo vệ',
        type: 'defense',
        startDate: '2025-06-01',
        endDate: '2025-06-10',
      },
    ],
  },
];

const topics = [
  {
    id: '10eebc99-9c0b-4ef8-bb6d-6bb9bd380f01',
    code: 'DT001',
    title: 'Xây dựng hệ thống chatbot hỗ trợ tư vấn sử dụng AI',
    description: 'Nghiên cứu chatbot thông minh',
    requirements: 'Python, NLP',
    teacher_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
    approver_id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01',
    specialization: 'Trí tuệ nhân tạo',
    status: 'approved',
    max_students: 2,
    current_students: 2,
    period_id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01',
  },
  {
    id: '10eebc99-9c0b-4ef8-bb6d-6bb9bd380f02',
    code: 'DT002',
    title: 'Ứng dụng quản lý bán hàng trực tuyến với React và Node.js',
    description: 'Xây dựng app bán hàng',
    requirements: 'React, Node',
    teacher_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02',
    approver_id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01',
    specialization: 'Phát triển phần mềm',
    status: 'approved',
    max_students: 3,
    current_students: 1,
    period_id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01',
  },
  {
    id: '10eebc99-9c0b-4ef8-bb6d-6bb9bd380f03',
    code: 'DT003',
    title: 'Phát hiện mã độc sử dụng Machine Learning',
    description: 'Phân tích hành vi mã độc',
    requirements: 'Malware Analysis, ML',
    teacher_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03',
    approver_id: null,
    specialization: 'An ninh mạng',
    status: 'pending',
    max_students: 2,
    current_students: 0,
    period_id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01',
  },
  {
    id: '10eebc99-9c0b-4ef8-bb6d-6bb9bd380f04',
    code: 'DT004',
    title: 'Dự báo chứng khoán',
    description: 'Time series forecasting',
    requirements: 'Python, Statistics',
    teacher_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04',
    approver_id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01',
    specialization: 'Khoa học dữ liệu',
    status: 'approved',
    max_students: 2,
    current_students: 0,
    period_id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01',
  },
];

const councils = [
  {
    id: '20eebc99-9c0b-4ef8-bb6d-6bb9bd380g01',
    name: 'Hội đồng bảo vệ K17 - Đợt 1',
    president_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', // Binh
    secretary_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b05', // Mai
    reviewer_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03', // Cuong
    commissioner_id: null,
    member_ids: ['c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04'], // Dung
    period_id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01',
    date: '2026-01-20',
    time: '08:00',
    room: 'C.301',
    topic_ids: ['10eebc99-9c0b-4ef8-bb6d-6bb9bd380f01'],
    status: 'published',
    description: 'Hội đồng bảo vệ đợt 1 - Khoa CNTT',
  },
];

const thesisRegistrations = [
  {
    id: '30eebc99-9c0b-4ef8-bb6d-6bb9bd380r01',
    student_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', // Duc
    topic_id: '10eebc99-9c0b-4ef8-bb6d-6bb9bd380f01', // AI
    teacher_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01', // An
    status: 'defense_ready',
    registered_at: '2025-08-20',
    outline_submitted_at: '2025-09-30',
    outline_feedback: 'Đề cương tốt, tiếp tục triển khai.',
    thesis_submitted_at: '2025-12-15',
    thesis_file_url: 'https://example.com/thesis_sv001.pdf',
    code_link: 'https://github.com/sv001/project',
    score: 8.5,
  },
  {
    id: '30eebc99-9c0b-4ef8-bb6d-6bb9bd380r02',
    student_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', // Ha
    topic_id: '10eebc99-9c0b-4ef8-bb6d-6bb9bd380f01', // AI
    teacher_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01', // An
    status: 'defense_registered', // Ready for defense
    registered_at: '2025-08-20',
    outline_submitted_at: '2025-09-30',
    outline_feedback: 'Đồng ý với định hướng.',
    thesis_submitted_at: '2025-12-15',
    thesis_file_url: 'https://example.com/thesis_sv002.pdf',
    code_link: 'https://github.com/sv002/project',
    score: 8.2,
  },
  {
    id: '30eebc99-9c0b-4ef8-bb6d-6bb9bd380r03',
    student_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', // Mai
    topic_id: '10eebc99-9c0b-4ef8-bb6d-6bb9bd380f02', // App
    teacher_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', // Binh
    status: 'in_progress',
    registered_at: '2025-08-25',
    outline_submitted_at: '2025-10-01',
    outline_feedback: 'Cần bổ sung sơ đồ ERD chi tiết hơn.',
  },
];

const defenseRegistrations = [
  {
    id: '40eebc99-9c0b-4ef8-bb6d-6bb9bd380d01',
    student_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', // Ha
    registration_id: '30eebc99-9c0b-4ef8-bb6d-6bb9bd380r02',
    supervisor_approval: true,
    secretary_approval: false,
    status: 'pending',
    submitted_at: '2026-01-02',
  },
];

const plagiarismChecks = [
  {
    id: '50eebc99-9c0b-4ef8-bb6d-6bb9bd380p01',
    student_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
    registration_id: '30eebc99-9c0b-4ef8-bb6d-6bb9bd380r01',
    similarity_percentage: 12.5,
    status: 'passed',
    check_date: '2025-12-16',
    report_file: 'turnitin_report_sv001.pdf',
  },
];

const notifications = [
  {
    id: '60eebc99-9c0b-4ef8-bb6d-6bb9bd380n01',
    title: 'Thông báo nộp khóa luận',
    content: 'Hệ thống đã mở cổng nộp khóa luận. Hạn chót 31/12/2025.',
    type: 'info',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // SV001
    is_read: false,
  },
  {
    id: '60eebc99-9c0b-4ef8-bb6d-6bb9bd380n02',
    title: 'Kết quả rà soát đạo văn',
    content: 'Bạn đã đạt yêu cầu rà soát đạo văn (12.5%).',
    type: 'success',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // SV001
    is_read: false,
  },
];

async function seed() {
  console.log('--- Seeding Start ---');
  console.log('URL:', supabaseUrl);

  const tables = [
    { name: 'users', data: users },
    { name: 'students', data: students },
    { name: 'teachers', data: teachers },
    { name: 'heads', data: heads },
    { name: 'secretaries', data: secretaries },
    { name: 'thesis_periods', data: thesisPeriods },
    { name: 'topics', data: topics },
    { name: 'councils', data: councils },
    { name: 'thesis_registrations', data: thesisRegistrations },
    { name: 'defense_registrations', data: defenseRegistrations },
    { name: 'plagiarism_checks', data: plagiarismChecks },
    { name: 'notifications', data: notifications },
  ];

  for (const { name, data } of tables) {
    console.log(`Seeding ${name}...`);
    // Upsert to handle potential conflicts or updates
    const { error } = await supabase
      .from(name)
      .upsert(data, { onConflict: 'id' });
    if (error) {
      console.error(`Error seeding ${name}:`, error);
    } else {
      console.log(`Seeded ${name}.`);
    }
  }

  console.log('--- Seeding Completed ---');
}

seed();
