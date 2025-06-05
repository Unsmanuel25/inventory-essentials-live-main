import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { OrderForm } from '@/components/merce-arrivo/OrderForm';
import { IncomingOrdersList } from '@/components/merce-arrivo/IncomingOrdersList';

interface IncomingOrderForm {
  productId: string;
  orderedQuantity: number;
  orderDate: string;
  expectedArrivalDate: string;
  notes: string;
}

const initialForm: IncomingOrderForm = {
  productId: '',
  orderedQuantity: 1,
  orderDate: new Date().toISOString().split('T')[0],
  expectedArrivalDate: '',
  notes: '',
};

export const MerceInArrivo: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<IncomingOrderForm>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [processingOrders, setProcessingOrders] = useState<Set<string>>(new Set());

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: incomingOrders = [] } = useQuery({
    queryKey: ['incoming-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incoming_orders')
        .select(`
          *,
          products (
            name,
            sku,
            unit
          )
        `)
        .eq('status', 'In arrivo')
        .order('expected_arrival_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.from('incoming_orders').insert({
        product_id: form.productId,
        ordered_quantity: form.orderedQuantity,
        order_date: form.orderDate,
        expected_arrival_date: form.expectedArrivalDate || null,
        notes: form.notes || null,
        status: 'In arrivo',
      });

      if (error) throw error;

      const selectedProduct = products.find(p => p.id === form.productId);
      
      toast({
        title: "Ordine registrato",
        description: `Ordine di ${form.orderedQuantity} ${selectedProduct?.name} registrato con successo.`,
      });
      
      setForm(initialForm);
      queryClient.invalidateQueries({ queryKey: ['incoming-orders'] });
    } catch (error) {
      console.error('Errore registrazione ordine:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la registrazione dell'ordine.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsArrived = async (orderId: string, productId: string, quantity: number, productName: string) => {
    if (processingOrders.has(orderId)) {
      console.log('Order already being processed:', orderId);
      return;
    }

    setProcessingOrders(prev => new Set(prev).add(orderId));
    console.log('Marking as arrived:', { orderId, productId, quantity, productName });
    
    try {
      const { data: currentProduct, error: getCurrentError } = await supabase
        .from('products')
        .select('current_stock')
        .eq('id', productId)
        .single();

      if (getCurrentError) {
        console.error('Error getting current stock:', getCurrentError);
        throw getCurrentError;
      }

      console.log('Current stock before update:', currentProduct.current_stock);

      const { error: orderError } = await supabase
        .from('incoming_orders')
        .update({ 
          status: 'Arrivato',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (orderError) {
        console.error('Error updating order status:', orderError);
        throw orderError;
      }

      const newStock = (currentProduct.current_stock || 0) + quantity;
      console.log('Updating stock to:', newStock, 'by adding exactly', quantity);

      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          current_stock: newStock,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (updateError) {
        console.error('Error updating product stock:', updateError);
        throw updateError;
      }

      const { error: movementError } = await supabase
        .from('movements')
        .insert({
          product_id: productId,
          type: 'carico',
          quantity: quantity,
          description: `Arrivo merce ordinata - ${productName}`,
          date: new Date().toISOString(),
        });

      if (movementError) {
        console.error('Error recording movement:', movementError);
      }

      toast({
        title: "Merce arrivata",
        description: `${quantity} ${productName} aggiunti al magazzino. Stock aggiornato a ${newStock}.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['incoming-orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      
    } catch (error) {
      console.error('Errore registrazione arrivo:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la registrazione dell'arrivo.",
        variant: "destructive",
      });
    } finally {
      setProcessingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const updateForm = (field: keyof IncomingOrderForm, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
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
        <h1 className="text-2xl font-bold text-gray-900">Merce in Arrivo</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderForm
          form={form}
          products={products}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onFormChange={updateForm}
        />
        <IncomingOrdersList
          orders={incomingOrders}
          processingOrders={processingOrders}
          onMarkAsArrived={handleMarkAsArrived}
        />
      </div>
    </div>
  );
};
