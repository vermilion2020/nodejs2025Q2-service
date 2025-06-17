import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private loggingService: LoggingService;
  constructor() {
    this.loggingService = new LoggingService();
    this.loggingService.setup();
  }

  getResponseData(res: Response) {
    const rawResponse = res.write;
    const rawResponseEnd = res.end;
    const chunkBuffers = [];
    res.write = (...chunks) => {
      const resArgs = [];
      for (let i = 0; i < chunks.length; i++) {
        resArgs[i] = chunks[i];
        if (!resArgs[i]) {
          res.once('drain', res.write);
          i--;
        }
      }
      if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]));
      }
      return rawResponse.apply(res, resArgs);
    };
    res.end = (...chunk) => {
      const resArgs = [];
      for (let i = 0; i < chunk.length; i++) {
        resArgs[i] = chunk[i];
      }
      if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]));
      }
      const body = Buffer.concat(chunkBuffers).toString('utf8');
      try {
        const message = `Response: Status Code: ${res.statusCode} Body: ${JSON.stringify(JSON.parse(body))}`;

        if (res.statusCode >= 500) {
          this.loggingService.error(message);
        } else if (res.statusCode >= 400 && res.statusCode < 500) {
          this.loggingService.warn(message);
        } else {
          this.loggingService.log(message);
        }
      } catch (error) {
        this.loggingService.log(`Response: Status Code: ${res.statusCode}`);
      }
      return rawResponseEnd.apply(res, resArgs);
    };
  }

  async use(req: Request, res: Response, next: NextFunction) {
    this.getResponseData(res);

    this.loggingService.log(
      `Request: ${req.method} ${req.url} Body: ${JSON.stringify(req.body)} Params: ${JSON.stringify(req.params)}`,
    );
    next();
  }
}
