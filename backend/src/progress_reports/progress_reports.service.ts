import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ProgressReport } from './progress_reports.entity';
import {
  CreateProgressReportInput,
  UpdateProgressReportStatusInput,
} from './progress_reports.dto';

@Injectable()
export class ProgressReportsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(input: CreateProgressReportInput): Promise<ProgressReport> {
    const { data, error } = await (
      this.supabaseService.getClient().from('progress_reports') as any
    )
      .insert([
        {
          registration_id: input.registrationId,
          title: input.title,
          content: input.content,
          plan_next: input.planNext,
          file_url: input.fileUrl,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async findByRegistration(registrationId: string): Promise<ProgressReport[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('progress_reports')
      .select('*')
      .eq('registration_id', registrationId)
      .order('submitted_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map((item: any) => this.mapToEntity(item));
  }

  async updateStatus(
    input: UpdateProgressReportStatusInput,
  ): Promise<ProgressReport> {
    const { data, error } = await (
      this.supabaseService.getClient().from('progress_reports') as any
    )
      .update({
        status: input.status,
        feedback: input.feedback,
      })
      .eq('id', input.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  private mapToEntity(data: any): ProgressReport {
    return {
      id: data.id,
      registrationId: data.registration_id,
      title: data.title,
      content: data.content,
      planNext: data.plan_next,
      fileUrl: data.file_url,
      submittedAt: data.submitted_at,
      status: data.status,
      feedback: data.feedback,
    };
  }
}
