import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { FormTemplate } from './formTemplates.entity';
import {
  rowToFormTemplate,
  rowsToFormTemplates,
} from './formTemplates.transformer';
import { Database } from '../types/database.types';

type FormTemplateInsert =
  Database['public']['Tables']['form_templates']['Insert'];
type FormTemplateUpdate =
  Database['public']['Tables']['form_templates']['Update'];
type FormTemplateRow = Database['public']['Tables']['form_templates']['Row'];

@Injectable()
export class FormTemplatesService {
  constructor(private supabase: SupabaseService) {}

  async findAll(): Promise<FormTemplate[]> {
    const { data, error } = await this.supabase
      .getClient()
      .from('form_templates')
      .select('*')
      .order('upload_date', { ascending: false });
    if (error) throw error;
    return rowsToFormTemplates(data);
  }

  async findOne(id: string): Promise<FormTemplate> {
    const { data, error } = await this.supabase
      .getClient()
      .from('form_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null as any;
    return rowToFormTemplate(data);
  }

  async create(payload: FormTemplateInsert): Promise<FormTemplate> {
    const { data, error } = await (
      this.supabase.getClient().from('form_templates') as any
    )
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    if (!data) return null as any;
    return rowToFormTemplate(data);
  }

  async update(id: string, payload: FormTemplateUpdate): Promise<FormTemplate> {
    const { data, error } = await (
      this.supabase.getClient().from('form_templates') as any
    )
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    if (!data) return null as any;
    return rowToFormTemplate(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .getClient()
      .from('form_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
