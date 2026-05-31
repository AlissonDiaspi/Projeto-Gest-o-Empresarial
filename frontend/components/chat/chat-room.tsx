// components/chat/chat-room.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Users, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useChat } from '@/hooks/use-chat';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatRoomProps {
  projectId: string;
  projectName: string;
}

export function ChatRoom({ projectId, projectName }: ChatRoomProps) {
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const { messages, onlineUsers, typingUsers, isConnected, sendMessage, handleTyping } = useChat({ projectId });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage(newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: string) => {
    return format(new Date(date), 'HH:mm', { locale: ptBR });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isOwnMessage = (senderId: string) => {
    return senderId === user?.id;
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-900 rounded-lg border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="font-semibold">{projectName}</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{onlineUsers.length} online</span>
            {isConnected ? (
              <Wifi className="h-3 w-3 text-green-500" />
            ) : (
              <WifiOff className="h-3 w-3 text-red-500" />
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma mensagem ainda</p>
              <p className="text-sm">Seja o primeiro a enviar uma mensagem!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${isOwnMessage(message.senderId) ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {getInitials(message.sender.name)}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex-1 ${isOwnMessage(message.senderId) ? 'items-end' : ''}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{message.sender.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 p-3 rounded-lg inline-block max-w-[80%] ${
                    isOwnMessage(message.senderId)
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-800 rounded-bl-none'
                  }`}>
                    {message.content}
                  </p>
                </div>
              </div>
            ))
          )}
          
          {/* Typing indicator */}
          {typingUsers.size > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </div>
              <span>{Array.from(typingUsers).join(', ')} está digitando...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}