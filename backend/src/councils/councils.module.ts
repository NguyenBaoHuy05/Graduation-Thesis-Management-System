import { Module } from '@nestjs/common';
import { CouncilsService } from './councils.service';
import { CouncilsResolver } from './councils.resolver';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [CouncilsResolver, CouncilsService],
  exports: [CouncilsService],
})
export class CouncilsModule {}
