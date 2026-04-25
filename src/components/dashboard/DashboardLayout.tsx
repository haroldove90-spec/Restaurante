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
    <div className="flex h-screen w-full overflow-hidden bg-white">
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
        {/* Mobile Header (Jushi Style) */}
        <div className="lg:hidden flex items-center justify-between p-6 bg-rose-600 text-white">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-black/10 rounded-xl transition-colors"
            >
              <Menu className="w-8 h-8" />
            </button>
            <span className="font-black uppercase tracking-tighter text-2xl italic leading-none">JUSHI</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-black/20 rounded-full border border-white/20">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">{activeTab}</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative bg-white">
          {renderDashboard()}
        </div>
      </main>
    </div>
  );
}
