import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import {
  Handler,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ResponseInterceptor } from './response/response.interceptor';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';
import enableSwagger from './enable-swagger';
// import { DemoGuard } from './demo/demo.guard';

const globalMiddleware: Handler = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  console.log(req.originalUrl);
  next();
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  // app.setGlobalPrefix('api');

  app.use(
    session({
      secret: '161043261',
      rolling: true,
      name: '161043261.sid',
      cookie: {
        httpOnly: true, // 预防 XSS
        maxAge: 1000 * 60 * 60 * 24, // 24h
      },
    }),
  );

  app.use(globalMiddleware);
  app.useStaticAssets(join(__dirname, 'static'));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalGuards(new DemoGuard());

  enableSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
