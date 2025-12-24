import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTimelineInput {
  @Field()
  registrationId: string;

  @Field()
  milestone: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  dueDate?: string;
}

@InputType()
export class UpdateTimelineInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  milestone?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  dueDate?: string;

  @Field({ nullable: true })
  feedback?: string;
}

@InputType()
export class UpdateTimelineStatusInput {
  @Field()
  id: string;

  @Field()
  status: string;
}
