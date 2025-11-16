// Các decorator dưới đây đến từ package `@nestjs/graphql` và dùng để
// chuyển class TypeScript thành một GraphQL Object Type (SDL) tự động.
//
// - `@ObjectType()` đánh dấu class là một GraphQL Object (tương tự `type` trong SDL).
// - `@Field()` đánh dấu một property sẽ được phơi ra (expose) trong schema GraphQL.
// - `ID` là scalar đặc biệt trong GraphQL, thường dùng cho khóa định danh.
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  // Trường `id` được đánh dấu là GraphQL ID. Mặc dù kiểu TypeScript là `string`,
  // GraphQL sẽ hiểu đây là scalar ID (có thể serialize dưới dạng string).
  // Dùng `() => ID` bởi vì decorator cần biết type GraphQL (và tránh circular refs).
  @Field(() => ID)
  id: string;

  // Email người dùng — sẽ được expose trong schema như GraphQL `String` (non-nullable).
  // Nếu muốn cho phép null, dùng `@Field({ nullable: true })`.
  @Field()
  email: string;

  // Tên hiển thị của người dùng.
  @Field()
  name: string;

  // Thời điểm tạo user. TypeScript dùng `Date`; khi map sang GraphQL, NestJS
  // thường serialize `Date` thành ISO string (tùy scalar/transform bạn cấu hình).
  // Nếu muốn một scalar DateTime cụ thể, cân nhắc cài đặt custom scalar.
  @Field()
  created_at: string;
}
