import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import {
  FileInterceptor, // 单个文件上传
  // FilesInterceptor, // 多个文件上传
} from '@nestjs/platform-express';
import { join } from 'path';
import { readdirSync } from 'fs';
import type { Response as ExpressResponse } from 'express';
import { zip } from 'compressing';

@Controller({
  path: 'upload',
  version: '1',
})
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // 文件上传
  @UseInterceptors(FileInterceptor('entity' /** fieldName */))
  @Post('single')
  upload(@UploadedFile() file: Express.Multer.File) {
    const uploadDir = join(__dirname, '../static');
    const items = readdirSync(uploadDir, { recursive: true });
    return { file, items };
  }

  // 文件下载
  @Get('download')
  download(@Query('filename') filename: string, @Res() res: ExpressResponse) {
    const url = join(__dirname, `../static/${filename}`);
    res.download(url);
  }

  // 流式下载
  // pnpm add compressing
  @Get('stream')
  downloadStream(
    @Query('filename') filename: string,
    @Res() res: ExpressResponse,
  ) {
    const stream = new zip.Stream();
    const url = join(__dirname, `../static/${filename}`);
    stream.addEntry(url);
    res.setHeader('Content-Type', 'application/octet-stream');
    stream.pipe(res);
  }
}
