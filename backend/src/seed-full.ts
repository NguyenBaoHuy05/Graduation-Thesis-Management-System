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
    phone: '0934567890',
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
    phone: '0945678901',
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
    phone: '0956789012',
    class_name: 'CNTT-K17',
    major: 'Công nghệ thông tin',
    gpa: 2.8,
    credits_accumulated: 110,
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    code: 'SV004',
    name: 'Lê Thị Mai',
    email: 'mai.lt@student.edu.vn',
    phone: '0967890123',
    class_name: 'CNTT-K17',
    major: 'Công nghệ thông tin',
    gpa: 3.6,
    credits_accumulated: 132,
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    code: 'SV005',
    name: 'Hoàng Văn Long',
    email: 'long.hv@student.edu.vn',
    phone: '0978901234',
    class_name: 'CNTT-K17',
    major: 'An ninh mạng',
    gpa: 3.0,
    credits_accumulated: 120,
  },
];

const teachers = [
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11',
    code: 'GV001',
    name: 'TS. Nguyễn Văn An',
    email: 'nva@university.edu.vn',
    phone: '0901234567',
    date_of_birth: '1980-05-15',
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
    email: 'ttb@university.edu.vn',
    phone: '0912345678',
    date_of_birth: '1975-08-20',
    gender: 'Nữ',
    title: 'Phó giáo sư',
    title_coefficient: 2.0,
    max_theses: 12,
    current_theses: 2,
    specialization: 'Phát triển phần mềm',
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13',
    code: 'GV003',
    name: 'ThS. Lê Minh Cường',
    email: 'lmc@university.edu.vn',
    phone: '0923456789',
    date_of_birth: '1985-12-10',
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
    email: 'dung.pv@university.edu.vn',
    phone: '0934567891',
    date_of_birth: '1982-02-14',
    gender: 'Nam',
    title: 'Tiến sĩ',
    title_coefficient: 1.5,
    max_theses: 8,
    current_theses: 1,
    specialization: 'Khoa học dữ liệu',
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b05',
    user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15',
    code: 'GV005',
    name: 'ThS. Nguyễn Thị Mai',
    email: 'mai.nt@university.edu.vn',
    phone: '0945678912',
    date_of_birth: '1990-09-09',
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
    email: 'quang.tv@university.edu.vn',
    phone: '0976543210',
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
    email: 'huong.nt@university.edu.vn',
    phone: '0987654321',
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
    end_date: '2026-01-15',
    status: 'active',
    max_group_size: 3,
    milestones: [
      {
        id: 'm01',
        name: 'Đăng ký đề tài',
        startDate: '2025-08-15',
        endDate: '2025-08-30',
        type: 'registration',
      },
      {
        id: 'm05',
        name: 'Bảo vệ trước hội đồng',
        startDate: '2026-12-20',
        endDate: '2026-12-25',
        type: 'defense',
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
        id: 'm_old_03',
        name: 'Bảo vệ',
        startDate: '2025-06-01',
        endDate: '2025-06-10',
        type: 'defense',
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
    current_students: 3,
    period_id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01',
  },
];

const councils = [
  {
    id: '20eebc99-9c0b-4ef8-bb6d-6bb9bd380f01',
    name: 'Hội đồng bảo vệ K17 - Đợt 1',
    president_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
    secretary_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b05',
    reviewer_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04',
    commissioner_id: null,
    member_ids: ['c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03'],
    period_id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01',
    date: '2026-12-20',
    time: '08:00',
    room: 'C.301',
    topic_ids: ['10eebc99-9c0b-4ef8-bb6d-6bb9bd380f01'],
    status: 'published',
    description: 'Hội đồng bảo vệ đợt 1 - Khoa CNTT',
  },
];

async function seed() {
  console.log('--- Seeding Start ---');
  console.log('URL:', supabaseUrl);

  // 1. Users
  console.log('Seeding users...');
  const { error: userError } = await supabase
    .from('users')
    .upsert(users, { onConflict: 'id' });
  if (userError) console.error('Error seeding users:', userError);
  else console.log('Seeded users.');

  // 2. Students
  console.log('Seeding students...');
  const { error: studentError } = await supabase
    .from('students')
    .upsert(students, { onConflict: 'id' });
  if (studentError) console.error('Error seeding students:', studentError);
  else console.log('Seeded students.');

  // 3. Teachers
  console.log('Seeding teachers...');
  const { error: teacherError } = await supabase
    .from('teachers')
    .upsert(teachers, { onConflict: 'id' });
  if (teacherError) console.error('Error seeding teachers:', teacherError);
  else console.log('Seeded teachers.');

  // 4. Heads
  console.log('Seeding heads...');
  const { error: headError } = await supabase
    .from('heads')
    .upsert(heads, { onConflict: 'id' });
  if (headError) console.error('Error seeding heads:', headError);
  else console.log('Seeded heads.');

  // 5. Secretaries
  console.log('Seeding secretaries...');
  const { error: secError } = await supabase
    .from('secretaries')
    .upsert(secretaries, { onConflict: 'id' });
  if (secError) console.error('Error seeding secretaries:', secError);
  else console.log('Seeded secretaries.');

  // 6. Thesis Periods
  console.log('Seeding thesis_periods...');
  const { error: periodError } = await supabase
    .from('thesis_periods')
    .upsert(thesisPeriods, { onConflict: 'id' });
  if (periodError) console.error('Error seeding thesis_periods:', periodError);
  else console.log('Seeded thesis_periods.');

  // 7. Topics
  console.log('Seeding topics...');
  const { error: topicError } = await supabase
    .from('topics')
    .upsert(topics, { onConflict: 'id' });
  if (topicError) console.error('Error seeding topics:', topicError);
  else console.log('Seeded topics.');

  // 8. Councils
  console.log('Seeding councils...');
  const { error: councilError } = await supabase
    .from('councils')
    .upsert(councils, { onConflict: 'id' });
  if (councilError) console.error('Error seeding councils:', councilError);
  else console.log('Seeded councils.');

  // 9. Thesis Registrations
  console.log('Seeding thesis_registrations...');
  const thesisRegistrations = [
    {
      id: '30eebc99-9c0b-4ef8-bb6d-6bb9bd380h01',
      student_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
      topic_id: '10eebc99-9c0b-4ef8-bb6d-6bb9bd380f01',
      teacher_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
      status: 'in_progress',
      registered_at: '2025-08-20',
    },
  ];

  const { error: regError } = await supabase
    .from('thesis_registrations')
    .upsert(thesisRegistrations, { onConflict: 'id' });
  if (regError) console.error('Error seeding thesis_registrations:', regError);
  else console.log('Seeded thesis_registrations.');

  console.log('--- Seeding Completed ---');
}

seed();
