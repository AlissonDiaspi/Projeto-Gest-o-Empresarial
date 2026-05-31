'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { api } from '@/lib/axios';

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    credentials: LoginCredentials,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType,
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    async function loadUser() {
      const token =
        localStorage.getItem(
          'access_token',
        );

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response =
          await api.get('/auth/me');

        console.log('Auth/me response:', response.data);
        
        // Tenta diferentes estruturas
        let userData = null;
        if (response.data?.data) {
          userData = response.data.data;
        } else if (response.data?.user) {
          userData = response.data.user;
        } else {
          userData = response.data;
        }
        
        setUser(userData);
      } catch (error) {
        console.error(
          'Erro ao recuperar sessão:',
          error,
        );

        localStorage.removeItem(
          'access_token',
        );

        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  async function login({
    email,
    password,
  }: LoginCredentials) {
    setIsLoading(true);

    try {
      const response =
        await api.post(
          '/auth/login',
          {
            email,
            password,
          },
        );

      console.log('LOGIN RESPONSE COMPLETA:', response.data);
      
      // Tenta diferentes estruturas para o token
      let token = null;
      
      if (response.data?.data?.access_token) {
        token = response.data.data.access_token;
        console.log('Token em response.data.data.access_token');
      } else if (response.data?.access_token) {
        token = response.data.access_token;
        console.log('Token em response.data.access_token');
      } else if (response.data?.token) {
        token = response.data.token;
        console.log('Token em response.data.token');
      }

      if (!token) {
        console.error('Estrutura da resposta:', JSON.stringify(response.data, null, 2));
        throw new Error(
          'Token não retornado pelo backend',
        );
      }

      console.log('Token obtido com sucesso:', token.substring(0, 50) + '...');

      localStorage.setItem(
        'access_token',
        token,
      );

      // Buscar dados do usuário
      const meResponse =
        await api.get('/auth/me');

      console.log('ME Response:', meResponse.data);
      
      // Tenta diferentes estruturas para o usuário
      let userData = null;
      if (meResponse.data?.data) {
        userData = meResponse.data.data;
      } else if (meResponse.data?.user) {
        userData = meResponse.data.user;
      } else {
        userData = meResponse.data;
      }
      
      setUser(userData);

      // Redirecionar
      window.location.href = '/';
    } catch (error) {
      console.error(
        'Erro no login:',
        error,
      );

      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem(
      'access_token',
    );

    localStorage.removeItem(
      'active_organization_id',
    );

    setUser(null);

    window.location.href =
      '/auth/login';
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated:
          !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(
    AuthContext,
  );
}