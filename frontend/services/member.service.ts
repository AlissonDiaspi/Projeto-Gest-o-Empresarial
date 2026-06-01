import { api } from '@/lib/axios';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  membershipId?: string;
} // classe responsável por pegar todos os endpoints do backend relacionados a membros 

export async function getMembers(organizationId: string): Promise<Member[]> {
  try {
    const response = await api.get(`/organizations/${organizationId}/members`);
    
    let membersData = response.data?.data || response.data;
    
    if (!Array.isArray(membersData)) {
      return [];
    }
    
    return membersData.map((member: any) => ({
      id: member.userId,
      name: member.user?.name || 'Usuário',
      email: member.user?.email || 'sem-email@exemplo.com',
      role: member.role || 'MEMBER',
      membershipId: member.id,
    }));
  } catch (error) {
    console.error('Erro ao buscar membros:', error);
    return [];
  }
}

export async function inviteMember(
  organizationId: string,
  data: { email: string }
): Promise<Member> {
  const response = await api.post(`/organizations/${organizationId}/members`, {
    email: data.email,
  });
  
  const memberData = response.data?.data || response.data;
  
  return {
    id: memberData.userId || memberData.id,
    name: memberData.user?.name || memberData.name || data.email.split('@')[0],
    email: memberData.user?.email || memberData.email || data.email,
    role: memberData.role || 'MEMBER',
  };
}

export async function updateMemberRole(
  organizationId: string,
  memberId: string,
  data: { role: string }
): Promise<Member> {
  const members = await getMembers(organizationId);
  const member = members.find(m => m.id === memberId);
  
  if (!member) {
    throw new Error('Membro não encontrado');
  }
  
  const response = await api.patch(
    `/organizations/${organizationId}/members/${member.membershipId}`,
    data
  );
  return response.data?.data || response.data;
}

export async function removeMember(
  organizationId: string,
  memberId: string
): Promise<void> {
  const members = await getMembers(organizationId);
  const member = members.find(m => m.id === memberId);
  
  if (!member) {
    throw new Error('Membro não encontrado');
  }
  
  await api.delete(`/organizations/${organizationId}/members/${member.membershipId}`);
}