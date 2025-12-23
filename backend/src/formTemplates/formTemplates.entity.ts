import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class FormTemplate {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  fileUrl: string;

  @Field(() => String)
  type: 'outline' | 'thesis' | 'report' | 'defense_request' | 'other';
}
