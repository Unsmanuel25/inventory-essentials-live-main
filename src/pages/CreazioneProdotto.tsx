import React, { useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductForm {
  name: string;
  sku: string;
  description: string;
  productionPrice: string;
  clientPrice: string;
  professionalPrice: string;
  supplier: string;
  location: string;
  initialQuantity: string;
  unit: string;
  minStock: string;
  nature: string;
}

const initialForm: ProductForm = {
  name: '',
  sku: '',
  description: '',
  productionPrice: '',
  clientPrice: '',
  professionalPrice: '',
  supplier: '',
  location: '',
  initialQuantity: '',
  unit: 'pz',
  minStock: '100',
  nature: 'Materia Prima',
};

export const CreazioneProdotto: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.from('products').insert({
        name: form.name,
        sku: form.sku,
        description: form.description || null,
        production_price: form.productionPrice ? parseFloat(form.productionPrice) : null,
        client_price: form.clientPrice ? parseFloat(form.clientPrice) : null,
        professional_price: form.professionalPrice ? parseFloat(form.professionalPrice) : null,
        supplier: form.supplier || null,
        location: form.location || null,
        initial_quantity: form.initialQuantity ? parseInt(form.initialQuantity) : 0,
        current_stock: form.initialQuantity ? parseInt(form.initialQuantity) : 0,
        unit: form.unit,
        min_stock: form.minStock ? parseInt(form.minStock) : 100,
        nature: form.nature,
        active: true, // New products are active by default
      });

      if (error) throw error;

      toast({
        title: "Prodotto creato",
        description: "Il prodotto è stato creato con successo.",
      });
      
      navigate('/inventario');
    } catch (error) {
      console.error('Errore creazione prodotto:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione del prodotto.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProductForm, value: string) => {
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
        <h1 className="text-2xl font-bold text-black">Creazione Prodotto</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informazioni Prodotto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informazioni base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Prodotto *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="es. Shampoo Riparatore 300ml"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">Codice SKU *</Label>
                <Input
                  id="sku"
                  value={form.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="es. SH-001"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nature">Natura Prodotto *</Label>
              <select
                id="nature"
                value={form.nature}
                onChange={(e) => handleInputChange('nature', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="Materia Prima">Materia Prima</option>
                <option value="Prodotto Finito">Prodotto Finito</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrizione</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descrizione dettagliata del prodotto..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Prezzi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="productionPrice">Prezzo di Produzione (€)</Label>
                <Input
                  id="productionPrice"
                  type="number"
                  step="0.01"
                  value={form.productionPrice}
                  onChange={(e) => handleInputChange('productionPrice', e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPrice">Prezzo Cliente (€)</Label>
                <Input
                  id="clientPrice"
                  type="number"
                  step="0.01"
                  value={form.clientPrice}
                  onChange={(e) => handleInputChange('clientPrice', e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="professionalPrice">Prezzo Professionista (€)</Label>
                <Input
                  id="professionalPrice"
                  type="number"
                  step="0.01"
                  value={form.professionalPrice}
                  onChange={(e) => handleInputChange('professionalPrice', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Fornitore e posizione */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="supplier">Fornitore</Label>
                <Input
                  id="supplier"
                  value={form.supplier}
                  onChange={(e) => handleInputChange('supplier', e.target.value)}
                  placeholder="Nome fornitore"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Posizione Scaffale</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="es. A1-B2"
                />
              </div>
            </div>

            {/* Quantità e unità */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="initialQuantity">Quantità Iniziale</Label>
                <Input
                  id="initialQuantity"
                  type="number"
                  value={form.initialQuantity}
                  onChange={(e) => handleInputChange('initialQuantity', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unità di Misura</Label>
                <select
                  id="unit"
                  value={form.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="pz">Pezzi</option>
                  <option value="ml">Millilitri</option>
                  <option value="litri">Litri</option>
                  <option value="kg">Chilogrammi</option>
                  <option value="g">Grammi</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minStock">Scorta Minima</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={form.minStock}
                  onChange={(e) => handleInputChange('minStock', e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>

            {/* Pulsanti */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="text-white hover:opacity-90"
                style={{ backgroundColor: '#6C00FF' }}
                disabled={isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Salvataggio...' : 'Salva Prodotto'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Annulla
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
