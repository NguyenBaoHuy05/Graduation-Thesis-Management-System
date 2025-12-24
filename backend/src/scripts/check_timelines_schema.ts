import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('--- Checking Timelines Columns ---');

  // Method 1: Insert dummy and error to see structure (hacky but fast if no permissions on info schema)
  // Method 2: information_schema (better)

  const { data, error } = await supabase.rpc('get_table_info', {
    table_name: 'timelines',
  }); // Custom RPC if exists, unlikely.

  // Let's try direct select from information_schema via SQL if we could, but we can't via client directly easily without wrapper.
  // We can try to just Select * from timelines limit 1 and print the keys of the returned object (if not empty).
  // But it was empty [].

  // Let's try to insert a row with 'title' and see the specific error from the library?
  // The user reported "Could not find the 'title' column", which implies the library checked and failed.

  // Let's try to create a dummy RPC or just run a raw query if possible? No.

  // We can use the 'rpc' hack if we have a function, but we don't.

  // Let's just try to insert a row with ALL potential columns and see what fails, OR just try to select 'id' and see if that works.

  const { data: cols, error: colError } = await supabase
    .from('timelines')
    .select('*')
    .limit(1);

  if (colError) console.log('Select * error:', colError);
  else console.log('Select * data:', cols);

  // If data is empty we can't see columns.
  // Let's try to insert using a raw SQL if we have a way... we don't via JS client easily.

  // Wait, I can use pg-structure or just assume the previous migration might not have run or partially run?
  // The user said "2 bảng đó có rồi mà".

  // Let's try to use the REST API to describe? Supabase client doesn't expose describe.

  // Strategy: Try to Insert a minimal row.
  console.log('Attempting insert...');
  const { data: insData, error: insError } = await supabase
    .from('timelines')
    .insert([
      {
        registration_id: '00000000-0000-0000-0000-000000000000',
        title: 'Test',
        description: 'Test',
      },
    ]) // this might fail FK
    .select();

  if (insError) console.log('Insert Error:', insError);
  else console.log('Insert Data:', insData);
}

run();
