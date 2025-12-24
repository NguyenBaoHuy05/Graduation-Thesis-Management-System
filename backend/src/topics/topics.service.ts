import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Topic } from './topics.entity';

@Injectable()
export class TopicsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createTopicInput: any): Promise<Topic> {
    const {
      title,
      description,
      requirements,
      studyReferences,
      teacherId,
      specialization,
      maxStudents,
      periodId,
    } = createTopicInput;

    // 1. Validate maxStudents against active Thesis Period
    const { data: period, error: periodError } = await this.supabaseService
      .getClient()
      .from('thesis_periods')
      .select('*')
      .eq('id', periodId)
      .single();

    if (periodError || !period) {
      throw new BadRequestException('Thesis period not found');
    }

    // Cast to any to avoid TS 'never' inference error
    const periodData = period as any;
    if (periodData.max_group_size && maxStudents > periodData.max_group_size) {
      throw new BadRequestException(
        `Max students cannot exceed the period limit of ${periodData.max_group_size}`,
      );
    }

    // 2. Insert into DB
    const { data, error } = await this.supabaseService
      .getClient()
      .from('topics')
      .insert([
        {
          title,
          description,
          requirements,
          study_references: studyReferences,
          teacher_id: teacherId,
          specialization,
          max_students: maxStudents,
          period_id: periodId,
          code: `DT${Date.now().toString().slice(-4)}`, // Simple auto-gen code
          status: 'pending',
          current_students: 0,
        },
      ] as any)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.mapToEntity(data);
  }

  async findAll(): Promise<Topic[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('topics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data.map((item) => this.mapToEntity(item));
  }

  async findByTeacher(teacherId: string): Promise<Topic[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('topics')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data.map((item) => this.mapToEntity(item));
  }

  async findOne(id: string): Promise<Topic> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('topics')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new BadRequestException('Topic not found');

    return this.mapToEntity(data);
  }

  async update(id: string, updateTopicInput: any): Promise<Topic> {
    const {
      title,
      description,
      requirements,
      studyReferences,
      specialization,
      maxStudents,
      status, // Extract status
    } = updateTopicInput;

    // Check if topic exists and is not approved
    const currentTopic = await this.findOne(id);
    if (currentTopic.status === 'approved') {
      // Optional: Allow changing status back to pending/rejected if needed?
      // For now, strict block as requested to prevent tampering.
      throw new BadRequestException('Cannot update an approved topic');
    }

    const updates: any = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (requirements) updates.requirements = requirements;
    if (studyReferences) updates.study_references = studyReferences;
    if (specialization) updates.specialization = specialization;
    if (maxStudents) updates.max_students = maxStudents;
    if (status) updates.status = status; // Apply status update

    const { data, error } = await (
      this.supabaseService.getClient().from('topics') as any
    )
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return this.mapToEntity(data);
  }

  async remove(id: string): Promise<boolean> {
    // Check if topic exists and is not approved
    const currentTopic = await this.findOne(id);
    if (currentTopic.status === 'approved') {
      throw new BadRequestException('Cannot delete an approved topic');
    }

    const { error } = await this.supabaseService
      .getClient()
      .from('topics')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  }

  private mapToEntity(data: any): Topic {
    return {
      id: data.id,
      code: data.code,
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      studyReferences: data.study_references,
      teacherId: data.teacher_id,
      approverId: data.approver_id,
      specialization: data.specialization,
      status: data.status,
      maxStudents: data.max_students,
      currentStudents: data.current_students,
      periodId: data.period_id,
      createdAt: data.created_at,
    };
  }
}
