import { Controller, Post, Body, Version } from '@nestjs/common';
import { LoginPipe } from './login.pipe';
import { CreateLoginDto } from './dto/create-login.dto';

@Controller('login')
export class LoginController {
  // 使用全局管道 ValidationPipe
  // curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"name": "lark", "age": 23}'
  @Post()
  testCustomPipe(@Body() body: CreateLoginDto) {
    return { body };
  }

  // 使用自定义管道 LoginPipe
  // curl -X POST http://localhost:3000/v2/login -H "Content-Type: application/json" -d '{"name": "lark", "age": 23}'
  // [LoginPipe] value: { name: 'lark', age: 23 }
  // [LoginPipe] metadata: { metatype: [class CreateLoginDto], type: 'body', data: undefined }
  // [LoginPipe] dto: CreateLoginDto { name: 'lark', age: 23 }
  // [LoginPipe] validationErrors: []
  @Post()
  @Version('2')
  testCustomPipe2(@Body(LoginPipe) body: CreateLoginDto) {
    return { body };
  }

  // 使用自定义管道 LoginPipe
  // curl -X POST http://localhost:3000/v3/login -H "Content-Type: application/json" -d '{"name": "lark", "age": 23}'
  // [LoginPipe] value: 23
  // [LoginPipe] metadata: { metatype: [Function: Number], type: 'body', data: 'age' }
  // [LoginPipe] dto: 23
  // [LoginPipe] value: lark
  // [LoginPipe] metadata: { metatype: [Function: String], type: 'body', data: 'name' }
  // [LoginPipe] dto: lark
  @Post()
  @Version('3')
  testCustomPipe3(
    @Body('name', LoginPipe) name: string,
    @Body('age', LoginPipe) age: number,
  ) {
    return { name, age };
  }
}
