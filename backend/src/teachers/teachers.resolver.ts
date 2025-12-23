import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Float,
  Int,
} from '@nestjs/graphql';
import { TeachersService } from './teachers.service';
import { Teacher } from './teachers.entity';

@Resolver(() => Teacher)
export class TeachersResolver {
  constructor(private readonly teachersService: TeachersService) {}

  @Query(() => [Teacher], { name: 'teachers' })
  async getTeachers(): Promise<Teacher[]> {
    return this.teachersService.findAll();
  }

  @Query(() => Teacher, { name: 'teacher', nullable: true })
  async getTeacher(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Teacher> {
    return this.teachersService.findOne(id);
  }

  @Mutation(() => Teacher)
  async createTeacher(
    @Args('code') code: string,
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('phone', { nullable: true }) phone?: string,
    @Args('dateOfBirth', { nullable: true }) dateOfBirth?: string,
    @Args('gender', { nullable: true }) gender?: string,
    @Args('title', { nullable: true }) title?: string,
    @Args('titleCoefficient', { type: () => Float, nullable: true })
    titleCoefficient?: number,
    @Args('maxTheses', { type: () => Int, nullable: true }) maxTheses?: number,
    @Args('currentTheses', { type: () => Int, nullable: true })
    currentTheses?: number,
    @Args('specialization', { nullable: true }) specialization?: string,
  ): Promise<Teacher> {
    return this.teachersService.create({
      code,
      name,
      email,
      phone,
      date_of_birth: dateOfBirth,
      gender: gender as any,
      title,
      title_coefficient: titleCoefficient,
      max_theses: maxTheses,
      current_theses: currentTheses,
      specialization,
    });
  }

  @Mutation(() => Teacher)
  async updateTeacher(
    @Args('id', { type: () => ID }) id: string,
    @Args('code', { nullable: true }) code?: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('email', { nullable: true }) email?: string,
    @Args('phone', { nullable: true }) phone?: string,
    @Args('dateOfBirth', { nullable: true }) dateOfBirth?: string,
    @Args('gender', { nullable: true }) gender?: string,
    @Args('title', { nullable: true }) title?: string,
    @Args('titleCoefficient', { type: () => Float, nullable: true })
    titleCoefficient?: number,
    @Args('maxTheses', { type: () => Int, nullable: true }) maxTheses?: number,
    @Args('currentTheses', { type: () => Int, nullable: true })
    currentTheses?: number,
    @Args('specialization', { nullable: true }) specialization?: string,
  ): Promise<Teacher> {
    return this.teachersService.update(id, {
      code,
      name,
      email,
      phone,
      date_of_birth: dateOfBirth,
      gender: gender as any,
      title,
      title_coefficient: titleCoefficient,
      max_theses: maxTheses,
      current_theses: currentTheses,
      specialization,
    });
  }

  @Mutation(() => Boolean)
  async deleteTeacher(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.teachersService.delete(id);
  }
}
