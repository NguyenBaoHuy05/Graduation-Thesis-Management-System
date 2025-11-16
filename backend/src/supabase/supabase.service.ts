import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {
    this.supabase = createClient<Database>(
      this.configService.get('SUPABASE_URL')!,
      this.configService.get('SUPABASE_KEY')!,
    );
  }

  getClient(): SupabaseClient<Database> {
    return this.supabase;
  }
}
