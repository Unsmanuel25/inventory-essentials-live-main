
// Convert units to base unit (the material's storage unit)
export const convertToBaseUnit = (quantity: number, fromUnit: string, materialUnit: string): number => {
  // Convert volume units
  if (fromUnit === 'l' && materialUnit === 'ml') return quantity * 1000;
  if (fromUnit === 'cl' && materialUnit === 'ml') return quantity * 10;
  if (fromUnit === 'ml' && materialUnit === 'l') return quantity / 1000;
  if (fromUnit === 'cl' && materialUnit === 'l') return quantity / 100;
  if (fromUnit === 'l' && materialUnit === 'cl') return quantity * 100;
  if (fromUnit === 'ml' && materialUnit === 'cl') return quantity / 10;
  
  // Convert weight units
  if (fromUnit === 'kg' && materialUnit === 'g') return quantity * 1000;
  if (fromUnit === 'g' && materialUnit === 'kg') return quantity / 1000;
  
  // Same unit or no conversion needed
  return quantity;
};
