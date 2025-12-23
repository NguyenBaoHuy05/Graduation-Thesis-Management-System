import { Injectable, Scope } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Notification } from './notifications.entity';
import {
  rowToNotification,
  rowsToNotifications,
} from './notifications.transformer';
import { Database } from '../types/database.types';

export type NotificationCreate =
  Database['public']['Tables']['notifications']['Insert'];
export type NotificationUpdate =
  Database['public']['Tables']['notifications']['Update'];

@Injectable({ scope: Scope.REQUEST })
export class NotificationsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Notification[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('notifications')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return rowsToNotifications(data);
  }

  async findOne(id: string): Promise<Notification> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return rowToNotification(data);
  }

  async create(payload: NotificationCreate): Promise<Notification> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('notifications')
      // @ts-ignore
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return rowToNotification(data);
  }

  async update(id: string, payload: NotificationUpdate): Promise<Notification> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('notifications')
      // @ts-ignore
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return rowToNotification(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabaseService
      .getClient()
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
