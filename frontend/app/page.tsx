'use client';

import { useAuth } from '@/hooks/use-auth';

import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { useOrganization } from '@/hooks/use-organization';

export default function Home() {
  const { user, isLoading } = useAuth();
  const {
    activeOrganization,
    organizations,
  } = useOrganization();


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
                <h1 className="text-5xl font-bold tracking-tight">
                  Enterprise Management 🚀
                </h1>

                <p className="mt-2 text-muted-foreground">
                  Bem-vindo de volta,{' '}
                  {user?.name || 'Usuário'}!
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">
                  Sistema autenticado com sucesso
                </h2>

                <p className="mt-2 text-muted-foreground">
                  Sua autenticação JWT está funcionando
                  corretamente.
                </p>

                <div className="mt-6 space-y-2">
                  <p>
                    ✅ Login funcionando
                  </p>

                  <p>
                    ✅ AuthContext funcionando
                  </p>

                  <p>
                    ✅ Persistência de sessão funcionando
                  </p>

                  <p>
                    ✅ Rotas protegidas funcionando
                  </p>

                  <p>
                    🔄 Próxima etapa: Organizações
                  </p>

                  <p>
                    ⏳ Depois: Projetos
                  </p>

                  <p>
                    ⏳ Depois: Tasks
                  </p>
                  <div className="rounded-lg border p-4">
  <p>
    Organização ativa:
    {activeOrganization?.name}
  </p>

  <p>
    Total de organizações:
    {organizations.length}
  </p>
</div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}
    </ProtectedRoute>
  );
}