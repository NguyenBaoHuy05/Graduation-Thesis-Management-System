import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Submission {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  registrationId: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => [String]) // Array of file URLs
  fileUrls: string[];

  @Field(() => String)
  type: string; // 'outline', 'progress', 'thesis'

  @Field(() => String)
  status: string; // 'pending', 'approved', 'rejected'

  @Field(() => String, { nullable: true })
  feedback?: string;

  @Field(() => String)
  submittedAt: string;
}
