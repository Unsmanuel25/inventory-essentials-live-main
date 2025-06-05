
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MovementFormComponent } from '@/components/carico-scarico/MovementForm';
import { RecentMovementsList } from '@/components/carico-scarico/RecentMovementsList';

interface MovementForm {
  type: 'carico' | 'scarico';
  productId: string;
  quantity: number;
  notes: string;
}

const initialForm: MovementForm = {
  type: 'carico',
  productId: '',
  quantity: 1,
  notes: '',
};

export const CaricoScarico: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<MovementForm>(initialForm);
  const [isLoading, setIsLoading] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: recentMovements = [] } = useQuery({
    queryKey: ['recent-movements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movements')
        .select(`
          *,
          products!inner (name, sku, active)
        `)
        .eq('products.active', true)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const product = products.find(p => p.id === form.productId);
      if (!product) {
        toast({
          title: "Errore",
          description: "Prodotto non trovato.",
          variant: "destructive",
        });
        return;
      }

      console.log('Processing movement:', { form, product });

      if (form.type === 'scarico' && product.current_stock < form.quantity) {
        toast({
          title: "Scorte insufficienti",
          description: `Quantità disponibile: ${product.current_stock}. Richiesta: ${form.quantity}`,
          variant: "destructive",
        });
        return;
      }

      const stockChange = form.type === 'carico' ? form.quantity : -form.quantity;
      const newStock = product.current_stock + stockChange;

      console.log('Stock calculation:', {
        currentStock: product.current_stock,
        stockChange,
        newStock,
        movementType: form.type
      });

      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          current_stock: newStock,
          updated_at: new Date().toISOString()
        })
        .eq('id', form.productId);

      if (updateError) {
        console.error('Error updating product stock:', updateError);
        throw updateError;
      }

      const { error: movementError } = await supabase.from('movements').insert({
        product_id: form.productId,
        type: form.type,
        quantity: stockChange,
        description: form.notes || `${form.type === 'carico' ? 'Carico' : 'Scarico'} manuale - ${product.name}`,
        date: new Date().toISOString(),
      });

      if (movementError) {
        console.error('Error recording movement:', movementError);
        throw movementError;
      }

      toast({
        title: "Movimento registrato",
        description: `${form.type === 'carico' ? 'Carico' : 'Scarico'} di ${form.quantity} ${product.name} completato. Nuova giacenza: ${newStock}`,
      });

      setForm(initialForm);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['recent-movements'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });

    } catch (error) {
      console.error('Errore registrazione movimento:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la registrazione del movimento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (updates: Partial<MovementForm>) => {
    setForm(prev => ({ ...prev, ...updates }));
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
        <h1 className="text-2xl font-bold text-gray-900">Carico e Scarico</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MovementFormComponent
          form={form}
          products={products}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onFormChange={handleFormChange}
        />
        <RecentMovementsList movements={recentMovements} />
      </div>
    </div>
  );
};
