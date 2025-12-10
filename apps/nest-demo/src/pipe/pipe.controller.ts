import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';

console.log(uuid());

@Controller('pipe')
export class PipeController {
  @Get(':id')
  test(@Param('id') id: string) {
    return { typeofId: typeof id }; // { typeofId: 'string' }
  }

  @Get('int/:id')
  testParseIntPipe(@Param('id', ParseIntPipe) id: number) {
    return { typeofId: typeof id }; // { typeofId: 'number' }
  }

  @Get('uuid/:uuid')
  testParseUUIDPipe(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return { uuid };
  }
}
