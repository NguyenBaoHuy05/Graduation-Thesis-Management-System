import { Injectable, Scope } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Teacher } from './teachers.entity';
import { rowToTeacher, rowsToTeachers } from './teachers.transformer';
import { Database } from '../types/database.types';

export type TeacherCreate = Database['public']['Tables']['teachers']['Insert'];
export type TeacherUpdate = Database['public']['Tables']['teachers']['Update'];

@Injectable({ scope: Scope.REQUEST })
export class TeachersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Teacher[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('teachers')
      .select('*')
      .order('code', { ascending: true });

    if (error) throw error;
    return rowsToTeachers(data);
  }

  async findOne(id: string): Promise<Teacher> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('teachers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return rowToTeacher(data);
  }

  async create(payload: TeacherCreate): Promise<Teacher> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('teachers')
      // @ts-ignore
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return rowToTeacher(data);
  }

  async update(id: string, payload: TeacherUpdate): Promise<Teacher> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('teachers')
      // @ts-ignore
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return rowToTeacher(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabaseService
      .getClient()
      .from('teachers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
