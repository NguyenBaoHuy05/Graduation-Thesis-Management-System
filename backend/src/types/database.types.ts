export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          role: 'student' | 'teacher' | 'secretary' | 'head';
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          role: 'student' | 'teacher' | 'secretary' | 'head';
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          role?: 'student' | 'teacher' | 'secretary' | 'head';
          created_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          user_id: string | null;
          code: string;
          name: string;
          email: string;
          phone: string | null;
          class_name: string | null;
          major: string | null;
          gpa: number | null;
          credits_accumulated: number | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          code: string;
          name: string;
          email: string;
          phone?: string | null;
          class_name?: string | null;
          major?: string | null;
          gpa?: number | null;
          credits_accumulated?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          code?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          class_name?: string | null;
          major?: string | null;
          gpa?: number | null;
          credits_accumulated?: number | null;
        };
      };
      teachers: {
        Row: {
          id: string;
          user_id: string | null;
          code: string;
          name: string;
          email: string;
          phone: string | null;
          date_of_birth: string | null;
          gender: 'Nam' | 'Nữ' | null;
          title: string | null;
          title_coefficient: number | null;
          max_theses: number | null;
          current_theses: number | null;
          specialization: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          code: string;
          name: string;
          email: string;
          phone?: string | null;
          date_of_birth?: string | null;
          gender?: 'Nam' | 'Nữ' | null;
          title?: string | null;
          title_coefficient?: number | null;
          max_theses?: number | null;
          current_theses?: number | null;
          specialization?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          code?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          date_of_birth?: string | null;
          gender?: 'Nam' | 'Nữ' | null;
          title?: string | null;
          title_coefficient?: number | null;
          max_theses?: number | null;
          current_theses?: number | null;
          specialization?: string | null;
        };
      };
      heads: {
        Row: {
          id: string;
          user_id: string | null;
          code: string;
          name: string;
          email: string;
          phone: string | null;
          date_of_birth: string | null;
          gender: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          code: string;
          name: string;
          email: string;
          phone?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          code?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
        };
      };
      secretaries: {
        Row: {
          id: string;
          user_id: string | null;
          code: string;
          name: string;
          email: string;
          phone: string | null;
          date_of_birth: string | null;
          gender: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          code: string;
          name: string;
          email: string;
          phone?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          code?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
        };
      };
      thesis_periods: {
        Row: {
          id: string;
          name: string;
          academic_year: string;
          start_date: string;
          end_date: string;
          status: 'planning' | 'active' | 'closed';
          max_group_size: number | null;
          milestones: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          academic_year: string;
          start_date: string;
          end_date: string;
          status: 'planning' | 'active' | 'closed';
          max_group_size?: number | null;
          milestones?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          academic_year?: string;
          start_date?: string;
          end_date?: string;
          status?: 'planning' | 'active' | 'closed';
          max_group_size?: number | null;
          milestones?: Json | null;
          created_at?: string;
        };
      };
      topics: {
        Row: {
          id: string;
          code: string | null;
          title: string;
          description: string | null;
          requirements: string | null;
          study_references: string[] | null;
          teacher_id: string;
          approver_id: string | null;
          specialization: string | null;
          status: 'pending' | 'approved' | 'rejected' | 'assigned';
          max_students: number | null;
          current_students: number | null;
          period_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          code?: string | null;
          title: string;
          description?: string | null;
          requirements?: string | null;
          study_references?: string[] | null;
          teacher_id: string;
          approver_id?: string | null;
          specialization?: string | null;
          status: 'pending' | 'approved' | 'rejected' | 'assigned';
          max_students?: number | null;
          current_students?: number | null;
          period_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string | null;
          title?: string;
          description?: string | null;
          requirements?: string | null;
          study_references?: string[] | null;
          teacher_id?: string;
          approver_id?: string | null;
          specialization?: string | null;
          status?: 'pending' | 'approved' | 'rejected' | 'assigned';
          max_students?: number | null;
          current_students?: number | null;
          period_id?: string;
          created_at?: string;
        };
      };
      councils: {
        Row: {
          id: string;
          name: string;
          president_id: string;
          secretary_id: string;
          reviewer_id: string;
          commissioner_id: string | null;
          member_ids: string[] | null;
          period_id: string;
          date: string | null;
          time: string | null;
          room: string | null;
          topic_ids: string[] | null;
          status: 'draft' | 'published' | 'completed';
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          president_id: string;
          secretary_id: string;
          reviewer_id: string;
          commissioner_id?: string | null;
          member_ids?: string[] | null;
          period_id: string;
          date?: string | null;
          time?: string | null;
          room?: string | null;
          topic_ids?: string[] | null;
          status?: 'draft' | 'published' | 'completed';
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          president_id?: string;
          secretary_id?: string;
          reviewer_id?: string;
          commissioner_id?: string | null;
          member_ids?: string[] | null;
          period_id?: string;
          date?: string | null;
          time?: string | null;
          room?: string | null;
          topic_ids?: string[] | null;
          status?: 'draft' | 'published' | 'completed';
          description?: string | null;
          created_at?: string;
        };
      };
      form_templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          file_url: string;
          type: 'outline' | 'thesis' | 'report' | 'defense_request' | 'other';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          file_url: string;
          type: 'outline' | 'thesis' | 'report' | 'defense_request' | 'other';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          file_url?: string;
          type?: 'outline' | 'thesis' | 'report' | 'defense_request' | 'other';
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          title: string;
          content: string | null;
          date: string | null;
          type: string | null;
          is_read: boolean | null;
          user_id: string | null;
          message: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          content?: string | null;
          date?: string | null;
          type?: string | null;
          is_read?: boolean | null;
          user_id?: string | null;
          message?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string | null;
          date?: string | null;
          type?: string | null;
          is_read?: boolean | null;
          user_id?: string | null;
          message?: string | null;
        };
      };
    };
  };
}
