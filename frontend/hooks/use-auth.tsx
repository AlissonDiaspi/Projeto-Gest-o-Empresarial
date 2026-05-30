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

        setUser(
          response.data.data,
        );
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

      console.log(
        'LOGIN RESPONSE:',
        response.data,
      );

      const token =
        response.data.data.access_token;

      if (!token) {
        throw new Error(
          'Token não retornado pelo backend',
        );
      }

      localStorage.setItem(
        'access_token',
        token,
      );

      const meResponse =
        await api.get('/auth/me');

      setUser(
        meResponse.data.data,
      );

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