import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

export const RequestUrl = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    console.log('[RequestUrl] data:', data);
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    return request.url;
  },
);
