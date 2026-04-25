import React, { useState } from 'react';
import Sidebar from './Sidebar';
import AdminStats from '../role-based/AdminStats';
import WaiterDashboard from '../role-based/WaiterDashboard';
import KitchenDisplay from '../role-based/KitchenDisplay';
import ProductAdmin from '../role-based/ProductAdmin';
import { UserRole } from '../../types/database';

interface DashboardLayoutProps {
  role: UserRole;
  userName: string;
  onSignOut: () => void;
}

export default function DashboardLayout({ role, userName, onSignOut }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState(
    role === 'admin' ? 'dashboard' : (role === 'mesero' ? 'tables' : 'kds')
  );

  const renderDashboard = () => {
    if (activeTab === 'inventory') return <ProductAdmin />;
    
    switch (role) {
      case 'admin':
        return activeTab === 'dashboard' ? <AdminStats /> : 
               <div className="h-full flex items-center justify-center text-slate-500 uppercase font-black text-xl italic tracking-tighter">Módulo {activeTab} en desarrollo</div>;
      case 'mesero':
        return <WaiterDashboard />;
      case 'cocinero':
        return <KitchenDisplay />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Acceso Restringido</h2>
              <p className="text-slate-500 font-bold uppercase text-xs mt-2">No tienes permisos para visualizar este módulo</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-900">
      <Sidebar 
        role={role} 
        userName={userName} 
        onSignOut={onSignOut} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main className="flex-1 overflow-hidden relative shadow-inner">
        {renderDashboard()}
      </main>
    </div>
  );
}
