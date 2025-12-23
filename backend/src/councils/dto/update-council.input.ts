import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateCouncilInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  presidentId?: string;

  @Field({ nullable: true })
  secretaryId?: string;

  @Field({ nullable: true })
  reviewerId?: string;

  @Field({ nullable: true })
  commissionerId?: string;

  @Field(() => [String], { nullable: true })
  memberIds?: string[];

  @Field({ nullable: true })
  date?: string;

  @Field({ nullable: true })
  time?: string;

  @Field({ nullable: true })
  room?: string;

  @Field(() => [String], { nullable: true })
  topicIds?: string[];

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  description?: string;
}
