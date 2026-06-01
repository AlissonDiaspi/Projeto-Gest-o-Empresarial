import { api } from '@/lib/axios';

export async function login( // método para pegar os endpoints da parte de autenticação no backend 
  email: string,

  password: string,
) {
  const response =
    await api.post(
      '/auth/login',

      {
        email,

        password,
      },
    );

  return response.data;
}