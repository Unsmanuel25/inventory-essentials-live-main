
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  current_stock: number;
  min_stock: number;
}

interface LowStockCardProps {
  lowStockProducts: Product[];
}

export const LowStockCard: React.FC<LowStockCardProps> = ({ lowStockProducts }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Scorte Basse
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockProducts.length === 0 ? (
            <p className="text-center py-4 text-gray-500">Nessun prodotto sotto soglia</p>
          ) : (
            lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    Giacenza: {product.current_stock} / Min: {product.min_stock}
                  </p>
                </div>
                <Badge style={{ backgroundColor: '#DC3545' }} className="text-white hover:opacity-90">Critico</Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
