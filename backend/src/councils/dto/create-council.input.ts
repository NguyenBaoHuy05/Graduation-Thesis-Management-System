import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCouncilInput {
  @Field()
  name: string;

  @Field()
  presidentId: string;

  @Field()
  secretaryId: string;

  @Field()
  reviewerId: string;

  @Field({ nullable: true })
  commissionerId?: string;

  @Field(() => [String], { nullable: true })
  memberIds?: string[];

  @Field()
  periodId: string;

  @Field(() => [String], { nullable: true })
  topicIds?: string[];

  @Field({ nullable: true })
  description?: string;

  // Status is usually 'draft' on create, so might not need input, or optional
  @Field({ nullable: true })
  status?: string;
}
