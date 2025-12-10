import { Injectable, NestMiddleware } from '@nestjs/common';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from 'express';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    next();
  }
}
