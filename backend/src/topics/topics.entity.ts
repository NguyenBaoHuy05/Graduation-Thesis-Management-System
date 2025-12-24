'use client';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Topic {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  code: string | null;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => String, { nullable: true })
  requirements: string | null;

  @Field(() => [String], { nullable: true })
  studyReferences: string[] | null;

  @Field(() => String)
  teacherId: string;

  @Field(() => String, { nullable: true })
  approverId: string | null;

  @Field(() => String, { nullable: true })
  specialization: string | null;

  @Field(() => String)
  status: string; // 'pending' | 'approved' | 'rejected' | 'assigned'

  @Field(() => Int, { nullable: true })
  maxStudents: number | null;

  @Field(() => Int, { nullable: true })
  currentStudents: number | null;

  @Field(() => String)
  periodId: string;

  @Field(() => String)
  createdAt: string;
}
