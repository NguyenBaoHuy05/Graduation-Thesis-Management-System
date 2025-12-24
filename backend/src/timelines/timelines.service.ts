import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Timeline } from './timelines.entity';
import {
  CreateTimelineInput,
  UpdateTimelineStatusInput,
} from './timelines.dto';

@Injectable()
export class TimelinesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(input: CreateTimelineInput): Promise<Timeline> {
    const { data, error } = await (
      this.supabaseService.getClient().from('timelines') as any
    )
      .insert([
        {
          registration_id: input.registrationId,
          milestone: input.milestone,
          description: input.description,
          due_date: input.dueDate,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async findByRegistration(registrationId: string): Promise<Timeline[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('timelines')
      .select('*')
      .eq('registration_id', registrationId)
      .order('due_date', { ascending: true });

    if (error) throw new Error(error.message);
    return data.map((item: any) => this.mapToEntity(item));
  }

  async update(input: any): Promise<Timeline> {
    const updateData: any = {};
    if (input.milestone) updateData.milestone = input.milestone;
    if (input.description) updateData.description = input.description;
    if (input.dueDate) updateData.due_date = input.dueDate;
    if (input.feedback) updateData.feedback = input.feedback;

    const { data, error } = await (
      this.supabaseService.getClient().from('timelines') as any
    )
      .update(updateData)
      .eq('id', input.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async updateStatus(input: UpdateTimelineStatusInput): Promise<Timeline> {
    const updateData: any = { status: input.status };
    if (input.status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    } else {
      updateData.completed_at = null;
    }

    const { data, error } = await (
      this.supabaseService.getClient().from('timelines') as any
    )
      .update(updateData)
      .eq('id', input.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabaseService
      .getClient()
      .from('timelines')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  }

  // Helper mapping
  private mapToEntity(data: any): Timeline {
    return {
      id: data.id,
      registrationId: data.registration_id,
      milestone: data.milestone,
      description: data.description,
      dueDate: data.due_date,
      status: data.status,
      completedAt: data.completed_at,
      feedback: data.feedback,
    };
  }
}
