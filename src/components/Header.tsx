
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Live Essentials</h2>
          <p className="text-sm text-gray-500">Sistema di gestione magazzino</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">Sessione attiva</p>
          </div>
        </div>
      </div>
    </header>
  );
};
