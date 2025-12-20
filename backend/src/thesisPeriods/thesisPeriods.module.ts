import { Module } from '@nestjs/common';
import { ThesisPeriodsResolver } from './thesisPeriods.resolver';
import { ThesisPeriodsService } from './thesisPeriods.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [ThesisPeriodsResolver, ThesisPeriodsService],
})
export class ThesisPeriodsModule {}
