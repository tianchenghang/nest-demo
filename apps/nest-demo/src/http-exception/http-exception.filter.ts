import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<ExpressRequest>();
    const response = ctx.getResponse<ExpressResponse>();
    response.status(exception.getStatus()).json({
      data: exception.getResponse(),
      statusCode: exception.getStatus(),
      message: exception.message,
      extra: {
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
