
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async saveFile(data: { // método para salvar um arquivo dentro de um projeto
    originalName: string;
    fileName: string;
    path: string;
    mimetype: string;
    size: number;
    uploadedById: string;
    projectId?: string | null;
  }) {
    return this.prisma.file.create({
      data: {
        originalName: data.originalName,
        fileName: data.fileName,
        path: data.path,
        mimetype: data.mimetype,
        size: data.size,
        uploadedById: data.uploadedById,
        projectId: data.projectId || null,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getProjectFiles(projectId: string) { // método para retornar os arquivos de um projeto
    return this.prisma.file.findMany({
      where: { projectId },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFile(id: string) {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  async deleteFile(id: string) {
    const file = await this.getFile(id);

    if (existsSync(file.path)) {
      try {
        await unlink(file.path);
      } catch (error) {
        console.error('Error deleting physical file:', error);
      }
    }

    return this.prisma.file.delete({
      where: { id },
    });
  }
}