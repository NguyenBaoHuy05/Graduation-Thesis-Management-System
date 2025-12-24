import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProgressReportsService } from './progress_reports.service';
import { ProgressReport } from './progress_reports.entity';
import {
  CreateProgressReportInput,
  UpdateProgressReportStatusInput,
} from './progress_reports.dto';

@Resolver(() => ProgressReport)
export class ProgressReportsResolver {
  constructor(
    private readonly progressReportsService: ProgressReportsService,
  ) {}

  @Mutation(() => ProgressReport)
  async createProgressReport(
    @Args('input') input: CreateProgressReportInput,
  ): Promise<ProgressReport> {
    return this.progressReportsService.create(input);
  }

  @Query(() => [ProgressReport])
  async myProgressReports(
    @Args('registrationId') registrationId: string,
  ): Promise<ProgressReport[]> {
    return this.progressReportsService.findByRegistration(registrationId);
  }

  @Mutation(() => ProgressReport)
  async updateProgressReportStatus(
    @Args('input') input: UpdateProgressReportStatusInput,
  ): Promise<ProgressReport> {
    return this.progressReportsService.updateStatus(input);
  }
}
