import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem('access_token');

      const activeOrganization =
        localStorage.getItem(
          'active_organization_id',
        );

      console.log(
        'TOKEN ENVIADO:',
        token,
      );

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }

      if (activeOrganization) {
        config.headers[
          'x-organization-id'
        ] = activeOrganization;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);