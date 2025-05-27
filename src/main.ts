import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { DEFAULT_PORT } from '../test/utils/defaults';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || DEFAULT_PORT);
}
bootstrap();
