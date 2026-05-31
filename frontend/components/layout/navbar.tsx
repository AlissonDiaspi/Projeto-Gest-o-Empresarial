// components/layout/navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import { Users, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MembersDialog } from '@/components/members/members-dialog';
import { NotificationsPopover } from '@/components/notifications/notifications-popover';
import { useAuth } from '@/hooks/use-auth';

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('active_organization_id');
    setOrganizationId(id);
  }, []);

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex items-center justify-between border-b bg-background px-8 py-4">
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Welcome back {user?.name || 'User'} 👋
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Botão de notificações */}
        <NotificationsPopover />

        {/* Botão de tema */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Botão Membros */}
        {organizationId && (
          <MembersDialog organizationId={organizationId}>
            <Button variant="ghost" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Membros
            </Button>
          </MembersDialog>
        )}

        {/* Botão Sair */}
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>

        {/* Avatar */}
        <Avatar>
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}