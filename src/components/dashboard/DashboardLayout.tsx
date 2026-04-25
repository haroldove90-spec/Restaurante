import React, { useState } from 'react';
import Sidebar from './Sidebar';
import AdminStats from '../role-based/AdminStats';
import WaiterDashboard from '../role-based/WaiterDashboard';
import KitchenDisplay from '../role-based/KitchenDisplay';
import ProductAdmin from '../role-based/ProductAdmin';
import { UserRole } from '../../types/database';

import { Menu, ChevronRight } from 'lucide-react';

interface DashboardLayoutProps {
  role: UserRole;
  userName: string;
  onSignOut: () => void;
}

export default function DashboardLayout({ role, userName, onSignOut }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState(
    role === 'admin' ? 'dashboard' : (role === 'mesero' ? 'tables' : 'kds')
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <div className="text-center p-6">
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
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <main className="flex-1 overflow-hidden relative shadow-inner flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 text-white">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-slate-800 rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-black uppercase tracking-tighter text-sm italic">Restaurant Pro</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase text-indigo-400">{activeTab}</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {renderDashboard()}
        </div>
      </main>
    </div>
  );
}
