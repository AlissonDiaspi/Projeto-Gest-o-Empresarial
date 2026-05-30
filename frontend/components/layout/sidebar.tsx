'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Opcional: para deixar o link ativo com destaque

import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  MessageSquare,
  Bell,
} from 'lucide-react';

const links = [
  {
    name: 'Dashboard',
    href: '/', // ✨ CORRIGIDO: Agora aponta exatamente para a sua rota raiz app/page.tsx
    icon: LayoutDashboard,
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: FolderKanban,
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
  },
  {
    name: 'Teams',
    href: '/teams',
    icon: Users,
  },
  {
    name: 'Chat',
    href: '/chat',
    icon: MessageSquare,
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
  },
];

export function Sidebar() {
  const pathname = usePathname(); // Pega a rota atual para estilizar o botão ativo

  return (
    <aside className="w-64 border-r bg-background p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Enterprise
        </h1>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                isActive 
                  ? 'bg-muted font-medium text-foreground' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}