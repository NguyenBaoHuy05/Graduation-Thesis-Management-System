import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Council {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  presidentId: string;

  @Field()
  secretaryId: string;

  @Field()
  reviewerId: string;

  @Field({ nullable: true })
  commissionerId?: string; // Optional member

  @Field(() => [String], { nullable: true })
  memberIds?: string[];

  @Field()
  periodId: string;

  @Field({ nullable: true })
  date?: string;

  @Field({ nullable: true })
  time?: string;

  @Field({ nullable: true })
  room?: string;

  @Field(() => [String], { nullable: true })
  topicIds?: string[];

  @Field()
  status: string; // 'draft' | 'published' | 'completed'

  @Field({ nullable: true })
  description?: string;

  @Field()
  createdAt: string;
}
