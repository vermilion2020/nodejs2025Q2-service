import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DEFAULT_PORT } from './utils/defaults';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'dotenv/config';
import { CustomExceptionFilter } from './logging/exception-filter/exception.filter';
import { LoggingService } from './logging/logging.service';
import { ErrorsInterceptor } from './logging/exception-filter/error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home Library Service description')
    .setVersion('1.0')
    .addTag('home-library')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, documentFactory, {
    yamlDocumentUrl: 'swagger/yaml',
  });

  const loggingService = new LoggingService();
  await loggingService.setup();

  app.useGlobalInterceptors(new ErrorsInterceptor(loggingService));

  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new CustomExceptionFilter(httpAdapterHost));

  await app.listen(process.env.PORT || DEFAULT_PORT);
}

bootstrap();
