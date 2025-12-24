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
  console.log('--- Checking Tables Existence ---');

  // Check progress_reports
  const { data: reports, error: reportError } = await supabase
    .from('progress_reports')
    .select('*')
    .limit(1);
  if (reportError) {
    console.log('Table progress_reports Check Failed:', reportError.message);
  } else {
    console.log('Table progress_reports EXISTS. Sample:', reports);
  }

  // Check timelines
  const { data: timelines, error: timelineError } = await supabase
    .from('timelines')
    .select('*')
    .limit(1);
  if (timelineError) {
    console.log('Table timelines Check Failed:', timelineError.message);
  } else {
    console.log('Table timelines EXISTS. Sample:', timelines);
  }
}

run();
