import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggingService {
  error(message: string) {
    console.log(`Error: ${message}`);
  }

  warn(message: string) {
    console.log(`Warning: ${message}`);
  }
}
