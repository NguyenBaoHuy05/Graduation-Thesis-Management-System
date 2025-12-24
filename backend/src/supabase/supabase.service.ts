import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient<Database>;
  private supabaseAdmin: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get('SUPABASE_URL')!;
    const supabaseKey = this.configService.get('SUPABASE_KEY')!;
    const supabaseServiceRoleKey =
      this.configService.get('SUPABASE_SERVICE_ROLE_KEY') || supabaseKey;

    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);

    this.supabaseAdmin = createClient<Database>(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  getClient(): SupabaseClient<Database> {
    return this.supabase;
  }

  getAdminClient(): SupabaseClient<Database> {
    return this.supabaseAdmin;
  }
}
