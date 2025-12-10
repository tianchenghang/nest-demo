import { Inject, Injectable } from '@nestjs/common';
import { type IConfig } from '../config/config.module';

@Injectable()
export class DemoService {
  globalConfig: IConfig;
  dynamicGlobalConfig: IConfig;

  constructor(
    @Inject('global-config') config: IConfig,
    @Inject('dynamic-global-config') config2: IConfig,
  ) {
    this.globalConfig = config;
    this.dynamicGlobalConfig = config2;
  }
}
