
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  Search,
  ListTree, 
  ArrowUpDown,
  Truck,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Inventario', href: '/inventario', icon: Package },
  { name: 'Creazione prodotto', href: '/crea-prodotto', icon: Plus },
  { name: 'Cerca prodotto', href: '/cerca-prodotto', icon: Search },
  { name: 'Distinta base', href: '/distinta-base', icon: ListTree },
  { name: 'Carico/Scarico', href: '/carico-scarico', icon: ArrowUpDown },
  { name: 'Merce in Arrivo', href: '/merce-in-arrivo', icon: Truck },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 text-white flex flex-col" style={{ backgroundColor: '#8000D6' }}>
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: '#B573FF' }}>
        <h1 className="text-xl font-bold text-white">Live Essential</h1>
        <p className="text-sm mt-1" style={{ color: '#E0E0E0' }}>Gestione Magazzino</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'text-white'
                  : 'text-white hover:text-white'
              )}
              style={isActive ? 
                { backgroundColor: '#B573FF' } : 
                {}
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(181, 115, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t" style={{ borderColor: '#B573FF' }}>
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#B573FF' }}>
            <span className="text-sm font-medium text-white">A</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-xs" style={{ color: '#E0E0E0' }}>admin@liveessential.com</p>
          </div>
        </div>
        <button 
          className="flex items-center w-full px-4 py-2 text-sm text-white rounded-lg transition-colors"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(181, 115, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Esci
        </button>
      </div>
    </div>
  );
};
