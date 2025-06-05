
import React from 'react';
import { Package, TrendingUp, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardsProps {
  totalProducts: number;
  totalIncoming: number;
  todayAssembled: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalProducts,
  totalIncoming,
  todayAssembled
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prodotti Attivi</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: '#28A745' }}>{totalProducts}</div>
          <p className="text-xs text-muted-foreground">Prodotti nel sistema</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Articoli in Arrivo</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cyan-600">{totalIncoming}</div>
          <p className="text-xs text-muted-foreground">Ordini in transito</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assemblati Oggi</CardTitle>
          <Plus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-600">{todayAssembled}</div>
          <p className="text-xs text-muted-foreground">Assemblaggi di oggi</p>
        </CardContent>
      </Card>
    </div>
  );
};
