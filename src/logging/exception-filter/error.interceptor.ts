import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggingService } from '../logging.service';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {
    process.on('unhandledRejection', async (err) => {
      this.loggingService.error(`Unhandled Rejection. ${err}`);
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        this.loggingService.error(`Uncaught Exception: ${err.message}`);
        return throwError(() => err);
      }),
    );
  }
}
