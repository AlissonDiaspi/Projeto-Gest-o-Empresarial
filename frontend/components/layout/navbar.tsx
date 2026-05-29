import { Bell } from 'lucide-react';

import { ThemeToggle } from './theme-toggle';

import {
  Avatar,

  AvatarFallback,
} from '@/components/ui/avatar';

export function Navbar() {
  return (
    <header className="flex items-center justify-between border-b bg-background px-8 py-4">
      <div>
        <h2 className="text-2xl font-semibold">
          Dashboard
        </h2>

        <p className="text-sm text-muted-foreground">
          Welcome back 👋
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 hover:bg-muted">
          <Bell className="h-5 w-5" />

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <ThemeToggle />

        <Avatar>
          <AvatarFallback>
            AD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}