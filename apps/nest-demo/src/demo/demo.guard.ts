import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request as ExpressRequest } from 'express';

@Injectable()
export class DemoGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    const role = request.query.role;
    console.log('[DemoGuard] role:', role);
    const whitelist = this.reflector.get<string[] | undefined>(
      'whitelist',
      context.getHandler(),
    );
    console.log('[DemoGuard] whitelist:', whitelist);
    if (typeof role === 'string' && whitelist && !whitelist.includes(role)) {
      return false;
    }
    return true;
  }
}
