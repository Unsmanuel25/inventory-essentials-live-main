
export interface BomItem {
  materialId: string;
  quantity: number;
  unit: string;
}

export interface BomForm {
  finalProductId: string;
  quantityToProduce: number;
  items: BomItem[];
}

export const UNITS = [
  { value: 'ml', label: 'ml' },
  { value: 'cl', label: 'cl' },
  { value: 'l', label: 'l' },
  { value: 'pz', label: 'pz' },
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
] as const;
