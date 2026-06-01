
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getOrganizations, Organization } from '@/services/organization.service';
import { usePathname } from 'next/navigation';

interface OrganizationContextType {
  organizations: Organization[];
  activeOrganization: Organization | null;
  loading: boolean;
  setActiveOrganization: (org: Organization) => void;
  refreshOrganizations: () => Promise<void>;
}

export const OrganizationContext = createContext<OrganizationContextType>({} as OrganizationContextType);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrganization, setActiveOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Verificar se está na página de login
  const isLoginPage = pathname === '/auth/login' || pathname === '/login' || pathname === '/login-simple';

  async function loadOrganizations() {
    // Se estiver na página de login, não carregar nada
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await getOrganizations();
      setOrganizations(data);
      
      const savedOrgId = localStorage.getItem('active_organization_id');
      if (savedOrgId && data.length > 0) {
        const active = data.find(org => org.id === savedOrgId);
        if (active) {
          setActiveOrganization(active);
        } else if (data.length > 0) {
          setActiveOrganization(data[0]);
          localStorage.setItem('active_organization_id', data[0].id);
        }
      } else if (data.length > 0) {
        setActiveOrganization(data[0]);
        localStorage.setItem('active_organization_id', data[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar organizações:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrganizations();
  }, [pathname]);

  const refreshOrganizations = async () => {
    await loadOrganizations();
  };

  const handleSetActiveOrganization = (org: Organization) => {
    setActiveOrganization(org);
    localStorage.setItem('active_organization_id', org.id);
  };

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        activeOrganization,
        loading,
        setActiveOrganization: handleSetActiveOrganization,
        refreshOrganizations,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}