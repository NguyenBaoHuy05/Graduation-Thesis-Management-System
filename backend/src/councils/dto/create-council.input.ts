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

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  date?: string;

  @Field({ nullable: true })
  time?: string;

  @Field({ nullable: true })
  room?: string;
}
