import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SessionAuthGuard } from '../auth/session-auth.guard';

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Controller('uploads')
export class UploadsController {
  @Post('images')
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    if (file.size > MAX_SIZE) throw new BadRequestException('File too large');
    if (!ALLOWED_TYPES.includes(file.mimetype)) throw new BadRequestException('Unsupported file type');

    return {
      storageKey: `uploads/${Date.now()}-${file.originalname}`,
      mimeType: file.mimetype,
      size: file.size,
      note: 'Wire this key to S3-compatible storage adapter in production.'
    };
  }
}
