import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class LoginPipe implements PipeTransform {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    console.log('[LoginPipe] value:', value);
    console.log('[LoginPipe] metadata:', metadata);
    if (!metadata.metatype) {
      return value;
    }
    const dto: unknown = plainToInstance(metadata.metatype, value);
    console.log('[LoginPipe] dto:', dto);
    if (typeof dto !== 'object' || dto === null) {
      return value;
    }
    const validationErrors = await validate(dto);
    console.log('[LoginPipe] validationErrors:', validationErrors);
    if (validationErrors.length) {
      throw new HttpException({ validationErrors }, HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
