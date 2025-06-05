
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Movement {
  id: string;
  type: string;
  quantity: number;
  description: string;
  created_at: string;
  products?: {
    name: string;
    sku: string;
    active: boolean;
  };
}

interface RecentMovementsListProps {
  movements: Movement[];
}

export const RecentMovementsList: React.FC<RecentMovementsListProps> = ({ movements }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimenti Recenti</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {movements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nessun movimento registrato
            </div>
          ) : (
            movements.map((movement) => (
              <div key={movement.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      movement.type === 'carico' ? 'bg-green-500' : 
                      movement.type === 'assemblaggio' ? 'bg-blue-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">
                        {movement.products?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {movement.products?.sku} • {new Date(movement.created_at).toLocaleDateString('it-IT')}
                      </p>
                      {movement.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {movement.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={movement.quantity > 0 ? "default" : "destructive"}>
                    {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
