
import React from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductSelection } from '@/components/bom/ProductSelection';
import { MaterialsList } from '@/components/bom/MaterialsList';
import { useBomLogic } from '@/hooks/useBomLogic';

export const DistintaBase: React.FC = () => {
  const navigate = useNavigate();

  const { data: finalProducts = [] } = useQuery({
    queryKey: ['final-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)  // Only active products
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: materials = [] } = useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)  // Only active products - both materials and finished products
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const {
    form,
    isLoading,
    addMaterial,
    removeMaterial,
    updateMaterial,
    handleProductChange,
    handleQuantityChange,
    handleSubmit,
  } = useBomLogic(materials, finalProducts);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit();
    if (success) {
      navigate('/inventario');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-black">Distinta Base</h1>
      </div>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductSelection
            finalProducts={finalProducts}
            selectedProductId={form.finalProductId}
            quantityToProduce={form.quantityToProduce}
            onProductChange={handleProductChange}
            onQuantityChange={handleQuantityChange}
          />

          <MaterialsList
            items={form.items}
            materials={materials}
            quantityToProduce={form.quantityToProduce}
            onAddMaterial={addMaterial}
            onUpdateMaterial={updateMaterial}
            onRemoveMaterial={removeMaterial}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            type="submit" 
            className="text-white hover:opacity-90"
            style={{ backgroundColor: '#6C00FF' }}
            disabled={form.items.length === 0 || !form.finalProductId || isLoading}
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Assemblaggio...' : 'Assembla Prodotto'}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Annulla
          </Button>
        </div>
      </form>
    </div>
  );
};
