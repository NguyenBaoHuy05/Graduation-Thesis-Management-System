import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  InputType,
  Field,
} from '@nestjs/graphql';
import { ThesisPeriod } from './formTemplates.entity';
import { ThesisPeriodsService } from './formTemplates.service';

@Resolver(() => ThesisPeriod)
@InputType()
class MilestoneInput {
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

@Resolver(() => ThesisPeriod)
export class ThesisPeriodsResolver {
  constructor(private thesisPeriodsService: ThesisPeriodsService) {}

  @Query(() => [ThesisPeriod])
  async thesisPeriods(): Promise<ThesisPeriod[]> {
    return this.thesisPeriodsService.findAll();
  }

  @Query(() => ThesisPeriod, { nullable: true })
  async thesisPeriod(@Args('id') id: string): Promise<ThesisPeriod> {
    return this.thesisPeriodsService.findOne(id);
  }

  @Mutation(() => ThesisPeriod)
  async createThesisPeriod(
    @Args('name') name: string,
    @Args('academicYear') academicYear: string,
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
    @Args('maxGroupSize', { type: () => Int, nullable: true })
    maxGroupSize?: number,
    @Args('milestones', { type: () => [MilestoneInput], nullable: true })
    milestones?: MilestoneInput[],
  ): Promise<ThesisPeriod> {
    return this.thesisPeriodsService.create({
      name,
      academic_year: academicYear,
      start_date: startDate,
      end_date: endDate,
      status: 'planning', // Default status
      max_group_size: maxGroupSize,
      milestones: milestones ? (milestones as any) : null,
    });
  }

  @Mutation(() => ThesisPeriod)
  async updateThesisPeriod(
    @Args('id') id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('academicYear', { nullable: true }) academicYear?: string,
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
    @Args('status', { nullable: true }) status?: string,
    @Args('maxGroupSize', { type: () => Int, nullable: true })
    maxGroupSize?: number,
    @Args('milestones', { type: () => [MilestoneInput], nullable: true })
    milestones?: MilestoneInput[],
  ): Promise<ThesisPeriod> {
    const payload: any = {};
    if (name) payload.name = name;
    if (academicYear) payload.academic_year = academicYear;
    if (startDate) payload.start_date = startDate;
    if (endDate) payload.end_date = endDate;
    if (status) payload.status = status;
    if (maxGroupSize !== undefined) payload.max_group_size = maxGroupSize;
    if (milestones) payload.milestones = milestones;

    return this.thesisPeriodsService.update(id, payload);
  }

  @Mutation(() => Boolean)
  async deleteThesisPeriod(@Args('id') id: string): Promise<boolean> {
    return this.thesisPeriodsService.delete(id);
  }
}
