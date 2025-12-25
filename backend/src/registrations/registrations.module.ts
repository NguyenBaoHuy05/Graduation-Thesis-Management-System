import { Module } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { RegistrationsResolver } from './registrations.resolver';
import { SupabaseModule } from '../supabase/supabase.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [SupabaseModule, NotificationsModule],
  providers: [RegistrationsService, RegistrationsResolver],
  exports: [RegistrationsService],
})
export class RegistrationsModule {}
