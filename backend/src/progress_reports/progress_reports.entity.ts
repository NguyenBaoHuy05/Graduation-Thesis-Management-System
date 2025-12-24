import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ProgressReport {
  @Field(() => ID)
  id: string;

  @Field()
  registrationId: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  planNext: string;

  @Field({ nullable: true })
  fileUrl?: string;

  @Field()
  submittedAt: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  feedback?: string;
}
