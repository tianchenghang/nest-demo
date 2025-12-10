import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ParseArrayPipe,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePeopleDto } from './dto/create-people.dto';
import { UpdatePeopleDto } from './dto/update-people.dto';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  create(@Body() createPeopleDto: CreatePeopleDto) {
    return this.peopleService.create(createPeopleDto);
  }

  @Get()
  findAll(
    @Query('partialName') partialName: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ) {
    return this.peopleService.findAll({ partialName, page, pageSize });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePeopleDto: UpdatePeopleDto,
  ) {
    return this.peopleService.update(id, updatePeopleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.peopleService.remove(id);
  }

  @Post('email')
  addEmail(
    @Body('peopleId', ParseIntPipe) peopleId: number,
    @Body('addr') addr: string,
  ) {
    console.log('[addEmail] peopleId:', peopleId);
    console.log('[addEmail] addr:', addr);
    return this.peopleService.addEmail(peopleId, addr);
  }

  @Post('swapEmailAddr')
  swapEmailAddr(@Body(ParseArrayPipe) addrList: string[]) {
    return this.peopleService.swapEmail(addrList[0], addrList[1]);
  }
}
