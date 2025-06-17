import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggingService } from '../logging.service';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {
    process.on('unhandledRejection', async (err) => {
      const errorMessage =
        err instanceof Error ? err.stack || err : JSON.stringify(err);
      this.loggingService.error(`Unhandled Rejection: ${errorMessage}`);
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (!(err instanceof HttpException)) {
          this.loggingService.error(`Uncaught Exception: ${err.stack || err}`);
        }
        return throwError(() => err);
      }),
    );
  }
}
