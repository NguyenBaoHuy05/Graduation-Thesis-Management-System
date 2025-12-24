import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSubmissionInput {
  @Field()
  registrationId: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [String])
  fileUrls: string[];

  @Field()
  type: string;
}

@InputType()
export class UpdateSubmissionStatusInput {
  @Field()
  id: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  feedback?: string;
}
