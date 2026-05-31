'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  createOrganization,
} from '@/services/organization.service';

export default function CreateOrganizationPage() {
  const router = useRouter();

  const [name, setName] =
    useState('');

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const organization =
  await createOrganization({
    name,
  });

      localStorage.setItem(
        'active_organization_id',
        organization.id,
      );

      router.push('/');
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          'Erro ao criar organização',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            Criar Organização
          </h1>

          <p className="text-muted-foreground">
            Crie sua primeira organização
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label>
              Nome da organização
            </Label>

            <Input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value,
                )
              }
              placeholder="Minha Empresa"
            />
          </div>

          <Button
            className="w-full"
            disabled={loading}
          >
            {loading
              ? 'Criando...'
              : 'Criar organização'}
          </Button>
        </form>
      </div>
    </main>
  );
}