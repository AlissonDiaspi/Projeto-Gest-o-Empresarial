// components/notifications/notifications-popover.tsx
'use client';

import { useState } from 'react';
import { Bell, BellOff, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNotifications } from '@/hooks/use-notifications';
import { cn } from '@/lib/utils';

export function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, isConnected, testNotification } = useNotifications();

  const formatTime = (date: string) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  const getInitials = (title: string) => {
    return title.charAt(0).toUpperCase();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative rounded-full p-2 hover:bg-muted transition">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          {!isConnected && (
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <BellOff className="h-3 w-3 text-red-500" />
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="font-semibold">Notificações</h4>
          <div className="flex gap-1">
            {notifications.length > 0 && unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-8 px-2 text-xs"
              >
                <CheckCheck className="mr-1 h-3 w-3" />
                Marcar todas
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={testNotification}
              className="h-8 px-2 text-xs"
            >
              Testar
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhuma notificação
              </p>
              <p className="text-xs text-muted-foreground">
                Quando houver novidades, aparecerão aqui
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 cursor-pointer hover:bg-muted transition",
                    !notification.read && "bg-blue-50 dark:bg-blue-950/20"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-500 text-white text-xs">
                        {getInitials(notification.title)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}