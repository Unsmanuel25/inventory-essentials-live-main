
import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MaterialItem } from './MaterialItem';
import { BomItem } from '@/types/bom';

interface Product {
  id: string;
  name: string;
  sku: string;
  current_stock: number;
  unit?: string;
}

interface MaterialsListProps {
  items: BomItem[];
  materials: Product[];
  quantityToProduce: number;
  onAddMaterial: () => void;
  onUpdateMaterial: (index: number, field: keyof BomItem, value: string | number) => void;
  onRemoveMaterial: (index: number) => void;
}

export const MaterialsList: React.FC<MaterialsListProps> = ({
  items,
  materials,
  quantityToProduce,
  onAddMaterial,
  onUpdateMaterial,
  onRemoveMaterial,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Materie Prime
          <Button type="button" onClick={onAddMaterial} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Aggiungi
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <MaterialItem
            key={index}
            item={item}
            index={index}
            materials={materials}
            quantityToProduce={quantityToProduce}
            onUpdate={onUpdateMaterial}
            onRemove={onRemoveMaterial}
          />
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nessun materiale aggiunto. Clicca "Aggiungi" per iniziare.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
