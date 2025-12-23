import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
);

async function verify() {
  console.log('--- Verification Details ---');

  const { count: teacherCount, error } = await supabase
    .from('teachers')
    .select('*', { count: 'exact', head: true })
    .ilike('code', 'GV_SEED%');

  console.log('Seeded Teachers Count:', teacherCount);
  if (error) console.error(error);

  const { count: userCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .ilike('username', 'teacher_seed%');
  console.log('Seeded Users Count:', userCount);

  const { data: councils } = await supabase.from('councils').select('id, name');
  console.log('Councils:', JSON.stringify(councils, null, 2));
}

verify();
