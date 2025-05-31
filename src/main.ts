import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DEFAULT_PORT } from './utils/defaults';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home Library Service description')
    .setVersion('1.0')
    .addTag('home-library')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, documentFactory, {
    yamlDocumentUrl: 'swagger/yaml',
  });
  await app.listen(process.env.PORT || DEFAULT_PORT);
}
bootstrap();
