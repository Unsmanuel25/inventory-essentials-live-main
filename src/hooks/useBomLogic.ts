
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BomForm, BomItem } from '@/types/bom';
import { convertToBaseUnit } from '@/utils/unitConversion';

interface Product {
  id: string;
  name: string;
  sku: string;
  current_stock: number;
  unit?: string;
}

const initialForm: BomForm = {
  finalProductId: '',
  quantityToProduce: 1,
  items: [],
};

export const useBomLogic = (materials: Product[], finalProducts: Product[]) => {
  const { toast } = useToast();
  const [form, setForm] = useState<BomForm>(initialForm);
  const [isLoading, setIsLoading] = useState(false);

  const selectedProduct = finalProducts.find(p => p.id === form.finalProductId);

  const addMaterial = () => {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { materialId: '', quantity: 1, unit: 'pz' }]
    }));
  };

  const removeMaterial = (index: number) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateMaterial = (index: number, field: keyof BomItem, value: string | number) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleProductChange = (productId: string) => {
    setForm(prev => ({ ...prev, finalProductId: productId }));
  };

  const handleQuantityChange = (quantity: number) => {
    setForm(prev => ({ ...prev, quantityToProduce: quantity }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      console.log('Starting assembly process...', { form });

      // Check material availability with unit conversion
      const insufficientMaterials = [];
      for (const item of form.items) {
        const material = materials.find(m => m.id === item.materialId);
        if (material) {
          const convertedQuantity = convertToBaseUnit(item.quantity, item.unit, material.unit || 'pz');
          const totalRequired = convertedQuantity * form.quantityToProduce;
          console.log('Checking material:', material.name, 'Required:', totalRequired, 'Available:', material.current_stock);
          if (material.current_stock < totalRequired) {
            insufficientMaterials.push(material.name);
          }
        }
      }

      if (insufficientMaterials.length > 0) {
        toast({
          title: "Materiali insufficienti",
          description: `Scorte insufficienti per: ${insufficientMaterials.join(', ')}`,
          variant: "destructive",
        });
        return false;
      }

      // Save BOM items with units
      for (const item of form.items) {
        await supabase.from('bom_items').insert({
          final_product_id: form.finalProductId,
          material_id: item.materialId,
          quantity_per_unit: item.quantity,
          unit: item.unit,
        });
      }

      // Update material stocks and create movements - FIXED
      for (const item of form.items) {
        const material = materials.find(m => m.id === item.materialId);
        if (material) {
          const convertedQuantity = convertToBaseUnit(item.quantity, item.unit, material.unit || 'pz');
          const totalUsed = convertedQuantity * form.quantityToProduce;
          
          console.log('Processing material:', material.name, 'Using:', totalUsed, 'Current stock:', material.current_stock);
          
          // Update material stock - SUBTRACT the used quantity
          const newStock = material.current_stock - totalUsed;
          const { error: updateError } = await supabase
            .from('products')
            .update({ 
              current_stock: newStock,
              updated_at: new Date().toISOString()
            })
            .eq('id', item.materialId);

          if (updateError) {
            console.error('Error updating material stock:', updateError);
            throw updateError;
          }

          console.log('Updated material stock for', material.name, 'from', material.current_stock, 'to', newStock);

          // Record movement for materials used (negative quantity for scarico)
          const { error: movementError } = await supabase.from('movements').insert({
            product_id: item.materialId,
            type: 'scarico',
            quantity: -totalUsed, // Negative for scarico
            description: `Utilizzo per assemblaggio ${selectedProduct?.name}`,
            date: new Date().toISOString(),
          });

          if (movementError) {
            console.error('Error recording material movement:', movementError);
          }
        }
      }

      // Update final product stock - ADD the produced quantity
      if (selectedProduct) {
        const newFinalStock = selectedProduct.current_stock + form.quantityToProduce;
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            current_stock: newFinalStock,
            updated_at: new Date().toISOString()
          })
          .eq('id', form.finalProductId);

        if (updateError) {
          console.error('Error updating final product stock:', updateError);
          throw updateError;
        }

        console.log('Updated final product stock for', selectedProduct.name, 'from', selectedProduct.current_stock, 'to', newFinalStock);

        // Record final product movement (positive quantity for assemblaggio)
        const { error: movementError } = await supabase.from('movements').insert({
          product_id: form.finalProductId,
          type: 'assemblaggio',
          quantity: form.quantityToProduce, // Positive for production
          description: `Assemblaggio ${form.quantityToProduce} ${selectedProduct.name}`,
          date: new Date().toISOString(),
        });

        if (movementError) {
          console.error('Error recording final product movement:', movementError);
        }
      }

      toast({
        title: "Assemblaggio completato",
        description: `Prodotti assemblati: ${form.quantityToProduce} ${selectedProduct?.name}. Materie prime scaricate correttamente.`,
      });
      
      return true;
    } catch (error) {
      console.error('Errore assemblaggio:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'assemblaggio.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    selectedProduct,
    addMaterial,
    removeMaterial,
    updateMaterial,
    handleProductChange,
    handleQuantityChange,
    handleSubmit,
  };
};
