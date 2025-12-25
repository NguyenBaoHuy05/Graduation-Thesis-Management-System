import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ThesisRegistration } from './registrations.entity';
import { CreateRegistrationInput } from './registrations.dto';

@Injectable()
export class RegistrationsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(input: CreateRegistrationInput): Promise<ThesisRegistration> {
    const { studentId, topicId, teacherId } = input;

    // 1. Check if already registered
    const { data: existing } = await this.supabaseService
      .getClient()
      .from('thesis_registrations')
      .select('*')
      .eq('student_id', studentId)
      .eq('status', 'registered') // Assuming 'registered' implies active
      .single();

    if (existing) {
      throw new BadRequestException('Bạn đã đăng ký một đề tài rồi.');
    }

    // 2. Check topic availability (Optional but recommended)
    const { data: topic } = await (
      this.supabaseService.getClient().from('topics') as any
    )
      .select('current_students, max_students')
      .eq('id', topicId)
      .single();

    if (topic && topic.current_students >= topic.max_students) {
      throw new BadRequestException('Đề tài đã đủ số lượng sinh viên.');
    }

    // 3. Create Registration
    const { data, error } = await (
      this.supabaseService.getClient().from('thesis_registrations') as any
    )
      .insert([
        {
          student_id: studentId,
          topic_id: topicId,
          teacher_id: teacherId,
          status: 'registered',
          registered_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // 4. Update Topic current_students count
    if (topic) {
      await (this.supabaseService.getClient().from('topics') as any)
        .update({ current_students: topic.current_students + 1 })
        .eq('id', topicId);
    }

    return this.mapToEntity(data);
  }

  async findAll(): Promise<ThesisRegistration[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('thesis_registrations')
      .select('*, student:students(*), topic:topics(*)')
      .order('registered_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data.map((item: any) => this.mapToEntity(item));
  }

  async findByStudent(studentId: string): Promise<ThesisRegistration[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('thesis_registrations')
      .select('*, topic:topics(*)')
      .eq('student_id', studentId);

    if (error) throw new Error(error.message);

    return data.map((item: any) => this.mapToEntity(item));
  }

  async findByTeacher(teacherId: string): Promise<ThesisRegistration[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('thesis_registrations')
      .select('*, student:students(*), topic:topics(*)') // Join with students and topics
      .eq('teacher_id', teacherId);

    if (error) throw new Error(error.message);

    return data.map((item: any) => this.mapToEntity(item));
  }

  private mapToEntity(data: any): ThesisRegistration {
    return {
      id: data.id,
      studentId: data.student_id,
      // @ts-ignore
      student: data.student
        ? {
            id: data.student.id,
            code: data.student.code,
            name: data.student.name,
            class: data.student.class_name,
          }
        : null,
      topicId: data.topic_id,
      // @ts-ignore
      topic: data.topic
        ? {
            id: data.topic.id,
            code: data.topic.code,
            title: data.topic.title,
          }
        : null,
      teacherId: data.teacher_id,
      status: data.status,
      registeredAt: data.registered_at,
      outlineFileUrl: data.outline_file_url,
      outlineSubmittedAt: data.outline_submitted_at,
      outlineFeedback: data.outline_feedback,
      thesisFileUrl: data.thesis_file_url,
      thesisSubmittedAt: data.thesis_submitted_at,
      codeLink: data.code_link,
      score: data.score,
    };
  }

  async submitOutline(
    registrationId: string,
    fileUrl: string,
  ): Promise<ThesisRegistration> {
    const { data, error } = await (
      this.supabaseService.getClient().from('thesis_registrations') as any
    )
      .update({
        outline_file_url: fileUrl,
        outline_submitted_at: new Date().toISOString(),
      })
      .eq('id', registrationId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async submitThesis(
    registrationId: string,
    fileUrl: string,
    codeLink?: string,
  ): Promise<ThesisRegistration> {
    const { data, error } = await (
      this.supabaseService.getClient().from('thesis_registrations') as any
    )
      .update({
        thesis_file_url: fileUrl,
        code_link: codeLink,
        thesis_submitted_at: new Date().toISOString(),
        status: 'submitted',
      })
      .eq('id', registrationId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async reviewOutline(
    registrationId: string,
    status: string,
    feedback: string,
  ): Promise<ThesisRegistration> {
    const { data, error } = await (
      this.supabaseService.getClient().from('thesis_registrations') as any
    )
      .update({
        status: status, // e.g. 'outline_approved', 'outline_rejected'
        outline_feedback: feedback,
      })
      .eq('id', registrationId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async reviewThesis(
    registrationId: string,
    status: string,
    score?: number,
  ): Promise<ThesisRegistration> {
    const { data: registration } = await (
      this.supabaseService.getClient().from('thesis_registrations') as any
    )
      .select('student_id')
      .eq('id', registrationId)
      .single();

    if (registration) {
      // Create record in plagiarism_checks
      const checkStatus =
        status === 'defense_ready' || status === 'defense_registered'
          ? 'passed'
          : 'failed';

      await (
        this.supabaseService.getClient().from('plagiarism_checks') as any
      ).insert([
        {
          student_id: registration.student_id,
          registration_id: registrationId,
          similarity_percentage: score,
          check_date: new Date().toISOString(),
          status: checkStatus,
          feedback:
            status === 'thesis_rejected'
              ? 'High similarity score'
              : 'Passed plagiarism check',
        },
      ]);
    }

    const { data, error } = await (
      this.supabaseService.getClient().from('thesis_registrations') as any
    )
      .update({
        status: status,
        score: score,
      })
      .eq('id', registrationId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async inviteStudent(
    topicId: string,
    studentId: string,
    teacherId?: string,
  ): Promise<ThesisRegistration> {
    // We need to fetch teacherId if not provided (it should be the topic's owner)
    let finalTeacherId = teacherId;
    if (!finalTeacherId) {
      const { data: topic } = await (
        this.supabaseService.getClient().from('topics') as any
      )
        .select('teacher_id')
        .eq('id', topicId)
        .single();
      if (topic) finalTeacherId = topic.teacher_id;
    }

    if (!finalTeacherId)
      throw new BadRequestException('Topic or Teacher not found');

    // Create registration (this handles duplication checks and max_student checks)
    const registration = await this.create({
      studentId,
      topicId,
      teacherId: finalTeacherId,
    });

    // 2. Send Notification
    await this.notificationsService.create({
      title: 'Bạn đã được thêm vào đề tài',
      content: `Giảng viên đã thêm bạn vào đề tài. Vui lòng kiểm tra thông tin.`,
      type: 'success',
      date: new Date().toISOString(),
      is_read: false,
    });

    return registration;
  }

  async registerForDefense(
    registrationId: string,
  ): Promise<ThesisRegistration> {
    const { data, error } = await (
      this.supabaseService.getClient().from('thesis_registrations') as any
    )
      .update({
        status: 'defense_registered', // Phase 3 submitted status
      })
      .eq('id', registrationId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }
}
