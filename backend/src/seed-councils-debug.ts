import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
);

const PERIOD_ID = 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01';
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

async function seed() {
  console.log('--- Seeding Councils Debug ---');

  // Check dependency existence
  const { data: pData } = await supabase
    .from('thesis_periods')
    .select('id')
    .eq('id', PERIOD_ID)
    .single();
  console.log('Period Exists:', !!pData);

  const { data: tData } = await supabase
    .from('teachers')
    .select('id')
    .in('id', Object.values(TEACHER_IDS));
  console.log('Teachers Found:', tData?.length);

  const { error } = await supabase.from('councils').upsert(councils).select();
  if (error) {
    console.error('Error seeding councils:', JSON.stringify(error, null, 2));
  } else {
    console.log('Success seeding councils');
  }
}

seed();
