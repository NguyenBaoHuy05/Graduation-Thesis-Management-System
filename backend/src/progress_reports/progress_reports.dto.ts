import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProgressReportInput {
  @Field()
  registrationId: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  planNext: string;

  @Field({ nullable: true })
  fileUrl?: string;
}

@InputType()
export class UpdateProgressReportStatusInput {
  @Field()
  id: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  feedback?: string;
}
