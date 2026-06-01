
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock } from 'lucide-react';

interface OverdueAlertProps {
  count: number;
}

export function OverdueAlert({ count }: OverdueAlertProps) {
  if (count === 0) {
    return (
      <Card className="border-green-500 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">Nenhuma task atrasada!</p>
              <p className="text-sm text-green-600">Todas as tasks estão dentro do prazo.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-500 bg-red-50">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="font-medium text-red-800">Atenção!</p>
            <p className="text-sm text-red-600">
              {count} task(s) estão atrasadas. Revise as prioridades!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}