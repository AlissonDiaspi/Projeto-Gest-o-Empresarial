import {
  Controller,
  Get,
  Patch,
  Param,
  Req,
  Post,
  UseGuards,
} from '@nestjs/common';

import { NotificationsService } from './notifications.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private notificationsService: NotificationsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findMyNotifications(  // endpoint  para o usuário encontrar suas notificações 
    @Req() req: any,
  ) {
    return this.notificationsService.findByUser(
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':notificationId/read')
  async markAsRead( // endpoint para marcar as notificações como lidas 
    @Param('notificationId')
    notificationId: string,

    @Req() req: any,
  ) {
    return this.notificationsService.markAsRead(
      notificationId,

      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
@Post('test')
async testNotification(
  @Req() req: any,
) {
  return this.notificationsService.create(
    req.user.id,

    'Teste realtime',

    'WebSocket funcionando 🔥',
  );
}

 
}