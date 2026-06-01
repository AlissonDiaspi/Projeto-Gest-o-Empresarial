
'use client';

import { useState, useEffect } from 'react';
import { Bell, Users, Menu, X } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MembersDialog } from '@/components/members/members-dialog';
import { NotificationsPopover } from '@/components/notifications/notifications-popover';
import { useAuth } from '@/hooks/use-auth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './sidebar';

export function Navbar() {
  const { user } = useAuth();
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('active_organization_id');
    setOrganizationId(id);
  }, []);

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        {/* Mobile menu button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Desktop title */}
        <div className="hidden md:block">
          <h2 className="text-sm font-medium text-muted-foreground">Bem-vindo,</h2>
          <p className="font-semibold">{user?.name || 'Usuário'}</p>
        </div>

        {/* Mobile title */}
        <div className="md:hidden">
          <h2 className="text-sm font-medium">Dashboard</h2>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <NotificationsPopover />

          <ThemeToggle />

          {organizationId && (
            <MembersDialog organizationId={organizationId}>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Users className="h-5 w-5" />
              </Button>
            </MembersDialog>
          )}

          <Avatar className="h-8 w-8 ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}