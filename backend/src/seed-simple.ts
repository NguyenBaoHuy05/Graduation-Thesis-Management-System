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
  {
    id: '58f1c834-0d79-4d64-94ec-7c2275811c02',
    title: 'Hướng dẫn nộp đề cương chi tiết',
    content:
      'Sinh viên nộp đề cương chi tiết qua hệ thống trước ngày 15/09/2025. Mẫu đề cương có thể tải về tại mục Biểu mẫu.',
    date: '2025-09-01',
    type: 'internal',
    is_read: false,
  },
  {
    id: '58f1c834-0d79-4d64-94ec-7c2275811c03',
    title: 'Lịch bảo vệ thử',
    content:
      'Lịch bảo vệ thử sẽ diễn ra vào tuần đầu tiên của tháng 12. Sinh viên theo dõi lịch chi tiết được cập nhật trên website khoa.',
    date: '2025-11-20',
    type: 'public',
    is_read: false,
  },
];

async function seed() {
  console.log('--- Debug Info ---');
  console.log('URL:', supabaseUrl);
  console.log('Key length:', supabaseKey?.length);

  // Test connection
  const { count, error: countError } = await supabase
    .from('thesis_periods')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Connection/Query Error:', countError);
    return;
  }
  console.log('Current row count:', count);

  console.log('Seeding thesis_periods...');
  const { data: tpData, error: tpError } = await supabase
    .from('thesis_periods')
    .upsert(thesisPeriods, { onConflict: 'id' })
    .select();

  if (tpError) {
    console.error('Error seeding thesis_periods:', tpError);
  } else {
    console.log('Successfully seeded thesis_periods:', tpData?.length, 'rows');
  }

  console.log('Seeding notifications...');
  const { data: nData, error: nError } = await supabase
    .from('notifications')
    .upsert(notifications, { onConflict: 'id' })
    .select();

  if (nError) {
    console.error('Error seeding notifications:', nError);
  } else {
    console.log('Successfully seeded notifications:', nData?.length, 'rows');
  }
}

seed();
