import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async saveFile(data: {
    originalName: string;

    fileName: string;

    path: string;

    mimetype: string;

    size: number;

    uploadedById: string;

    projectId?: string;
  }) {
    return this.prisma.file.create({
      data,
    });
  }
}