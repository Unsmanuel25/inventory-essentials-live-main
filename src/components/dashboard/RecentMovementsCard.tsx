
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Movement {
  id: string;
  type: string;
  quantity: number;
  description: string;
  products?: {
    name: string;
  };
}

interface RecentMovementsCardProps {
  recentMovements: Movement[];
}

export const RecentMovementsCard: React.FC<RecentMovementsCardProps> = ({ recentMovements }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimenti Recenti</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentMovements.map((movement) => (
            <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  movement.type === 'carico' ? 'bg-green-500' :
                  movement.type === 'assemblaggio' ? 'bg-blue-500' : 'bg-red-500'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">{movement.description}</p>
                  <p className="text-sm text-gray-600">{movement.products?.name}</p>
                </div>
              </div>
              <Badge variant={movement.quantity > 0 ? "default" : "destructive"}>
                {movement.quantity > 0 ? '+' : ''}{movement.quantity}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
