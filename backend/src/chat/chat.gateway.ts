import {
  WebSocketGateway,

  WebSocketServer,

  SubscribeMessage,

  ConnectedSocket,

  MessageBody,

  OnGatewayConnection,

  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private onlineUsers =
    new Map<string, string>();

  constructor(
    private chatService: ChatService,
  ) {}

  handleConnection(socket: Socket) {
    console.log(
      'Socket conectado:',
      socket.id,
    );
  }

  handleDisconnect(socket: Socket) {
    console.log(
      'Socket desconectado:',
      socket.id,
    );

    for (const [
      userId,
      socketId,
    ] of this.onlineUsers.entries()) {
      if (socketId === socket.id) {
        this.onlineUsers.delete(
          userId,
        );

        break;
      }
    }

    this.server.emit(
      'users-online',

      Array.from(
        this.onlineUsers.keys(),
      ),
    );
  }

  @SubscribeMessage('user-online') 
  handleUserOnline( // método para mostrar que um usuário está online
    @ConnectedSocket()
    socket: Socket,

    @MessageBody()
    userId: string,
  ) {
    this.onlineUsers.set(
      userId,
      socket.id,
    );

    this.server.emit(
      'users-online',

      Array.from(
        this.onlineUsers.keys(),
      ),
    );

    console.log(
      `Usuário online: ${userId}`,
    );
  }

  @SubscribeMessage('join-project')
  handleJoinProject( // método para mostrar que ele se conectou ao projeto 
    @ConnectedSocket()
    socket: Socket,

    @MessageBody()
    projectId: string,
  ) {
    socket.join(
      `project:${projectId}`,
    );

    console.log(
      `Socket entrou no projeto ${projectId}`,
    );

    return {
      joined: true,
    };
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @ConnectedSocket()
    socket: Socket,

    @MessageBody()
    data: {
      content: string;

      projectId: string;

      senderId: string;
    },
  ) {
    const message =
      await this.chatService.createMessage(
        data.content,

        data.projectId,

        data.senderId,
      );

    this.server
      .to(`project:${data.projectId}`)
      .emit(
        'receive-message',

        message,
      );

    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket()
    socket: Socket,

    @MessageBody()
    data: {
      projectId: string;

      userName: string;
    },
  ) {
    socket
      .to(`project:${data.projectId}`)
      .emit(
        'user-typing',

        {
          userName: data.userName,
        },
      );
  }
}