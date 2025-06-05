
import React from 'react';
import { Package, Calendar, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface IncomingOrder {
  id: string;
  product_id: string;
  ordered_quantity: number;
  expected_arrival_date?: string;
  notes?: string;
  status: string;
  products?: {
    name: string;
    sku: string;
    unit: string;
  };
}

interface IncomingOrdersListProps {
  orders: IncomingOrder[];
  processingOrders: Set<string>;
  onMarkAsArrived: (orderId: string, productId: string, quantity: number, productName: string) => void;
}

export const IncomingOrdersList: React.FC<IncomingOrdersListProps> = ({
  orders,
  processingOrders,
  onMarkAsArrived
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Ordini in Arrivo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nessun ordine in arrivo
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{order.products?.name}</h3>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div>SKU: {order.products?.sku}</div>
                      <div>Quantità: {order.ordered_quantity} {order.products?.unit}</div>
                      {order.expected_arrival_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Previsto: {new Date(order.expected_arrival_date).toLocaleDateString('it-IT')}
                        </div>
                      )}
                      {order.notes && (
                        <div className="text-xs">Note: {order.notes}</div>
                      )}
                    </div>
                    <Badge variant="outline" className="mt-2">
                      {order.status}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => onMarkAsArrived(
                      order.id, 
                      order.product_id!, 
                      order.ordered_quantity, 
                      order.products?.name || ''
                    )}
                    disabled={processingOrders.has(order.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    {processingOrders.has(order.id) ? 'Elaborando...' : 'Arrivato'}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
