import { Module } from '@nestjs/common';
import { TimelinesService } from './timelines.service';
import { TimelinesResolver } from './timelines.resolver';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [TimelinesService, TimelinesResolver],
  exports: [TimelinesService],
})
export class TimelinesModule {}
