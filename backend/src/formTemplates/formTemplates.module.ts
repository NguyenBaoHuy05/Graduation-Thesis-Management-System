import { Module } from '@nestjs/common';
import { FormTemplatesResolver } from './formTemplates.resolver';
import { FormTemplatesService } from './formTemplates.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [FormTemplatesResolver, FormTemplatesService],
})
export class FormTemplatesModule {}
