
import React from 'react';
import { Package, TrendingDown, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Product {
  id: string;
  name: string;
  sku: string;
  current_stock: number;
  unit: string;
}

interface MovementForm {
  type: 'carico' | 'scarico';
  productId: string;
  quantity: number;
  notes: string;
}

interface MovementFormProps {
  form: MovementForm;
  products: Product[];
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (updates: Partial<MovementForm>) => void;
}

export const MovementFormComponent: React.FC<MovementFormProps> = ({
  form,
  products,
  isLoading,
  onSubmit,
  onFormChange
}) => {
  const selectedProduct = products.find(p => p.id === form.productId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuovo Movimento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo Movimento *</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="carico"
                  checked={form.type === 'carico'}
                  onChange={(e) => onFormChange({ type: e.target.value as 'carico' | 'scarico' })}
                  className="text-emerald-600"
                />
                <Package className="h-4 w-4 text-green-600" />
                <span>Carico</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="scarico"
                  checked={form.type === 'scarico'}
                  onChange={(e) => onFormChange({ type: e.target.value as 'carico' | 'scarico' })}
                  className="text-red-600"
                />
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span>Scarico</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product">Prodotto *</Label>
            <select
              id="product"
              value={form.productId}
              onChange={(e) => onFormChange({ productId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Seleziona prodotto...</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku}) - Stock: {product.current_stock} {product.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantità *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => onFormChange({ quantity: parseInt(e.target.value) || 1 })}
              required
            />
            {selectedProduct && form.type === 'scarico' && form.quantity > selectedProduct.current_stock && (
              <p className="text-sm text-red-600">
                Attenzione: quantità superiore alla giacenza disponibile ({selectedProduct.current_stock})
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Note</Label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(e) => onFormChange({ notes: e.target.value })}
              placeholder="Note aggiuntive..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={!selectedProduct || isLoading}
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Registrando...' : `Registra ${form.type === 'carico' ? 'Carico' : 'Scarico'}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
