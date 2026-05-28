import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async createMessage( // método para criar mensagens dentro do chat realtime de um projeto 
    content: string,

    projectId: string,

    senderId: string,
  ) {
    return this.prisma.chatMessage.create({
      data: {
        content,

        projectId,

        senderId,
      },

      include: { // retorna os dados do usuário que mandou
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getMessages(projectId: string) { // para buscar as mensagens no histórico 
    return this.prisma.chatMessage.findMany({
      where: {
        projectId,
      },

      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}