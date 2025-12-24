import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class RegistrationStudent {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  code: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  class?: string;
}

@ObjectType()
export class RegistrationTopic {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  code?: string;

  @Field(() => String)
  title: string;
}

@ObjectType()
export class ThesisRegistration {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  studentId: string;

  @Field(() => RegistrationStudent, { nullable: true })
  student?: RegistrationStudent; // Added this

  @Field(() => String)
  topicId: string;

  @Field(() => RegistrationTopic, { nullable: true })
  topic?: RegistrationTopic; // Added this

  @Field(() => String)
  teacherId: string;

  @Field(() => String)
  status: string; // 'registered' | 'cancelled' | 'approved' | ...

  @Field(() => String)
  registeredAt: string;

  @Field(() => String, { nullable: true })
  outlineFileUrl?: string;

  @Field(() => String, { nullable: true })
  outlineSubmittedAt?: string;

  @Field(() => String, { nullable: true })
  outlineFeedback?: string;

  @Field(() => String, { nullable: true })
  thesisFileUrl?: string;

  @Field(() => String, { nullable: true })
  thesisSubmittedAt?: string;

  @Field(() => String, { nullable: true })
  codeLink?: string;

  @Field(() => Number, { nullable: true })
  score?: number;
}
