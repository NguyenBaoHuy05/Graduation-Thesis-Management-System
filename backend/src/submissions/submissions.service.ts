import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Submission } from './submissions.entity';
import {
  CreateSubmissionInput,
  UpdateSubmissionStatusInput,
} from './submissions.dto';

@Injectable()
export class SubmissionsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(input: CreateSubmissionInput): Promise<Submission> {
    const { data, error } = await (
      this.supabaseService.getClient().from('submissions') as any
    )
      .insert([
        {
          registration_id: input.registrationId,
          title: input.title,
          description: input.description,
          file_urls: input.fileUrls,
          type: input.type,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async findByRegistration(registrationId: string): Promise<Submission[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('submissions')
      .select('*')
      .eq('registration_id', registrationId)
      .order('submitted_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map((item: any) => this.mapToEntity(item));
  }

  async findByTeacher(teacherId: string): Promise<Submission[]> {
    // 1. Get all registrations for this teacher
    // This is a bit complex in Supabase without a join helper or view,
    // but for now let's assume we can fetch submissions where registration.teacher_id matches.
    // However, basic Supabase query on 'submissions' doesn't know about registration teacher.
    // Option A: Fetch registrations first, then submissions.

    // Step 1: Get registration IDs for the teacher
    const { data: regs } = await this.supabaseService
      .getClient()
      .from('thesis_registrations')
      .select('id')
      .eq('teacher_id', teacherId);

    if (!regs || regs.length === 0) return [];

    const regIds = regs.map((r: any) => r.id);

    // Step 2: Get submissions for those registrations
    const { data: submissions, error } = await this.supabaseService
      .getClient()
      .from('submissions')
      .select('*')
      .in('registration_id', regIds)
      .eq('type', 'outline') // Focus on Outline for now, or remove for all
      .order('submitted_at', { ascending: false });

    if (error) throw new Error(error.message);
    return submissions.map((item: any) => this.mapToEntity(item));
  }

  async updateStatus(input: UpdateSubmissionStatusInput): Promise<Submission> {
    const { data, error } = await (
      this.supabaseService.getClient().from('submissions') as any
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

  private mapToEntity(data: any): Submission {
    return {
      id: data.id,
      registrationId: data.registration_id,
      title: data.title,
      description: data.description,
      fileUrls: data.file_urls,
      type: data.type,
      status: data.status,
      feedback: data.feedback,
      submittedAt: data.submitted_at,
    };
  }
}
