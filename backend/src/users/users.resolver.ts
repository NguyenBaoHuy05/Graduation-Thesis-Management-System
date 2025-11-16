// Các decorator và kiểu bên dưới đến từ `@nestjs/graphql` — chúng liên kết
// class/typescript với GraphQL schema (tự động sinh SDL từ decorators).
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './user.entity';
import { UsersService } from './users.service';

/**
 * UsersResolver
 * - `@Resolver(() => User)` đánh dấu class này là resolver cho GraphQL type `User`.
 * - Resolver chứa các hàm xử lý cho các root fields trong schema: queries và mutations.
 */
@Resolver(() => User)
export class UsersResolver {
  // UsersService được inject bằng constructor injection của NestJS.
  // Service này chứa logic truy xuất dữ liệu (DB, API, v.v.). Resolver chỉ
  // chịu trách nhiệm nhận request GraphQL và chuyển tiếp tới service.
  constructor(private usersService: UsersService) {}

  /**
   * Query `users`: trả về mảng `User`
   * - `@Query(() => [User])` định nghĩa GraphQL query trả về danh sách User.
   * - Hàm trả về `Promise<User[]>` vì thao tác có thể bất đồng bộ (DB call).
   */
  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * Query `user(id: String)`: trả về 1 User hoặc null
   * - `@Query(() => User, { nullable: true })` cho phép trả về null nếu không
   *   tìm thấy user (tránh trả lỗi không cần thiết).
   * - `@Args('id')` lấy argument `id` từ request GraphQL.
   */
  @Query(() => User, { nullable: true })
  async user(@Args('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  /**
   * Mutation `createUser(email, name)`: tạo một User mới
   * - `@Mutation(() => User)` định nghĩa mutation trả về object `User` vừa tạo.
   * - Các tham số mutation được lấy bằng `@Args(...)`.
   * - Lưu ý: hiện tại không có validation; trong thực tế nên validate email,
   *   kiểm tra duplicate, hoặc sử dụng DTO với `class-validator`.
   */
  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('name') name: string,
  ): Promise<User> {
    return this.usersService.create(email, name);
  }
}
