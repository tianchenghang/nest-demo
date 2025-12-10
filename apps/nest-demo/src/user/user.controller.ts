import {
  Controller,
  Get,
  Post,
  Body,
  Session,
  Res,
  Inject,
} from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { UserService } from './user.service';
import svgCaptcha from 'svg-captcha';

interface ISession {
  cookie: {
    path: string;
    _expires: Date;
    originalMaxAge: number;
    httpOnly: boolean;
  };
  captcha?: {
    text: string;
  };
}
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject('user-service') private readonly userService2: UserService,
    @Inject('injectable-value') private readonly injectedArr: string[],
    @Inject('injectable-factory-method') private readonly returnValue: boolean,
  ) {
    console.log(userService instanceof UserService);
    console.log(userService2 instanceof UserService);
    console.log('userService === userService2:', userService === userService2);
    console.log('injectedArr:', injectedArr);
    console.log('returnValue:', returnValue);
  } // 依赖注入

  // http://localhost:3000/v1/user/captcha
  // pnpm add svg-captcha
  @Get('captcha')
  createCaptcha(@Res() res: ExpressResponse, @Session() session: ISession) {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 200,
      height: 50,
      background: '#4059bf80',
    });
    session.captcha = { text: captcha.text };
    res.send(captcha.data);
  }

  @Post('create')
  createUser(
    @Body() body,
    @Session() session: ISession,
    @Body('captcha') bodyCaptcha: string,
  ) {
    const sessionCaptcha = session.captcha?.text ?? '';
    if (bodyCaptcha.toLowerCase() === sessionCaptcha.toLowerCase()) {
      return { code: 200 };
    }
    return { code: 400 };
  }
}
