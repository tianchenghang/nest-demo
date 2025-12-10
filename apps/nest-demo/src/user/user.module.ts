import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { LoggerMiddleware } from '../logger/logger.middleware';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'user-service',
      useClass: UserService,
    }, // 自定义注入类
    {
      provide: 'injectable-value',
      useValue: ['React', 'Vue3', 'Angular'],
    }, // 自定义注入值
    {
      provide: 'injectable-factory-method',
      inject: [UserService, 'user-service'],
      async useFactory(userService: UserService, userService2: UserService) {
        return await new Promise((resolve) => {
          setTimeout(() => {
            resolve(userService === userService2);
          }, 0);
        });
      },
    }, // 自定义注入工厂函数
  ], // 提供者
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('v1/user/captcha');

    consumer.apply(LoggerMiddleware).forRoutes({
      path: 'v1/user/captcha',
      method: RequestMethod.GET,
    });

    consumer.apply(LoggerMiddleware).forRoutes(UserController);
  }
}
