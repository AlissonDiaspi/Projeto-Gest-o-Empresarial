
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
  cors: { origin: '*' },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private onlineUsers = new Map<string, string>(); // userId -> socketId
  private projectUsers = new Map<string, Set<string>>(); // projectId -> Set<userId>

  constructor(private chatService: ChatService) {}

  handleConnection(socket: Socket) {
    console.log('Socket conectado:', socket.id);
  }

  handleDisconnect(socket: Socket) {
    console.log('Socket desconectado:', socket.id);

    // remover usuário de todos os projetos
    for (const [projectId, users] of this.projectUsers.entries()) {
      for (const [userId, socketId] of this.onlineUsers.entries()) {
        if (socketId === socket.id && users.has(userId)) {
          users.delete(userId);
          this.server.to(`project:${projectId}`).emit('users-online', Array.from(users));
          break;
        }
      }
    }

    // remover do mapa de usuários online
    for (const [userId, socketId] of this.onlineUsers.entries()) {
      if (socketId === socket.id) {
        this.onlineUsers.delete(userId);
        break;
      }
    }

    this.server.emit('users-online', Array.from(this.onlineUsers.keys()));
  }

  @SubscribeMessage('user-online')
  handleUserOnline(
    @ConnectedSocket() socket: Socket,
    @MessageBody() userId: string,
  ) {
    this.onlineUsers.set(userId, socket.id);
    this.server.emit('users-online', Array.from(this.onlineUsers.keys()));
    console.log(`Usuário online: ${userId}`);
  }

  @SubscribeMessage('join-project')
  async handleJoinProject(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { projectId: string; userId: string },
  ) {
    socket.join(`project:${data.projectId}`);
    socket.data.userId = data.userId;
    socket.data.projectId = data.projectId;

    // adicionar ao mapa do projeto
    if (!this.projectUsers.has(data.projectId)) {
      this.projectUsers.set(data.projectId, new Set());
    }
    this.projectUsers.get(data.projectId)?.add(data.userId);

    // enviar histórico de mensagens
    const messages = await this.chatService.getMessages(data.projectId);
    socket.emit('messages-history', messages);

    // Enviar lista de usuários online no projeto
    const users = Array.from(this.projectUsers.get(data.projectId) || []);
    this.server.to(`project:${data.projectId}`).emit('users-online', users);

    console.log(`Usuário ${data.userId} entrou no projeto ${data.projectId}`);
  }

  @SubscribeMessage('leave-project')
  handleLeaveProject(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { projectId: string; userId: string },
  ) {
    socket.leave(`project:${data.projectId}`);
    this.projectUsers.get(data.projectId)?.delete(data.userId);

    const users = Array.from(this.projectUsers.get(data.projectId) || []);
    this.server.to(`project:${data.projectId}`).emit('users-online', users);
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: {
      content: string;
      projectId: string;
      senderId: string;
    },
  ) {
    const message = await this.chatService.createMessage(
      data.content,
      data.projectId,
      data.senderId,
    );

    this.server.to(`project:${data.projectId}`).emit('receive-message', message);
    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: {
      projectId: string;
      userName: string;
      isTyping: boolean;
    },
  ) {
    socket.to(`project:${data.projectId}`).emit('user-typing', {
      userName: data.userName,
      isTyping: data.isTyping,
    });
  }
}