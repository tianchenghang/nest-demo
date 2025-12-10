import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemoModule } from './demo/demo.module';
import { UserModule } from './user/user.module';
import { DemoService } from './demo/demo.service';
import { ConfigModule, type IConfig } from './config/config.module';
import { UploadModule } from './upload/upload.module';
import { PipeModule } from './pipe/pipe.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [
    DemoModule,
    UserModule,
    ConfigModule,
    ConfigModule.dynamicGlobalConfig({ baseUrl: '/api/v2' }),
    UploadModule,
    PipeModule,
    LoginModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    private readonly demoService: DemoService,
    @Inject('global-config') globalConfig: IConfig,
    @Inject('dynamic-global-config') dynamicGlobalConfig: IConfig,
  ) {
    console.log(globalConfig); // { baseUrl: '/api/v1' }
    console.log(dynamicGlobalConfig); // { baseUrl: '/api/v2' }
    console.log(demoService.globalConfig); // { baseUrl: '/api/v1' }
    console.log(demoService.dynamicGlobalConfig); // { baseUrl: '/api/v2' }
    console.log(globalConfig === demoService.globalConfig); // true
    console.log(dynamicGlobalConfig === demoService.dynamicGlobalConfig); // true
  }
}
