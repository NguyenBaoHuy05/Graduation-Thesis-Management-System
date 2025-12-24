import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateRegistrationInput {
  @Field()
  studentId: string;

  @Field()
  topicId: string;

  @Field()
  teacherId: string;
}
