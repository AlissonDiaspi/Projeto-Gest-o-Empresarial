import { api } from '@/lib/axios';

export interface FileData { // classe responsável por pegar tudo de arquivos do backend para o frontend
  id: string;
  originalName: string;
  fileName: string;
  path: string;
  mimetype: string;
  size: number;
  projectId: string | null;
  uploadedById: string;
  uploadedBy?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export async function uploadFile(file: File, projectId: string): Promise<FileData> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('projectId', projectId);
  
  const response = await api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return response.data;
}

export async function getProjectFiles(projectId: string): Promise<FileData[]> {
  try {
    const response = await api.get(`/files/project/${projectId}`);
    
    let files = [];
    
    if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
      files = response.data.data.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      files = response.data.data;
    } else if (Array.isArray(response.data)) {
      files = response.data;
    }
    
    return files;
  } catch (error) {
    console.error('Erro ao buscar arquivos:', error);
    return [];
  }
}

export async function downloadFile(fileId: string, originalName: string): Promise<void> {
  try {
    const response = await api.get(`/files/${fileId}/download`, {
      responseType: 'blob',
    });
    
    const contentType = typeof response.headers['content-type'] === 'string' 
      ? response.headers['content-type'] 
      : 'application/octet-stream';
    
    const blob = new Blob([response.data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', originalName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro no download:', error);
    throw error;
  }
}

export async function deleteFile(fileId: string): Promise<void> {
  await api.delete(`/files/${fileId}`);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileIcon(mimetype: string): string {
  if (mimetype?.startsWith('image/')) return '🖼️';
  if (mimetype === 'application/pdf') return '📄';
  if (mimetype?.startsWith('text/')) return '📝';
  if (mimetype?.startsWith('video/')) return '🎬';
  if (mimetype?.startsWith('audio/')) return '🎵';
  return '📎';
}