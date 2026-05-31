// hooks/use-notifications.ts
'use client';

import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './use-auth';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  userId: string;
  createdAt: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Carregar notificações do backend
  const loadNotifications = async () => {
    if (!user?.id) return;

    try {
      const response = await api.get('/notifications');
      const data = response.data?.data || response.data;
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  // Marcar notificação como lida
  const markAsRead = async (notificationId: string) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    for (const notification of unreadNotifications) {
      await markAsRead(notification.id);
    }
  };

  // Testar notificação
  const testNotification = async () => {
    try {
      await api.post('/notifications/test');
      toast.success('Notificação de teste enviada!');
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error);
      toast.error('Erro ao enviar notificação de teste');
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    // Conectar ao WebSocket
    const newSocket = io('http://localhost:3000', {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Notifications socket connected');
      setIsConnected(true);
      newSocket.emit('join', user.id);
    });

    newSocket.on('disconnect', () => {
      console.log('Notifications socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('notification', (notification: Notification) => {
      console.log('Nova notificação recebida:', notification);
      
      // Adicionar à lista
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Mostrar toast
      toast.info(notification.title, {
        description: notification.message,
        duration: 5000,
      });
    });

    setSocket(newSocket);
    loadNotifications();

    return () => {
      newSocket.disconnect();
    };
  }, [user?.id]);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    loadNotifications,
    testNotification,
  };
}