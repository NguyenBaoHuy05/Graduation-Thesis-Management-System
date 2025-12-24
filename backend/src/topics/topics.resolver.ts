import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TopicsService } from './topics.service';
import { Topic } from './topics.entity';
import { CreateTopicInput, UpdateTopicInput } from './topics.dto';

@Resolver(() => Topic)
export class TopicsResolver {
  constructor(private readonly topicsService: TopicsService) {}

  @Mutation(() => Topic)
  async createTopic(
    @Args('createTopicInput') createTopicInput: CreateTopicInput,
  ) {
    return this.topicsService.create(createTopicInput);
  }

  @Mutation(() => Topic)
  async updateTopic(
    @Args('id') id: string,
    @Args('updateTopicInput') updateTopicInput: UpdateTopicInput,
  ) {
    return this.topicsService.update(id, updateTopicInput);
  }

  @Mutation(() => Boolean)
  async deleteTopic(@Args('id') id: string) {
    return this.topicsService.remove(id);
  }

  @Query(() => [Topic], { name: 'topics' })
  async findAll() {
    return this.topicsService.findAll();
  }

  @Query(() => Topic, { name: 'topic', nullable: true })
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return this.topicsService.findOne(id);
  }

  @Query(() => [Topic], { name: 'teacherTopics' })
  async findByTeacher(@Args('teacherId') teacherId: string) {
    return this.topicsService.findByTeacher(teacherId);
  }
}
