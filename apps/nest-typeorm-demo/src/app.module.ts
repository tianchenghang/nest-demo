import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemoModule } from './demo/demo.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      username: 'user',
      password: 'pass',
      host: 'localhost',
      port: 3333, // "3333:3306"
      database: 'db0',
      // entities: [__dirname + '/**/*.entity{.ts,.js}'], // 加载实体
      autoLoadEntities: true, // 自动加载实体
      synchronize: true, // 自动将 @Entity() 实体类同步到数据库
      retryAttempts: 10,
      retryDelay: 3000,
    }),
    DemoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
