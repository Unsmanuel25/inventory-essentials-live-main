
import React from 'react';
import { Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BomItem, UNITS } from '@/types/bom';
import { convertToBaseUnit } from '@/utils/unitConversion';

interface Product {
  id: string;
  name: string;
  sku: string;
  current_stock: number;
  unit?: string;
}

interface MaterialItemProps {
  item: BomItem;
  index: number;
  materials: Product[];
  quantityToProduce: number;
  onUpdate: (index: number, field: keyof BomItem, value: string | number) => void;
  onRemove: (index: number) => void;
}

export const MaterialItem: React.FC<MaterialItemProps> = ({
  item,
  index,
  materials,
  quantityToProduce,
  onUpdate,
  onRemove,
}) => {
  const material = materials.find(m => m.id === item.materialId);
  
  const convertedQuantity = material ? convertToBaseUnit(item.quantity, item.unit, material.unit || 'pz') : 0;
  const totalRequired = convertedQuantity * quantityToProduce;
  const isAvailable = material ? material.current_stock >= totalRequired : false;

  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-medium">Materiale {index + 1}</span>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => onRemove(index)}
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Materiale</Label>
        <select
          value={item.materialId}
          onChange={(e) => onUpdate(index, 'materialId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
          required
        >
          <option value="">Seleziona materiale...</option>
          {materials.map(material => (
            <option key={material.id} value={material.id}>
              {material.name} ({material.sku}) - {material.current_stock} {material.unit}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label>Quantità per unità</Label>
          <Input
            type="number"
            min="0.1"
            step="0.1"
            value={item.quantity}
            onChange={(e) => onUpdate(index, 'quantity', parseFloat(e.target.value) || 0)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Unità</Label>
          <select
            value={item.unit}
            onChange={(e) => onUpdate(index, 'unit', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
          >
            {UNITS.map(unit => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {material && (
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Richiesto ({item.unit}):</span>
            <span className="font-medium">{item.quantity} {item.unit}</span>
          </div>
          <div className="flex justify-between">
            <span>Totale necessario ({material.unit}):</span>
            <span className="font-medium">{totalRequired.toFixed(2)} {material.unit}</span>
          </div>
          <div className="flex justify-between">
            <span>Disponibile:</span>
            <span className={isAvailable ? 'text-green-600' : 'text-red-600'}>
              {material.current_stock} {material.unit}
            </span>
          </div>
          <Badge variant={isAvailable ? "default" : "destructive"}>
            {isAvailable ? 'Disponibile' : 'Insufficiente'}
          </Badge>
        </div>
      )}
    </div>
  );
};
