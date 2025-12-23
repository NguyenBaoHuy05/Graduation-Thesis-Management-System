import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  date?: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  isRead?: boolean;

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  message?: string;
}
