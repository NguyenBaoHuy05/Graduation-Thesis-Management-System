import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ThesisPeriod } from './thesisPeriods.entity';
import {
  rowToThesisPeriod,
  rowsToThesisPeriods,
} from './thesisPeriods.transformer';
import { Database } from '../types/database.types';

type ThesisPeriodInsert =
  Database['public']['Tables']['thesis_periods']['Insert'];
type ThesisPeriodUpdate =
  Database['public']['Tables']['thesis_periods']['Update'];
type ThesisPeriodRow = Database['public']['Tables']['thesis_periods']['Row'];

@Injectable()
export class ThesisPeriodsService {
  constructor(private supabase: SupabaseService) {}

  async findAll(): Promise<ThesisPeriod[]> {
    const { data, error } = await this.supabase
      .getClient()
      .from('thesis_periods')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return rowsToThesisPeriods(data);
  }

  async findOne(id: string): Promise<ThesisPeriod> {
    const { data, error } = await this.supabase
      .getClient()
      .from('thesis_periods')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null as any;
    return rowToThesisPeriod(data);
  }

  async create(payload: ThesisPeriodInsert): Promise<ThesisPeriod> {
    const { data, error } = await (
      this.supabase.getClient().from('thesis_periods') as any
    )
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    if (!data) return null as any;
    return rowToThesisPeriod(data);
  }

  async update(id: string, payload: ThesisPeriodUpdate): Promise<ThesisPeriod> {
    const { data, error } = await (
      this.supabase.getClient().from('thesis_periods') as any
    )
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    if (!data) return null as any;
    return rowToThesisPeriod(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .getClient()
      .from('thesis_periods')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
