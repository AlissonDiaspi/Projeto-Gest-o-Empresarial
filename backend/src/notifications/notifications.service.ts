import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway:
    NotificationsGateway,
  ) {}

 async create( // função para criar uma nova notificação
  userId: string,

  title: string,

  message: string,
) {
  const notification =
    await this.prisma.notification.create({ 
      data: {
        userId,

        title,

        message,
      },
    });

  this.notificationsGateway.sendNotification(
    userId,

    notification,
  );

  return notification;
}

  async findByUser(userId: string) { // retorna as notificações daquele usuário 
    return this.prisma.notification.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsRead( // função para marcar uma notificação como lida 
    notificationId: string,

    userId: string,
  ) {
    const notification =
      await this.prisma.notification.findFirst({ // procura a notificação 
        where: {
          id: notificationId,

          userId,
        },
      });

    if (!notification) {
      throw new NotFoundException( // se não achar, lança esse erro 
        'Notification not found',
      );
    }

    return this.prisma.notification.update({ // atualiza o status dela para lida 
      where: {
        id: notificationId,
      },

      data: {
        read: true,
      },
    });
  }
  async deleteAllByUser(userId: string) { // método para deletar as notificações de um projeto 
  return this.prisma.notification.deleteMany({
    where: { userId },
  });
}
}