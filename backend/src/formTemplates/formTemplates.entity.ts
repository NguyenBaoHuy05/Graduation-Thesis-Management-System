import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class PeriodMilestone {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  startDate: string;

  @Field({ nullable: true })
  endDate?: string;

  @Field()
  type: string;
}

@ObjectType()
export class ThesisPeriod {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ name: 'academicYear' })
  academic_year: string;

  @Field()
  status: string;

  @Field({ name: 'startDate' })
  start_date: string;

  @Field({ name: 'endDate' })
  end_date: string;

  @Field(() => Int, { name: 'maxGroupSize' })
  max_group_size: number;

  @Field(() => [PeriodMilestone], { nullable: 'itemsAndList' })
  milestones: PeriodMilestone[];

  @Field({ name: 'createdAt' })
  created_at: string;
}
