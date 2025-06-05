
import React, { useState } from 'react';
import { Search, Edit, Trash2, ArrowLeft, EyeOff, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  production_price?: number;
  client_price?: number;
  professional_price?: number;
  supplier?: string;
  location?: string;
  current_stock?: number;
  min_stock?: number;
  unit?: string;
  nature?: string;
  active?: boolean;
}

type FilterType = 'all' | 'active' | 'inactive';

export const CercaProdotto: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('active');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', filterType],
    queryFn: async () => {
      let query = supabase.from('products').select('*').order('name');
      
      if (filterType === 'active') {
        query = query.eq('active', true);
      } else if (filterType === 'inactive') {
        query = query.eq('active', false);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editingProduct.name,
          description: editingProduct.description,
          production_price: editingProduct.production_price,
          client_price: editingProduct.client_price,
          professional_price: editingProduct.professional_price,
          supplier: editingProduct.supplier,
          location: editingProduct.location,
          current_stock: editingProduct.current_stock,
          min_stock: editingProduct.min_stock,
          unit: editingProduct.unit,
          nature: editingProduct.nature,
          active: editingProduct.active,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      toast({
        title: "Prodotto aggiornato",
        description: `${editingProduct.name} è stato aggiornato con successo.`,
      });

      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsEditDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Errore aggiornamento prodotto:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivateProduct = async (productId: string, productName: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ active: true })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Prodotto riattivato",
        description: `${productName} è stato riattivato con successo.`,
      });

      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      console.error('Errore riattivazione prodotto:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la riattivazione.",
        variant: "destructive",
      });
    }
  };

  const handleDeactivateProduct = async (productId: string, productName: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ active: false })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Prodotto disattivato",
        description: `${productName} è stato disattivato ma rimane nel database per lo storico.`,
      });

      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      console.error('Errore disattivazione prodotto:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la disattivazione.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    try {
      // Check if product is used in BOM items
      const { data: bomCheck } = await supabase
        .from('bom_items')
        .select('id')
        .or(`final_product_id.eq.${productId},material_id.eq.${productId}`)
        .limit(1);

      // Check if product has movements
      const { data: movementCheck } = await supabase
        .from('movements')
        .select('id')
        .eq('product_id', productId)
        .limit(1);

      if ((bomCheck && bomCheck.length > 0) || (movementCheck && movementCheck.length > 0)) {
        toast({
          title: "Impossibile eliminare",
          description: "Questo prodotto è collegato a una distinta base o a uno storico di carico/scarico. Puoi solo disattivarlo.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Prodotto eliminato",
        description: `${productName} è stato eliminato definitivamente dal sistema.`,
      });

      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      console.error('Errore eliminazione prodotto:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione.",
        variant: "destructive",
      });
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
        <h1 className="text-2xl font-bold text-black">Cerca Prodotto</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cerca e Gestisci Prodotti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cerca per nome o codice SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="w-48">
              <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtra prodotti" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti gli articoli</SelectItem>
                  <SelectItem value="active">Solo attivi</SelectItem>
                  <SelectItem value="inactive">Solo disattivati</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            {productsLoading ? (
              <div className="text-center py-8 text-gray-500">
                Caricamento prodotti...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'Nessun prodotto trovato' : 'Nessun prodotto disponibile'}
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className={`flex items-center justify-between p-4 border rounded-lg ${
                  product.active ? 'hover:bg-gray-50' : 'bg-gray-100 opacity-70'
                }`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${product.active ? 'text-gray-900' : 'text-gray-500'}`}>
                        {product.name}
                      </h3>
                      <Badge variant="outline">{product.sku}</Badge>
                      <Badge variant={product.nature === 'Prodotto Finito' ? 'default' : 'secondary'}>
                        {product.nature}
                      </Badge>
                      {!product.active && (
                        <Badge style={{ backgroundColor: '#DC3545' }} className="text-white">
                          Disattivato
                        </Badge>
                      )}
                    </div>
                    <div className={`text-sm mt-1 ${product.active ? 'text-gray-500' : 'text-gray-400'}`}>
                      <span>Giacenza: {product.current_stock} {product.unit}</span>
                      {product.supplier && <span> • Fornitore: {product.supplier}</span>}
                      {product.location && <span> • Ubicazione: {product.location}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>
                            {editingProduct?.active ? 'Modifica Prodotto' : 'Dettaglio Prodotto Disattivato'}
                          </DialogTitle>
                          <DialogDescription>
                            {editingProduct?.active 
                              ? 'Modifica i dati del prodotto selezionato.'
                              : 'Visualizza i dettagli del prodotto disattivato e riattivalo se necessario.'
                            }
                          </DialogDescription>
                        </DialogHeader>
                        {editingProduct && (
                          <form onSubmit={handleUpdateProduct} className="space-y-4">
                            {!editingProduct.active && (
                              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-amber-800 text-sm">
                                  Questo prodotto è attualmente disattivato. Puoi riattivarlo spuntando la casella sottostante.
                                </p>
                              </div>
                            )}

                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="active"
                                checked={editingProduct.active}
                                onChange={(e) => setEditingProduct({...editingProduct, active: e.target.checked})}
                                className="rounded"
                              />
                              <Label htmlFor="active">Prodotto attivo</Label>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Nome *</Label>
                                <Input
                                  id="edit-name"
                                  value={editingProduct.name}
                                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-sku">Codice SKU</Label>
                                <Input
                                  id="edit-sku"
                                  value={editingProduct.sku}
                                  readOnly
                                  className="bg-gray-100"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-description">Descrizione</Label>
                              <Input
                                id="edit-description"
                                value={editingProduct.description || ''}
                                onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-production-price">Prezzo Produzione</Label>
                                <Input
                                  id="edit-production-price"
                                  type="number"
                                  step="0.01"
                                  value={editingProduct.production_price || ''}
                                  onChange={(e) => setEditingProduct({...editingProduct, production_price: parseFloat(e.target.value) || undefined})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-client-price">Prezzo Cliente</Label>
                                <Input
                                  id="edit-client-price"
                                  type="number"
                                  step="0.01"
                                  value={editingProduct.client_price || ''}
                                  onChange={(e) => setEditingProduct({...editingProduct, client_price: parseFloat(e.target.value) || undefined})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-professional-price">Prezzo Professionista</Label>
                                <Input
                                  id="edit-professional-price"
                                  type="number"
                                  step="0.01"
                                  value={editingProduct.professional_price || ''}
                                  onChange={(e) => setEditingProduct({...editingProduct, professional_price: parseFloat(e.target.value) || undefined})}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-supplier">Fornitore</Label>
                                <Input
                                  id="edit-supplier"
                                  value={editingProduct.supplier || ''}
                                  onChange={(e) => setEditingProduct({...editingProduct, supplier: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-location">Ubicazione</Label>
                                <Input
                                  id="edit-location"
                                  value={editingProduct.location || ''}
                                  onChange={(e) => setEditingProduct({...editingProduct, location: e.target.value})}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-current-stock">Giacenza Attuale</Label>
                                <Input
                                  id="edit-current-stock"
                                  type="number"
                                  value={editingProduct.current_stock || 0}
                                  onChange={(e) => setEditingProduct({...editingProduct, current_stock: parseInt(e.target.value) || 0})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-min-stock">Scorta Minima</Label>
                                <Input
                                  id="edit-min-stock"
                                  type="number"
                                  value={editingProduct.min_stock || 0}
                                  onChange={(e) => setEditingProduct({...editingProduct, min_stock: parseInt(e.target.value) || 0})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-unit">Unità</Label>
                                <select
                                  id="edit-unit"
                                  value={editingProduct.unit || 'pz'}
                                  onChange={(e) => setEditingProduct({...editingProduct, unit: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                                >
                                  <option value="pz">pz</option>
                                  <option value="ml">ml</option>
                                  <option value="cl">cl</option>
                                  <option value="l">l</option>
                                  <option value="g">g</option>
                                  <option value="kg">kg</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-nature">Natura</Label>
                              <select
                                id="edit-nature"
                                value={editingProduct.nature || 'Materia Prima'}
                                onChange={(e) => setEditingProduct({...editingProduct, nature: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="Materia Prima">Materia Prima</option>
                                <option value="Prodotto Finito">Prodotto Finito</option>
                              </select>
                            </div>

                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Annulla
                              </Button>
                              <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Salvando...' : 'Salva Modifiche'}
                              </Button>
                            </DialogFooter>
                          </form>
                        )}
                      </DialogContent>
                    </Dialog>

                    {product.active ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeactivateProduct(product.id, product.name)}
                        >
                          <EyeOff className="h-4 w-4 text-amber-500" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
                              <AlertDialogDescription>
                                Sei sicuro di voler eliminare definitivamente <strong>{product.name}</strong>?
                                Se il prodotto ha dipendenze, verrà solo disattivato.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annulla</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Elimina
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReactivateProduct(product.id, product.name)}
                        style={{ backgroundColor: '#28A745', color: 'white' }}
                        className="hover:opacity-90"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Riattiva
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
