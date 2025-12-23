import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class Student {
  @Field()
  id: string;

  @Field()
  code: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  className?: string;

  @Field({ nullable: true })
  major?: string;

  @Field(() => Float, { nullable: true })
  gpa?: number;

  @Field(() => Float, { nullable: true })
  creditsAccumulated?: number;
}
