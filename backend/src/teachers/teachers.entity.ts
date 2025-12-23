import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class Teacher {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  userId?: string;

  @Field()
  code: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  dateOfBirth?: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  title?: string;

  @Field(() => Float, { nullable: true })
  titleCoefficient?: number;

  @Field(() => Int, { nullable: true })
  maxTheses?: number;

  @Field(() => Int, { nullable: true })
  currentTheses?: number;

  @Field({ nullable: true })
  specialization?: string;
}
