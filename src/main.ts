import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
// import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('etag', false);
  const PORT = process.env.PORT;

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // app.useStaticAssets(path.join(__dirname, '../uploads'));

  await app.listen(process.env.PORT);
  console.log(`conneted port ${PORT}`);
}
bootstrap();
