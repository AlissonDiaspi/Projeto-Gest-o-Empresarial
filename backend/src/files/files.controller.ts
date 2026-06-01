
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  Get,
  Param,
  Body,
  Delete,
  Res,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesService } from './files.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('files')
export class FilesController {
  constructor(
    private filesService: FilesService,
    private prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', { 
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadFile(// endpoint para envio dos arquivos/imagens
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Body('projectId') projectId?: string,
  ) {
    console.log('Upload - projectId:', projectId);
    const savedFile = await this.filesService.saveFile({
      originalName: file.originalname,
      fileName: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      uploadedById: req.user.id,
      projectId: projectId || null,
    });
    return savedFile;
  }

  @UseGuards(JwtAuthGuard)
  @Get('project/:projectId')
  async getProjectFiles(@Param('projectId') projectId: string) { // endpoint para retornar os arquivos de um projeto
    const files = await this.filesService.getProjectFiles(projectId);
    return { success: true, data: files };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/download')
  async downloadFile(@Param('id') id: string, @Res() res: Response) { // endpoint para baixar um arquivo
    const file = await this.filesService.getFile(id);
    const encodedFileName = encodeURIComponent(file.originalName);
    
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedFileName}`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    
    return res.download(file.path, file.originalName);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteFile(@Param('id') id: string) { // endpoint para deletar um arquivo
    await this.filesService.deleteFile(id);
    return { success: true, message: 'File deleted successfully' };
  }
}