import {
  WebSocketGateway,

  WebSocketServer,

  SubscribeMessage,

  OnGatewayConnection,

  OnGatewayDisconnect,

  ConnectedSocket,

  MessageBody,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private onlineUsers = new Map<
    string,
    string
  >();

  handleConnection(socket: Socket) {
    console.log(
      'Usuário conectado:', // coloca o usuário numa sala privada pode-se dizer 
      socket.id,
    );
  }

  handleDisconnect(socket: Socket) {
    console.log(
      'Usuário desconectado:',
      socket.id,
    );

    this.onlineUsers.forEach(
      (value, key) => {
        if (value === socket.id) {
          this.onlineUsers.delete(key);
        }
      },
    );
  }

  @SubscribeMessage('join')
  handleJoinRoom(
    @ConnectedSocket()
    socket: Socket,

    @MessageBody()
    userId: string,
  ) {
    socket.join(`user:${userId}`);

    this.onlineUsers.set(
      userId,
      socket.id,
    );

    console.log(
      `Usuário ${userId} entrou na sala`,
    );

    return {
      connected: true,
    };
  }

  sendNotification(
    userId: string,

    notification: any,
  ) {
    this.server
      .to(`user:${userId}`)
      .emit(
        'notification',

        notification,
      );
  }
}