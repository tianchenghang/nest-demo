import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './entities/people.entity';
import { Email } from './entities/email.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([People, Email]),
    // TypeOrmModule.forFeature([Email]),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule {}
