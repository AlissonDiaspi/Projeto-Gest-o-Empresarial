// app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      
      const response = await api.post('/auth/login', { email, password });
      
      console.log('Resposta:', response.data);
      
      const token = response.data?.data?.access_token;
      
      if (!token) {
        toast.error('Erro ao obter token');
        return;
      }
      
      localStorage.setItem('access_token', token);
      
      // Buscar organizações
      const orgsResponse = await api.get('/organizations');
      const organizations = orgsResponse.data?.data || orgsResponse.data;
      
      if (organizations && organizations.length > 0) {
        localStorage.setItem('active_organization_id', organizations[0].id);
      }
      
      toast.success('Login realizado!');
      router.push('/');
      
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}