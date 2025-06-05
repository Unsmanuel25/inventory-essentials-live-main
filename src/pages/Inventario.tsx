
import React, { useState } from 'react';
import { Package, AlertTriangle, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const Inventario: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [natureFilter, setNatureFilter] = useState('');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)  // Only show active products
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: incomingOrders = [] } = useQuery({
    queryKey: ['incoming-orders-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incoming_orders')
        .select('product_id, ordered_quantity')
        .eq('status', 'In arrivo');
      
      if (error) throw error;
      return data;
    }
  });

  // Get unique suppliers and natures for filters
  const suppliers = [...new Set(products.map(p => p.supplier).filter(Boolean))];
  const natures = [...new Set(products.map(p => p.nature).filter(Boolean))];

  // Group incoming orders by product
  const incomingByProduct = incomingOrders.reduce((acc, order) => {
    if (!acc[order.product_id]) {
      acc[order.product_id] = 0;
    }
    acc[order.product_id] += order.ordered_quantity;
    return acc;
  }, {} as Record<string, number>);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = !supplierFilter || product.supplier === supplierFilter;
    const matchesNature = !natureFilter || product.nature === natureFilter;
    
    return matchesSearch && matchesSupplier && matchesNature;
  });

  const getStockStatus = (currentStock: number, minStock: number) => {
    if (currentStock <= 0) return { label: 'Esaurito', variant: 'destructive' as const };
    if (currentStock <= minStock) return { label: 'Scorta bassa', variant: 'destructive' as const };
    return { label: 'Disponibile', variant: 'default' as const };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Caricamento inventario...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">{filteredProducts.length} prodotti</span>
        </div>
      </div>

      {/* Filtri */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Cerca per nome o SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-48">
              <select
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Tutti i fornitori</option>
                {suppliers.map(supplier => (
                  <option key={supplier} value={supplier}>{supplier}</option>
                ))}
              </select>
            </div>
            <div className="w-48">
              <select
                value={natureFilter}
                onChange={(e) => setNatureFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Tutte le nature</option>
                {natures.map(nature => (
                  <option key={nature} value={nature}>{nature}</option>
                ))}
              </select>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSupplierFilter('');
                setNatureFilter('');
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabella prodotti */}
      <Card>
        <CardHeader>
          <CardTitle>Prodotti in Magazzino</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prodotto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Natura</TableHead>
                <TableHead>Giacenza</TableHead>
                <TableHead>In Arrivo</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Fornitore</TableHead>
                <TableHead>Ubicazione</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.current_stock || 0, product.min_stock || 0);
                const incomingQuantity = incomingByProduct[product.id] || 0;
                
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.sku}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.nature === 'Prodotto Finito' ? 'default' : 'secondary'}>
                        {product.nature}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{product.current_stock} {product.unit}</span>
                        {(product.current_stock || 0) <= (product.min_stock || 0) && (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {incomingQuantity > 0 ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          +{incomingQuantity} {product.unit}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={stockStatus.variant}
                        className={
                          stockStatus.label === 'Disponibile' 
                            ? 'bg-green-500 text-white hover:bg-green-600' 
                            : stockStatus.label === 'Scorta bassa' 
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : ''
                        }
                      >
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.supplier || '-'}</TableCell>
                    <TableCell>{product.location || '-'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nessun prodotto trovato con i filtri selezionati
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
