import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// const __dirname= fileURLToPath(import.meta.url);
// const __filename = dirname(dirname__)

const uploadDir = join(__dirname, '../static');
if (existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, callback) => {
          const fname = `${Date.now()}${extname(file.originalname)}`;
          return callback(null /** error */, fname);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
