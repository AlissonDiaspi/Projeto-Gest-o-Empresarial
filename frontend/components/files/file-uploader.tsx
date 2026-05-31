// frontend/components/files/file-uploader.tsx
'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { uploadFile } from '@/services/file.service';
import { toast } from 'sonner';

interface FileUploaderProps {
  projectId: string;
  onUploadComplete: () => void;
}

export function FileUploader({ projectId, onUploadComplete }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleUpload(files[0]);
    }
  }, []);

  const handleUpload = async (file: File) => {
    if (!projectId) {
      toast.error('ID do projeto não encontrado');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 10MB');
      return;
    }

    setSelectedFile(file);
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      await uploadFile(file, projectId);
      toast.success(`Arquivo "${file.name}" enviado com sucesso!`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploadComplete();
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error(error.response?.data?.message || 'Erro ao enviar arquivo');
    } finally {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
        setSelectedFile(null);
      }, 500);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all
        ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-gray-300 dark:border-gray-700'}
        ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {uploading ? (
        <div className="space-y-4">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-500" />
          <p className="text-sm font-medium">Enviando {selectedFile?.name}...</p>
          <Progress value={progress} className="w-full max-w-md mx-auto" />
        </div>
      ) : (
        <>
          <div className="text-6xl mb-4">{isDragging ? '📂' : '📁'}</div>
          <p className="text-lg font-medium">Arraste e solte seu arquivo aqui</p>
          <p className="text-sm text-muted-foreground mt-1">ou</p>
          <Button variant="outline" className="mt-2" type="button" onClick={triggerFileSelect}>
            <Upload className="mr-2 h-4 w-4" />
            Selecionar arquivo
          </Button>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />
          <p className="text-xs text-muted-foreground mt-4">Máximo 10MB • Imagens, PDF, Documentos</p>
        </>
      )}
    </div>
  );
}