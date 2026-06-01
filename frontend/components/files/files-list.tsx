
'use client';

import { useState, useEffect } from 'react';
import { Download, Trash2, Calendar, User, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getProjectFiles, downloadFile, deleteFile, formatFileSize, getFileIcon, FileData } from '@/services/file.service';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface FilesListProps {
  projectId: string;
  refreshTrigger?: number;
}

export function FilesList({ projectId, refreshTrigger = 0 }: FilesListProps) { // lista de todos os arquivos de um projeto 
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileToDelete, setFileToDelete] = useState<FileData | null>(null);

  const loadFiles = async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await getProjectFiles(projectId);
      setFiles(data);
    } catch (error) {
      console.error('Erro ao carregar arquivos:', error);
      toast.error('Erro ao carregar arquivos');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file: FileData) => {
    try {
      toast.info(`Baixando ${file.originalName}...`);
      await downloadFile(file.id, file.originalName);
      toast.success(`Download concluído!`);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      toast.error('Erro ao baixar arquivo');
    }
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;
    try {
      await deleteFile(fileToDelete.id);
      toast.success(`Arquivo "${fileToDelete.originalName}" removido`);
      await loadFiles();
      setFileToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      toast.error('Erro ao deletar arquivo');
    }
  };

  const formatDate = (date: string) => {
    if (!date) return 'recentemente';
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
  };

  const getImagePreviewUrl = (file: FileData) => `http://localhost:3000/files/${file.id}/download`;
  const isImage = (mimetype: string) => mimetype?.startsWith('image/') || false;

  useEffect(() => {
    loadFiles();
  }, [projectId, refreshTrigger]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📎</div>
        <h3 className="text-lg font-semibold">Nenhum arquivo</h3>
        <p className="text-sm text-muted-foreground mt-1">Envie arquivos para compartilhar com a equipe</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-2 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Total: {files.length} arquivo(s)</p>
        <Button variant="ghost" size="sm" onClick={loadFiles}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="h-[400px]">
        <div className="space-y-2 pr-4">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 rounded-lg border hover:shadow-md transition">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {isImage(file.mimetype) ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden">
                        <img src={getImagePreviewUrl(file)} alt={file.originalName} className="w-full h-full object-cover" />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle className="sr-only">Preview - {file.originalName}</DialogTitle>
                      </DialogHeader>
                      <img src={getImagePreviewUrl(file)} alt={file.originalName} className="w-full rounded" />
                      <p className="text-center text-sm mt-2">{file.originalName}</p>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="text-3xl w-10 h-10 flex items-center justify-center">{getFileIcon(file.mimetype)}</div>
                )}
                
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{file.originalName}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                    <span>{formatFileSize(file.size)}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(file.createdAt)}</span>
                    {file.uploadedBy && <span className="flex items-center gap-1"><User className="h-3 w-3" />{file.uploadedBy.name}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleDownload(file)} title="Baixar">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setFileToDelete(file)} className="text-red-600" title="Excluir">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <AlertDialog open={!!fileToDelete} onOpenChange={() => setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir arquivo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{fileToDelete?.originalName}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}