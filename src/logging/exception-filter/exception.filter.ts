import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { LoggingService } from '../logging.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly loggingService: LoggingService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorMessage =
      httpStatus === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'Internal Server Error occurred. Try again later.'
        : exception instanceof Error
          ? exception.message
          : 'Unknown error occurred';
    const responseBody = {
      statusCode: httpStatus,
      message: errorMessage,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
