import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

// pnpm add class-validator class-transformer
export class CreateLoginDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 16, {
    message: '4 <= name.length <= 16',
  })
  name: string;
  @IsNumber()
  age: number;
}
