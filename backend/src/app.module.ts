// Module decorator và các import cần thiết cho ứng dụng NestJS
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// GraphQL integration (Apollo)
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

// ConfigModule dùng để load biến môi trường (.env). isGlobal=true => module này
// sẽ có sẵn ở toàn ứng dụng, không cần import lại trong module con.
import { ConfigModule } from '@nestjs/config';

// join dùng để xác định đường dẫn file schema được sinh tự động
import { join } from 'path';
import { SupabaseModule } from './supabase/supabase.module';
import { ThesisPeriodsModule } from './thesisPeriods/thesisPeriods.module';
import { FormTemplatesModule } from './formTemplates/formTemplates.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { NotificationsModule } from './notifications/notifications.module';

/**
 * AppModule
 * - Đây là module gốc (root module) của ứng dụng NestJS.
 * - Khai báo các module con, controllers và providers sẽ được đăng ký tại đây.
 */
@Module({
  imports: [
    // ConfigModule: đọc biến môi trường từ .env và cung cấp ConfigService toàn cục
    ConfigModule.forRoot({
      // isGlobal = true khiến module cấu hình được inject tự động cho mọi module khác
      isGlobal: true,
    }),

    // GraphQLModule: cấu hình Apollo server cho ứng dụng
    GraphQLModule.forRoot<ApolloDriverConfig>({
      // dùng Apollo driver để Nest tích hợp với Apollo server
      driver: ApolloDriver,

      // Sinh tự động file schema GraphQL (SDL) vào `src/schema.gql` khi ứng dụng chạy
      // Đây hữu ích để xem hoặc dùng schema tĩnh mà không phải viết thủ công.
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),

      // sortSchema = true sẽ sắp xếp các type/field trong schema theo thứ tự cố định
      // (giúp diff schema nhất quán giữa các lần build)
      sortSchema: true,

      // playground: cho phép sử dụng GraphQL Playground để thử queries (dev only)
      // Nếu deploy production, cân nhắc tắt hoặc bảo vệ endpoint này.
      playground: true,

      // introspection: cho phép client truy vấn schema metadata; cần khi dùng tools
      // như GraphQL Playground hoặc Apollo Studio. Tương tự playground, cân nhắc khi production.
      introspection: true,
    }),
    SupabaseModule,
    ThesisPeriodsModule,
    FormTemplatesModule,
    StudentsModule,
    TeachersModule,
    NotificationsModule,
  ],

  // // Controllers: nơi định nghĩa các route HTTP (nếu có). Ở đây `AppController`
  // // có thể chứa các route REST đơn giản; GraphQL resolvers thường là providers.
  // controllers: [AppController],

  // // Providers: classes cung cấp logic (service, resolver...). `AppService` được
  // // inject vào `AppController` để tách biệt logic và routing.
  // providers: [AppService, User],
})
export class AppModule {}
