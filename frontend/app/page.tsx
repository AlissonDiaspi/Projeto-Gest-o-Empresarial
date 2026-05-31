// app/page.tsx
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useOrganization } from '@/hooks/use-organization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, Users, CheckSquare } from 'lucide-react';

export default function Home() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { activeOrganization, organizations, loading: orgLoading } = useOrganization();

  const isLoading = isAuthLoading || orgLoading;

  return (
    <ProtectedRoute>
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
          <p className="text-sm font-medium animate-pulse text-muted-foreground">
            Carregando sistema...
          </p>
        </div>
      ) : (
        <main className="flex min-h-screen bg-background text-foreground">
          <Sidebar />

          <section className="flex flex-1 flex-col">
            <Navbar />

            <div className="space-y-8 p-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Dashboard
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Bem-vindo de volta, {user?.name || 'Usuário'}! 👋
                </p>
              </div>

              {/* Cards simples sem analytics */}
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Organização Ativa</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{activeOrganization?.name || 'Nenhuma'}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total de Organizações</CardTitle>
                    <FolderKanban className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{organizations.length}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Status</CardTitle>
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">✓ Online</p>
                  </CardContent>
                </Card>
              </div>

              {/* Informações da organização */}
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Sistema</h2>
                
                <div className="mt-6 pt-4 border-t">
                  <h3 className="font-medium mb-3">Funcionalidades disponíveis</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <p className="flex items-center gap-2">✅ Login funcionando</p>
                    <p className="flex items-center gap-2">✅ AuthContext funcionando</p>
                    <p className="flex items-center gap-2">✅ Sessão persistente</p>
                    <p className="flex items-center gap-2">✅ Rotas protegidas</p>
                    <p className="flex items-center gap-2">✅ Organizações</p>
                    <p className="flex items-center gap-2">✅ Projetos</p>
                    <p className="flex items-center gap-2">✅ Tasks</p>
                    <p className="flex items-center gap-2">✅ Kanban</p>
                    <p className="flex items-center gap-2">✅ Times</p>
                    <p className="flex items-center gap-2">✅ Chat Realtime</p>
                    <p className="flex items-center gap-2">✅ Upload de Arquivos</p>
                    <p className="flex items-center gap-2">✅ Notificações</p>
                    <p className="flex items-center gap-2">✅ Analytics por Projeto</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 Dica: Acesse um projeto e clique na aba "Analytics" para ver estatísticas detalhadas do projeto!
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}
    </ProtectedRoute>
  );
}