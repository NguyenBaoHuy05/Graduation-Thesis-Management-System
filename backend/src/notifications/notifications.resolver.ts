import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from './notifications.entity';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Query(() => [Notification], { name: 'notifications' })
  async getNotifications(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @Query(() => Notification, { name: 'notification', nullable: true })
  async getNotification(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Notification> {
    return this.notificationsService.findOne(id);
  }

  @Mutation(() => Notification)
  async createNotification(
    @Args('title') title: string,
    @Args('content', { nullable: true }) content?: string,
    @Args('date', { nullable: true }) date?: string,
    @Args('type', { nullable: true }) type?: string,
    @Args('isRead', { nullable: true }) isRead?: boolean,
    @Args('userId', { nullable: true }) userId?: string,
    @Args('message', { nullable: true }) message?: string,
  ): Promise<Notification> {
    return this.notificationsService.create({
      title,
      content,
      date,
      type,
      is_read: isRead,
      user_id: userId,
      message,
    });
  }

  @Mutation(() => Notification)
  async updateNotification(
    @Args('id', { type: () => ID }) id: string,
    @Args('title', { nullable: true }) title?: string,
    @Args('content', { nullable: true }) content?: string,
    @Args('date', { nullable: true }) date?: string,
    @Args('type', { nullable: true }) type?: string,
    @Args('isRead', { nullable: true }) isRead?: boolean,
    @Args('userId', { nullable: true }) userId?: string,
    @Args('message', { nullable: true }) message?: string,
  ): Promise<Notification> {
    return this.notificationsService.update(id, {
      title,
      content,
      date,
      type,
      is_read: isRead,
      user_id: userId,
      message,
    });
  }

  @Mutation(() => Boolean)
  async deleteNotification(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.notificationsService.delete(id);
  }
}
