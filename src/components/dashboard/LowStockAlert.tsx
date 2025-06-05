
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LowStockAlertProps {
  lowStockCount: number;
}

export const LowStockAlert: React.FC<LowStockAlertProps> = ({ lowStockCount }) => {
  if (lowStockCount === 0) return null;

  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <strong>Attenzione!</strong> Ci sono {lowStockCount} prodotti con scorte basse.
      </AlertDescription>
    </Alert>
  );
};
