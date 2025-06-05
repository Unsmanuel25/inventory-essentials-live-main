
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Product {
  id: string;
  name: string;
  sku: string;
  current_stock: number;
  nature: string;
}

interface ProductSelectionProps {
  finalProducts: Product[];
  selectedProductId: string;
  quantityToProduce: number;
  onProductChange: (productId: string) => void;
  onQuantityChange: (quantity: number) => void;
}

export const ProductSelection: React.FC<ProductSelectionProps> = ({
  finalProducts,
  selectedProductId,
  quantityToProduce,
  onProductChange,
  onQuantityChange,
}) => {
  const selectedProduct = finalProducts.find(p => p.id === selectedProductId);

  // Filter only products with nature "Prodotto Finito"
  const filteredFinalProducts = finalProducts.filter(p => p.nature === 'Prodotto Finito');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prodotto Finale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="finalProduct">Prodotto Finito *</Label>
          <select
            id="finalProduct"
            value={selectedProductId}
            onChange={(e) => onProductChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Seleziona prodotto finito...</option>
            {filteredFinalProducts.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.sku})
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <div className="space-y-2">
            <Label>Codice SKU</Label>
            <Input
              value={selectedProduct.sku}
              readOnly
              className="bg-gray-100"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="quantityToProduce">Quantità da Produrre *</Label>
          <Input
            id="quantityToProduce"
            type="number"
            min="1"
            value={quantityToProduce}
            onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};
