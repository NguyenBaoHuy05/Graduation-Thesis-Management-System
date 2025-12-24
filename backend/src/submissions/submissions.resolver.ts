import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SubmissionsService } from './submissions.service';
import { Submission } from './submissions.entity';
import {
  CreateSubmissionInput,
  UpdateSubmissionStatusInput,
} from './submissions.dto';

@Resolver(() => Submission)
export class SubmissionsResolver {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Query(() => [Submission])
  async mySubmissions(
    @Args('registrationId') registrationId: string,
  ): Promise<Submission[]> {
    return this.submissionsService.findByRegistration(registrationId);
  }

  @Query(() => [Submission])
  async teacherSubmissions(
    @Args('teacherId') teacherId: string,
  ): Promise<Submission[]> {
    return this.submissionsService.findByTeacher(teacherId);
  }

  @Mutation(() => Submission)
  async createSubmission(
    @Args('createSubmissionInput') input: CreateSubmissionInput,
  ): Promise<Submission> {
    return this.submissionsService.create(input);
  }

  @Mutation(() => Submission)
  async updateSubmissionStatus(
    @Args('input') input: UpdateSubmissionStatusInput,
  ): Promise<Submission> {
    return this.submissionsService.updateStatus(input);
  }
}
