'use client';

import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import {
  Organization,
  getOrganizations,
} from '@/services/organization.service';

interface OrganizationContextData {
  organizations: Organization[];

  activeOrganization:
    Organization | null;

  setActiveOrganization:
    (organization: Organization) => void;

  isLoading: boolean;
}

export const OrganizationContext =
  createContext(
    {} as OrganizationContextData,
  );

interface Props {
  children: ReactNode;
}

export function OrganizationProvider({
  children,
}: Props) {
  const [
    organizations,
    setOrganizations,
  ] = useState<Organization[]>([]);

  const [
    activeOrganization,
    setActiveOrganizationState,
  ] =
    useState<Organization | null>(
      null,
    );

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    loadOrganizations();
  }, []);

  async function loadOrganizations() {
    try {
      const data =
        await getOrganizations();

      setOrganizations(data);

      const savedOrganizationId =
        localStorage.getItem(
          'active_organization_id',
        );

      if (
        savedOrganizationId &&
        data.length > 0
      ) {
        const organization =
          data.find(
            (org) =>
              org.id ===
              savedOrganizationId,
          );

        if (organization) {
          setActiveOrganizationState(
            organization,
          );

          return;
        }
      }

      if (data.length > 0) {
        setActiveOrganizationState(
          data[0],
        );

        localStorage.setItem(
          'active_organization_id',
          data[0].id,
        );
      }
    } catch (error) {
      console.error(
        'Erro ao carregar organizações',
        error,
      );
    } finally {
      setIsLoading(false);
    }
  }

  function setActiveOrganization(
    organization: Organization,
  ) {
    setActiveOrganizationState(
      organization,
    );

    localStorage.setItem(
      'active_organization_id',
      organization.id,
    );
  }

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        activeOrganization,
        setActiveOrganization,
        isLoading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}