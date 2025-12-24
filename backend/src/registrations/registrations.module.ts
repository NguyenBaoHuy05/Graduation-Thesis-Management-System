import { Module } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { RegistrationsResolver } from './registrations.resolver';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [RegistrationsService, RegistrationsResolver],
  exports: [RegistrationsService],
})
export class RegistrationsModule {}
