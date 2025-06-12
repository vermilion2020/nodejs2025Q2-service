import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
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
        const responseData = {
          statusCode: res.statusCode,
          body: JSON.parse(body) || body || {},
        };
        console.log('Response:');
        console.log(`Status code: ${responseData.statusCode}`);
        console.log(`Body: ${JSON.stringify(responseData.body)}`);
      } catch (error) {
        console.log('Body is not a valid JSON');
      }
      return rawResponseEnd.apply(res, resArgs);
    };
  }

  async use(req: Request, res: Response, next: NextFunction) {
    this.getResponseData(res);
    console.log(`Request: ${req.method} ${req.url}`);
    console.log(`Body: ${JSON.stringify(req.body)}`);
    console.log(`Params: ${JSON.stringify(req.params)}`);
    next();
  }
}
