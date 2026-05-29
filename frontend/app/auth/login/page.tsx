'use client';

import {
  useState,
} from 'react';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { login } from '@/services/auth.service';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  async function handleLogin(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    console.log({
      email,

      password,
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome Back 👋
          </h1>

          <p className="text-muted-foreground">
            Login to your account
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label>
              Email
            </Label>

            <Input
              type="email"
              placeholder="john@email.com"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value,
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label>
              Password
            </Label>

            <Input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value,
                )
              }
            />
          </div>

          <Button className="w-full">
            Login
          </Button>
        </form>
      </div>
    </main>
  );
}