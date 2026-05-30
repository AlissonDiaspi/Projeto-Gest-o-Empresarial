'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { login as loginService } from '@/services/auth.service';
import { api } from '@/lib/axios';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Exportado corretamente para o seu 'hooks/use-auth.ts' consumir
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Helper rápido para ler o cookie 'token' que seu axios.ts já usa
  const getCookie = (name: string) => {
    if (typeof window === 'undefined') return null;
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
      ?.split('=')[1] || null;
  };

  useEffect(() => {
    async function loadUser() {
      const token = getCookie('token');

      if (token) {
        try {
          // Seu NestJS identifica o usuário pelo Bearer Token enviado pelo interceptor
          const response = await api.get('/auth/me'); 
          setUser(response.data);
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
          logout();
        }
      }
      setIsLoading(false);
    }

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await loginService(email, password);
      
      // Captura as chaves snake_case exatas que o seu NestJS retorna
      const { access_token, refresh_token, user: userData } = data;

      // Grava com path=/ para garantir visibilidade total ao Middleware no servidor
      if (access_token) document.cookie = `token=${access_token}; path=/; SameSite=Lax;`;
      if (refresh_token) document.cookie = `refreshToken=${refresh_token}; path=/; SameSite=Lax;`;

      setUser(userData);
      
      // Corrige o travamento de cache do Next.js redirecionando nativamente para a Home raiz
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Limpa os cookies limpando o escopo raiz
    document.cookie = 'token=; expires=Thu, 01 Jan 1770 00:00:00 UTC; path=/;';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1770 00:00:00 UTC; path=/;';
    setUser(null);
    
    // Redireciona forçando a limpeza de cache para a tela de login
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}