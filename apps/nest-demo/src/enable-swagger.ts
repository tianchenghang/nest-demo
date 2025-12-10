import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export default function enableSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Nest.js')
    .setDescription('Demo')
    .setVersion('1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}
