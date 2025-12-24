import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const front_end = process.env.FRONTEND_URL ?? 'http://localhost:3000';

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: front_end,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
