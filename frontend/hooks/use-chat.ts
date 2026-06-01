'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './use-auth';

interface Message {
  id: string;
  content: string;
  projectId: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface UseChatProps {
  projectId: string;
}

export function useChat({ projectId }: UseChatProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const typingTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!user?.id) return;

    const newSocket = io('http://localhost:3000/chat', {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('user-online', user.id);
      newSocket.emit('join-project', { projectId, userId: user.id });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('messages-history', (history: Message[]) => {
      setMessages(history);
    });

    newSocket.on('receive-message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('users-online', (users: string[]) => {
      setOnlineUsers(users);
    });

    newSocket.on('user-typing', ({ userName, isTyping }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(userName);
        } else {
          newSet.delete(userName);
        }
        return newSet;
      });
    });

    setSocket(newSocket);

    return () => {
      if (newSocket.connected) {
        newSocket.emit('leave-project', { projectId, userId: user.id });
      }
      newSocket.disconnect();
    };
  }, [projectId, user?.id]);

  const sendMessage = useCallback((content: string) => {
    if (!socket || !user?.id || !content.trim()) return;
    
    socket.emit('send-message', {
      content: content.trim(),
      projectId,
      senderId: user.id,
    });
  }, [socket, projectId, user?.id]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (!socket || !user?.name) return;
    
    socket.emit('typing', {
      projectId,
      userName: user.name,
      isTyping,
    });
  }, [socket, projectId, user?.name]);

  const handleTyping = useCallback(() => {
    sendTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = window.setTimeout(() => {
      sendTyping(false);
    }, 1000);
  }, [sendTyping]);

  return {
    messages,
    onlineUsers,
    typingUsers,
    isConnected,
    sendMessage,
    handleTyping,
  };
}