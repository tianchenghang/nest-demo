import { Controller, Get, Query, UseGuards, Version } from '@nestjs/common';
import { DemoGuard } from './demo.guard';
import { Whitelist } from 'src/whitelist/whitelist.decorator';
import { RequestUrl } from 'src/request-url/request-url.decorator';

@Controller('demo')
@UseGuards(DemoGuard)
export class DemoController {
  // curl http://localhost:3000/demo?role=user
  @Get()
  // @SetMetadata('whitelist', ['admin', 'user']) // [!code --]
  @Whitelist('admin', 'user') // [!code ++]
  testGuard(
    @Query() params: unknown,
    @RequestUrl()
    requestUrl: string,
  ) {
    return { params, requestUrl };
  }

  // curl http://localhost:3000/v2/demo?role=user
  @Get()
  @Version('2')
  testGuard2(
    @Query() params: unknown,
    // [RequestUrl] data: { method: 'GET', version: '2' }
    @RequestUrl({ method: 'GET', version: '2' }) requestUrl: string,
  ) {
    return { params, requestUrl };
  }
}
