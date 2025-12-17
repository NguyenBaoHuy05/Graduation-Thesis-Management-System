import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { User } from './user.entity';
import { rowToUser, rowsToUsers, toInsert } from './user.transformer';
import { Database } from '../types/database.types';

type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserRow = Database['public']['Tables']['users']['Row'];

@Injectable()
export class UsersService {
  constructor(private supabase: SupabaseService) {}

  async findAll(): Promise<User[]> {
    const { data, error } = await this.supabase
      .getClient()
      .from('users')
      .select('*');

    if (error) throw error;
    // Data from Supabase is typed as any/UserRow; use transformer to map to User
    return rowsToUsers(data as any);
  }

  async findOne(id: string): Promise<User> {
    const { data, error } = await this.supabase
      .getClient()
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null as any;
    return rowToUser(data as any);
  }

  async create(email: string, name: string): Promise<User> {
    const newUser: UserInsert = { email, name };

    const { data, error } = await this.supabase
      .getClient()
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (error) throw error;
    if (!data) return null as any;
    return rowToUser(data as any);
  }

  async update(id: string, name: string): Promise<User> {
    const { data, error } = await this.supabase
      .getClient()
      .from('users')
      .update({ name })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return null as any;
    return rowToUser(data as any);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .getClient()
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
