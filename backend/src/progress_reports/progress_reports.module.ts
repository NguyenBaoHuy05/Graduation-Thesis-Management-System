import { Module } from '@nestjs/common';
import { ProgressReportsService } from './progress_reports.service';
import { ProgressReportsResolver } from './progress_reports.resolver';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [ProgressReportsService, ProgressReportsResolver],
  exports: [ProgressReportsService],
})
export class ProgressReportsModule {}
