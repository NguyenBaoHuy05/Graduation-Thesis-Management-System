import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TimelinesService } from './timelines.service';
import { Timeline } from './timelines.entity';
import {
  CreateTimelineInput,
  UpdateTimelineInput,
  UpdateTimelineStatusInput,
} from './timelines.dto';

@Resolver(() => Timeline)
export class TimelinesResolver {
  constructor(private readonly timelinesService: TimelinesService) {}

  @Mutation(() => Timeline)
  async createTimeline(
    @Args('input') input: CreateTimelineInput,
  ): Promise<Timeline> {
    return this.timelinesService.create(input);
  }

  @Query(() => [Timeline])
  async timelines(
    @Args('registrationId') registrationId: string,
  ): Promise<Timeline[]> {
    return this.timelinesService.findByRegistration(registrationId);
  }

  @Mutation(() => Timeline)
  async updateTimeline(
    @Args('input') input: UpdateTimelineInput,
  ): Promise<Timeline> {
    return this.timelinesService.update(input);
  }

  @Mutation(() => Timeline)
  async updateTimelineStatus(
    @Args('input') input: UpdateTimelineStatusInput,
  ): Promise<Timeline> {
    return this.timelinesService.updateStatus(input);
  }

  @Mutation(() => Boolean)
  async deleteTimeline(@Args('id') id: string): Promise<boolean> {
    return this.timelinesService.delete(id);
  }
}
