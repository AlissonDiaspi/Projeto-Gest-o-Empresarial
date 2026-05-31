// services/member.service.ts
import { api } from '@/lib/axios';

export interface Member {
  id: string;        // ID do usuário (userId do backend)
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  membershipId?: string; // ID do relacionamento (opcional)
}

// Listar membros da organização
export async function getMembers(organizationId: string): Promise<Member[]> {
  try {
    const response = await api.get(`/organizations/${organizationId}/members`);
    
    console.log('=== RESPOSTA DO BACKEND ===');
    console.log(response.data);
    
    let membersData = response.data?.data || response.data;
    
    if (!Array.isArray(membersData)) {
      console.error('Resposta não é um array:', membersData);
      return [];
    }
    
    // CORRIGIDO: Mapear usando userId como ID principal
    const mappedMembers = membersData.map((member: any) => ({
      id: member.userId,           // ← USA O USERID, não o id do relacionamento!
      name: member.user?.name || 'Usuário',
      email: member.user?.email || 'sem-email@exemplo.com',
      role: member.role || 'MEMBER',
      membershipId: member.id,     // Guarda o ID do relacionamento se precisar
    }));
    
    console.log('Membros mapeados (com userId correto):', mappedMembers);
    
    return mappedMembers;
  } catch (error) {
    console.error('Erro ao buscar membros:', error);
    throw error;
  }
}

// Convidar/Adicionar membro à organização
export async function inviteMember(
  organizationId: string,
  data: { email: string }
): Promise<Member> {
  const response = await api.post(`/organizations/${organizationId}/members`, {
    email: data.email,
  });
  
  const memberData = response.data?.data || response.data;
  
  return {
    id: memberData.userId || memberData.id,  // Pega o userId
    name: memberData.user?.name || memberData.name || data.email.split('@')[0],
    email: memberData.user?.email || memberData.email || data.email,
    role: memberData.role || 'MEMBER',
  };
}

// Atualizar papel do membro
export async function updateMemberRole(
  organizationId: string,
  memberId: string,  // Agora memberId é o userId
  data: { role: string }
): Promise<Member> {
  // Primeiro precisamos encontrar o membershipId pelo userId
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

// Remover membro da organização
export async function removeMember(
  organizationId: string,
  memberId: string  // Agora memberId é o userId
): Promise<void> {
  // Primeiro precisamos encontrar o membershipId pelo userId
  const members = await getMembers(organizationId);
  const member = members.find(m => m.id === memberId);
  
  if (!member) {
    throw new Error('Membro não encontrado');
  }
  
  await api.delete(`/organizations/${organizationId}/members/${member.membershipId}`);
}