
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { LowStockAlert } from '@/components/dashboard/LowStockAlert';
import { LowStockCard } from '@/components/dashboard/LowStockCard';
import { RecentMovementsCard } from '@/components/dashboard/RecentMovementsCard';
import { QuickActions } from '@/components/dashboard/QuickActions';

export const Dashboard: React.FC = () => {
  const { data: lowStockProducts = [] } = useQuery({
    queryKey: ['low-stock-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .lt('current_stock', 100)
        .order('current_stock', { ascending: true });
      
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
          products!inner (name, active)
        `)
        .eq('products.active', true)
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [productsCount, incomingCount, todayAssembly] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact' }).eq('active', true),
        supabase.from('incoming_orders').select('ordered_quantity').eq('status', 'In arrivo'),
        supabase.from('movements').select('*').eq('type', 'assemblaggio').gte('date', new Date().toISOString().split('T')[0])
      ]);

      const totalIncoming = incomingCount.data?.reduce((sum, order) => sum + order.ordered_quantity, 0) || 0;
      const todayAssembled = todayAssembly.data?.length || 0;

      return {
        totalProducts: productsCount.count || 0,
        totalIncoming,
        todayAssembled
      };
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black">Dashboard</h1>
      
      <LowStockAlert lowStockCount={lowStockProducts.length} />

      <StatsCards 
        totalProducts={stats?.totalProducts || 0}
        totalIncoming={stats?.totalIncoming || 0}
        todayAssembled={stats?.todayAssembled || 0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockCard lowStockProducts={lowStockProducts} />
        <RecentMovementsCard recentMovements={recentMovements} />
      </div>

      <QuickActions />
    </div>
  );
};
