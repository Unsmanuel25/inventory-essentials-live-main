
import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Product {
  id: string;
  name: string;
  sku: string;
  unit: string;
}

interface IncomingOrderForm {
  productId: string;
  orderedQuantity: number;
  orderDate: string;
  expectedArrivalDate: string;
  notes: string;
}

interface OrderFormProps {
  form: IncomingOrderForm;
  products: Product[];
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (field: keyof IncomingOrderForm, value: string | number) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  form,
  products,
  isLoading,
  onSubmit,
  onFormChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Registra Nuovo Ordine
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Prodotto *</Label>
            <select
              id="product"
              value={form.productId}
              onChange={(e) => onFormChange('productId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Seleziona prodotto...</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku}) - {product.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantità Ordinata *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={form.orderedQuantity}
              onChange={(e) => onFormChange('orderedQuantity', parseInt(e.target.value) || 1)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="orderDate">Data Ordine *</Label>
            <Input
              id="orderDate"
              type="date"
              value={form.orderDate}
              onChange={(e) => onFormChange('orderDate', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedDate">Data Prevista Arrivo</Label>
            <Input
              id="expectedDate"
              type="date"
              value={form.expectedArrivalDate}
              onChange={(e) => onFormChange('expectedArrivalDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Note</Label>
            <Input
              id="notes"
              value={form.notes}
              onChange={(e) => onFormChange('notes', e.target.value)}
              placeholder="Note aggiuntive sull'ordine..."
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registra Ordine'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
