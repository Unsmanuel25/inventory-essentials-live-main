
import React from 'react';
import { Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4">
      <Button 
        size="lg" 
        className="text-white hover:opacity-90"
        style={{ backgroundColor: '#6C00FF' }}
        onClick={() => navigate('/crea-prodotto')}
      >
        <Plus className="mr-2 h-5 w-5" />
        Nuovo Prodotto
      </Button>
      <Button 
        size="lg" 
        variant="outline"
        className="border-purple-600 text-purple-600 hover:bg-purple-50"
        onClick={() => navigate('/carico-scarico')}
      >
        <Package className="mr-2 h-5 w-5" />
        Nuovo Carico
      </Button>
    </div>
  );
};
