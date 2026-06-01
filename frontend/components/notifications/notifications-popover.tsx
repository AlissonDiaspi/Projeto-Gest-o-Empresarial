
'use client';

import { useState } from 'react';
import { Bell, BellOff, CheckCheck, Trash2, Sparkles } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

export function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    isConnected, 
    markAsRead, 
    markAllAsRead, 
    clearAllNotifications,
    testNotification 
  } = useNotifications();

  const formatTime = (date: string) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  const getInitials = (title: string) => {
    return title.charAt(0).toUpperCase();
  };

  const handleClearAll = async () => {
    await clearAllNotifications();
    setShowClearDialog(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="relative rounded-full p-2 hover:bg-muted transition-all duration-200">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-[10px] font-bold text-white shadow-md">
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
        <PopoverContent className="w-96 p-0 rounded-xl shadow-xl border-0 bg-white dark:bg-gray-900 overflow-hidden" align="end">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-white" />
                <h4 className="font-semibold text-white">Notificações</h4>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">
                    {unreadCount} não lida(s)
                  </Badge>
                )}
              </div>
              <div className="flex gap-1">
                {notifications.length > 0 && unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-7 px-2 text-xs text-white hover:bg-white/20"
                  >
                    <CheckCheck className="mr-1 h-3 w-3" />
                    Marcar todas
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowClearDialog(true)}
                    className="h-7 w-7 text-white hover:bg-white/20"
                    title="Limpar todas as notificações"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={testNotification}
                  className="h-7 px-2 text-xs text-white hover:bg-white/20"
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  Testar
                </Button>
              </div>
            </div>
          </div>

          {/* Lista de notificações */}
          <ScrollArea className="h-[450px]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Nenhuma notificação
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Quando houver novidades, aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                      !notification.read && "bg-blue-50/50 dark:bg-blue-950/30"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-blue-500/20">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                          {getInitials(notification.title)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {notification.title}
                          </p>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                              Não lida
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer com status de conexão */}
          <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-2 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                )} />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {isConnected ? "Conectado em tempo real" : "Desconectado"}
                </span>
              </div>
              {notifications.length > 0 && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {notifications.length} no total
                </span>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">Limpar todas as notificações</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              Tem certeza que deseja remover todas as notificações?
              <br />
              <span className="text-sm text-red-500">Esta ação não pode ser desfeita.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg">
              Sim, limpar tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}