import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateTopicInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  requirements?: string;

  @Field(() => [String], { nullable: true })
  studyReferences?: string[];

  @Field()
  teacherId: string;

  @Field()
  specialization: string;

  @Field(() => Int)
  maxStudents: number;

  @Field()
  periodId: string;
}

@InputType()
@InputType()
export class UpdateTopicInput extends PartialType(CreateTopicInput) {
  @Field({ nullable: true })
  status?: string;
}
