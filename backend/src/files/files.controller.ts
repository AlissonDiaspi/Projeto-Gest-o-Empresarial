import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { extname } from 'path';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(
    private filesService: FilesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',

        filename: (
          req,
          file,
          callback,
        ) => {
          const uniqueName =
            `${Date.now()}${extname(file.originalname)}`;

          callback(
            null,
            uniqueName,
          );
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,

    @Req()
    req: any,

    @Body('projectId')
    projectId?: string,
  ) {
    return this.filesService.saveFile({
      originalName:
        file.originalname,

      fileName:
        file.filename,

      path:
        file.path,

      mimetype:
        file.mimetype,

      size:
        file.size,

      uploadedById:
        req.user.id,

      projectId,
    });
  }
}