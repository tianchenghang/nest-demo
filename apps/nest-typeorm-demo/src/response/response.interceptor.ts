import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Request as ExpressRequest } from 'express';

interface IRes {
  data: unknown;
  code: number;
  message: string;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IRes> {
    // 前置拦截器
    const req = context.switchToHttp().getRequest<ExpressRequest>();
    console.log(req.url);

    // controller

    // 后置拦截器
    return next.handle().pipe(
      map((data: unknown) => ({
        data,
        code: 200,
        message: 'OK',
      })),
    );
  }
}
