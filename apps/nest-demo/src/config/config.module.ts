import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

export interface IConfig {
  baseUrl: string;
}

const globalConfigProvider: Provider = {
  provide: 'global-config',
  useValue: <IConfig>{ baseUrl: '/api/v1' },
};

@Global() // 全局模块
@Module({
  providers: [globalConfigProvider],
  exports: [globalConfigProvider], // 模块导出
})
export class ConfigModule {
  // 动态模块
  static dynamicGlobalConfig(config: IConfig): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'dynamic-global-config',
          useValue: config,
        },
      ],
      exports: ['dynamic-global-config'], // 模块导出
    };
  }
}
