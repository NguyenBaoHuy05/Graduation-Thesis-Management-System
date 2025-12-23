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

// --- Static UUIDs for consistency ---
const PERIOD_ID = 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01';

const USER_IDS = {
  T1: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
  T2: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
  T3: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
  T4: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
};

const TEACHER_IDS = {
  T1: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
  T2: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02',
  T3: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03',
  T4: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04',
};

const TOPIC_IDS = {
  TP1: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01',
  TP2: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02',
};

const COUNCIL_ID = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01';

// --- Data ---

const users = [
  {
    id: USER_IDS.T1,
    username: 'teacher_seed_01',
    role: 'teacher',
    created_at: new Date().toISOString(),
  },
  {
    id: USER_IDS.T2,
    username: 'teacher_seed_02',
    role: 'teacher',
    created_at: new Date().toISOString(),
  },
  {
    id: USER_IDS.T3,
    username: 'teacher_seed_03',
    role: 'teacher',
    created_at: new Date().toISOString(),
  },
  {
    id: USER_IDS.T4,
    username: 'teacher_seed_04',
    role: 'teacher',
    created_at: new Date().toISOString(),
  },
];

const teachers = [
  {
    id: TEACHER_IDS.T1,
    user_id: USER_IDS.T1,
    code: 'GV_SEED_01',
    name: 'Nguyễn Văn A (Seed)',
    email: 'nguyenvana_seed@example.com',
    gender: 'Nam',
    title: 'Tiến sĩ',
    max_theses: 5,
    current_theses: 1,
    specialization: 'Công nghệ phần mềm',
  },
  {
    id: TEACHER_IDS.T2,
    user_id: USER_IDS.T2,
    code: 'GV_SEED_02',
    name: 'Trần Thị B (Seed)',
    email: 'tranthib_seed@example.com',
    gender: 'Nữ',
    title: 'Thạc sĩ',
    max_theses: 5,
    current_theses: 1,
    specialization: 'Trí tuệ nhân tạo',
  },
  {
    id: TEACHER_IDS.T3,
    user_id: USER_IDS.T3,
    code: 'GV_SEED_03',
    name: 'Lê Văn C (Seed)',
    email: 'levanc_seed@example.com',
    gender: 'Nam',
    title: 'Tiến sĩ',
    max_theses: 5,
    current_theses: 0,
    specialization: 'Mạng máy tính',
  },
  {
    id: TEACHER_IDS.T4,
    user_id: USER_IDS.T4,
    code: 'GV_SEED_04',
    name: 'Phạm Thị D (Seed)',
    email: 'phamthid_seed@example.com',
    gender: 'Nữ',
    title: 'Thạc sĩ',
    max_theses: 5,
    current_theses: 0,
    specialization: 'Hệ thống thông tin',
  },
];

const thesisPeriods = [
  {
    id: PERIOD_ID,
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
];

const topics = [
  {
    id: TOPIC_IDS.TP1,
    title: 'Xây dựng hệ thống quản lý khóa luận tốt nghiệp',
    description: 'Ứng dụng Web sử dụng Next.js và NestJS',
    teacher_id: TEACHER_IDS.T1,
    period_id: PERIOD_ID,
    status: 'approved',
    max_students: 3,
    current_students: 1,
  },
  {
    id: TOPIC_IDS.TP2,
    title: 'Nghiên cứu ứng dụng Blockchain trong giáo dục',
    description: 'Xây dựng dApp cấp phát chứng chỉ',
    teacher_id: TEACHER_IDS.T2,
    period_id: PERIOD_ID,
    status: 'approved',
    max_students: 3,
    current_students: 2,
  },
];

const councils = [
  {
    id: COUNCIL_ID,
    name: 'Hội đồng Bảo vệ Tốt nghiệp K1',
    president_id: TEACHER_IDS.T1,
    secretary_id: TEACHER_IDS.T2,
    reviewer_id: TEACHER_IDS.T3,
    member_ids: [TEACHER_IDS.T4],
    topic_ids: [TOPIC_IDS.TP1, TOPIC_IDS.TP2],
    period_id: PERIOD_ID,
    status: 'draft',
    description: 'Hội đồng chấm khóa luận cho sinh viên ngành CNPM',
  },
];

const notifications = [
  {
    id: '58f1c834-0d79-4d64-94ec-7c2275811c01',
    title:
      'Thông báo về việc đăng ký đề tài khóa luận tốt nghiệp kỳ 1 năm học 2025-2026',
    content:
      'Sinh viên lưu ý thời gian đăng ký đề tài từ ngày 15/08/2025 đến hết ngày 30/08/2025. Các đề tài phải được GVHD duyệt trước khi đăng ký lên hệ thống.',
    date: '2025-08-01',
    type: 'public',
    is_read: false,
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

  // 2. Teachers
  console.log('Seeding teachers...');
  const { error: teacherError } = await supabase
    .from('teachers')
    .upsert(teachers, { onConflict: 'id' });
  if (teacherError) console.error('Error seeding teachers:', teacherError);
  else console.log('Seeded teachers.');

  // 3. Thesis Periods
  console.log('Seeding thesis_periods...');
  const { error: tpError } = await supabase
    .from('thesis_periods')
    .upsert(thesisPeriods, { onConflict: 'id' });
  if (tpError) console.error('Error seeding thesis_periods:', tpError);
  else console.log('Seeded thesis_periods.');

  // 4. Topics
  console.log('Seeding topics...');
  const { error: topicError } = await supabase
    .from('topics')
    .upsert(topics, { onConflict: 'id' });
  if (topicError) console.error('Error seeding topics:', topicError);
  else console.log('Seeded topics.');

  // 5. Councils
  console.log('Seeding councils...');
  const { error: councilError } = await supabase
    .from('councils')
    .upsert(councils, { onConflict: 'id' });
  if (councilError) console.error('Error seeding councils:', councilError);
  else console.log('Seeded councils.');

  // 6. Notifications
  console.log('Seeding notifications...');
  const { error: nError } = await supabase
    .from('notifications')
    .upsert(notifications, { onConflict: 'id' });
  if (nError) console.error('Error seeding notifications:', nError);
  else console.log('Seeded notifications.');

  console.log('--- Seeding Completed ---');
}

seed();
