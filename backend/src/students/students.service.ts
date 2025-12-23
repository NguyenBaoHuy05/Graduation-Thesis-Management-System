import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { SupabaseService } from '../supabase/supabase.service';
import { Student } from './students.entity';
import { rowToStudent, rowsToStudents } from './students.transformer';

import { Database } from '../types/database.types';

export type StudentCreate = Database['public']['Tables']['students']['Insert'];
export type StudentUpdate = Database['public']['Tables']['students']['Update'];

@Injectable({ scope: Scope.REQUEST })
export class StudentsService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly supabaseService: SupabaseService,
  ) {}

  async findAll(): Promise<Student[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('students')
      .select('*')
      .order('code', { ascending: true });

    if (error) throw error;
    return rowsToStudents(data);
  }

  async findOne(id: string): Promise<Student> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return rowToStudent(data);
  }

  async create(payload: StudentCreate): Promise<Student> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('students')
      // @ts-ignore
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return rowToStudent(data);
  }

  async update(id: string, payload: StudentUpdate): Promise<Student> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('students')
      // @ts-ignore
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return rowToStudent(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabaseService
      .getClient()
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
