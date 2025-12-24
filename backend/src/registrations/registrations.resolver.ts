import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RegistrationsService } from './registrations.service';
import { ThesisRegistration } from './registrations.entity';
import { CreateRegistrationInput } from './registrations.dto';

@Resolver(() => ThesisRegistration)
export class RegistrationsResolver {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Query(() => [ThesisRegistration])
  async myRegistrations(
    @Args('studentId') studentId: string,
  ): Promise<ThesisRegistration[]> {
    return this.registrationsService.findByStudent(studentId);
  }

  @Query(() => [ThesisRegistration])
  async teacherRegistrations(
    @Args('teacherId') teacherId: string,
  ): Promise<ThesisRegistration[]> {
    return this.registrationsService.findByTeacher(teacherId);
  }

  @Mutation(() => ThesisRegistration)
  async registerTopic(
    @Args('createRegistrationInput') input: CreateRegistrationInput,
  ): Promise<ThesisRegistration> {
    return this.registrationsService.create(input);
  }

  @Mutation(() => ThesisRegistration)
  async submitOutline(
    @Args('registrationId') registrationId: string,
    @Args('fileUrl') fileUrl: string,
  ): Promise<ThesisRegistration> {
    return this.registrationsService.submitOutline(registrationId, fileUrl);
  }

  @Mutation(() => ThesisRegistration)
  async submitThesis(
    @Args('registrationId') registrationId: string,
    @Args('fileUrl') fileUrl: string,
    @Args('codeLink', { nullable: true }) codeLink?: string,
  ): Promise<ThesisRegistration> {
    return this.registrationsService.submitThesis(
      registrationId,
      fileUrl,
      codeLink,
    );
  }
  @Mutation(() => ThesisRegistration)
  async reviewOutline(
    @Args('registrationId') registrationId: string,
    @Args('status') status: string,
    @Args('feedback') feedback: string,
  ): Promise<ThesisRegistration> {
    return this.registrationsService.reviewOutline(
      registrationId,
      status,
      feedback,
    );
  }

  @Mutation(() => ThesisRegistration)
  async reviewThesis(
    @Args('registrationId') registrationId: string,
    @Args('status') status: string,
    @Args('score', { nullable: true }) score?: number,
  ): Promise<ThesisRegistration> {
    return this.registrationsService.reviewThesis(
      registrationId,
      status,
      score,
    );
  }

  @Mutation(() => ThesisRegistration)
  async registerForDefense(
    @Args('registrationId') registrationId: string,
  ): Promise<ThesisRegistration> {
    return this.registrationsService.registerForDefense(registrationId);
  }
}
