import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Timeline {
  @Field(() => ID)
  id: string;

  @Field()
  registrationId: string;

  @Field()
  milestone: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  dueDate?: string;

  @Field()
  status: string; // 'pending' | 'completed'

  @Field({ nullable: true })
  completedAt?: string;

  @Field({ nullable: true })
  feedback?: string;
}
