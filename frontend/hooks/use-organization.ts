'use client';

import { useContext } from 'react';

import { OrganizationContext }
  from '@/contexts/organization-context';

export function useOrganization() {
  return useContext(
    OrganizationContext,
  );
}