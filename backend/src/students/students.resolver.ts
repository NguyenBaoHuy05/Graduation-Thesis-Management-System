import { Resolver, Query, Mutation, Args, Float } from '@nestjs/graphql';
import { StudentsService } from './students.service';
import { Student } from './students.entity';

@Resolver(() => Student)
export class StudentsResolver {
  constructor(private readonly studentsService: StudentsService) {}

  @Query(() => [Student])
  async students(): Promise<Student[]> {
    return this.studentsService.findAll();
  }

  @Query(() => Student)
  async student(@Args('id') id: string): Promise<Student> {
    return this.studentsService.findOne(id);
  }

  @Query(() => [Student])
  async studentsWithoutTopic(
    @Args('search', { nullable: true }) search?: string,
  ): Promise<Student[]> {
    return this.studentsService.findStudentsWithoutTopic(search);
  }

  @Mutation(() => Student)
  async createStudent(
    @Args('code') code: string,
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('phone', { nullable: true }) phone?: string,
    @Args('className', { nullable: true }) className?: string,
    @Args('major', { nullable: true }) major?: string,
    @Args('gpa', { type: () => Float, nullable: true }) gpa?: number,
    @Args('creditsAccumulated', { type: () => Float, nullable: true })
    creditsAccumulated?: number,
  ): Promise<Student> {
    return this.studentsService.create({
      code,
      name,
      email,
      phone,
      class_name: className,
      major,
      gpa,
      credits_accumulated: creditsAccumulated,
    });
  }

  @Mutation(() => Student)
  async updateStudent(
    @Args('id') id: string,
    @Args('code', { nullable: true }) code?: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('email', { nullable: true }) email?: string,
    @Args('phone', { nullable: true }) phone?: string,
    @Args('className', { nullable: true }) className?: string,
    @Args('major', { nullable: true }) major?: string,
    @Args('gpa', { type: () => Float, nullable: true }) gpa?: number,
    @Args('creditsAccumulated', { type: () => Float, nullable: true })
    creditsAccumulated?: number,
  ): Promise<Student> {
    const payload: any = {};
    if (code) payload.code = code;
    if (name) payload.name = name;
    if (email) payload.email = email;
    if (phone !== undefined) payload.phone = phone;
    if (className !== undefined) payload.class_name = className;
    if (major !== undefined) payload.major = major;
    if (gpa !== undefined) payload.gpa = gpa;
    if (creditsAccumulated !== undefined)
      payload.credits_accumulated = creditsAccumulated;

    return this.studentsService.update(id, payload);
  }

  @Mutation(() => Boolean)
  async deleteStudent(@Args('id') id: string): Promise<boolean> {
    return this.studentsService.delete(id);
  }
}
