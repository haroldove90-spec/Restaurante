import React from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ChefHat, 
  BarChart3, 
  Box, 
  Settings, 
  LogOut,
  UserCircle
} from 'lucide-react';
import { UserRole } from '../../types/database';

interface SidebarProps {
  role: UserRole;
  onSignOut: () => void;
  userName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ role, onSignOut, userName, activeTab, onTabChange }: SidebarProps) {
  const isDark = role === 'admin';

  const menuItems = {
    admin: [
      { id: 'dashboard', label: 'Resumen', icon: <LayoutDashboard className="w-5 h-5" /> },
      { id: 'inventory', label: 'Inventario', icon: <Box className="w-5 h-5" /> },
      { id: 'reports', label: 'Informes', icon: <BarChart3 className="w-5 h-5" /> },
      { id: 'settings', label: 'Configuración', icon: <Settings className="w-5 h-5" /> },
    ],
    mesero: [
      { id: 'tables', label: 'Salón / Mesas', icon: <UtensilsCrossed className="w-5 h-5" /> },
      { id: 'orders', label: 'Mis Pedidos', icon: <LayoutDashboard className="w-5 h-5" /> },
    ],
    cocinero: [
      { id: 'kds', label: 'Cocina (KDS)', icon: <ChefHat className="w-5 h-5" /> },
    ],
    cajero: [
      { id: 'checkout', label: 'Caja / Pagos', icon: <BarChart3 className="w-5 h-5" /> },
    ]
  };

  const currentItems = menuItems[role] || [];

  return (
    <aside className={`w-72 flex flex-col shrink-0 transition-colors duration-500 ${isDark ? 'bg-slate-950 border-r border-slate-800' : 'bg-white border-r border-slate-200'}`}>
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">RP</div>
          <span className={`font-black uppercase tracking-tight text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Restaurante Pro</span>
        </div>
        <div className={`mt-2 px-2 py-0.5 rounded-full inline-block text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-100 text-slate-500'}`}>
           {role === 'admin' ? 'Terminal Admin' : `Módulo: ${role}`}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {currentItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold uppercase text-[11px] tracking-widest transition-all group ${
              activeTab === item.id
                ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600')
                : (isDark ? 'text-slate-400 hover:bg-slate-900 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600')
            }`}
          >
            <div className={`transition-transform group-hover:scale-110 ${
              activeTab === item.id 
                ? 'text-white' 
                : (isDark ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-600')
            }`}>
              {item.icon}
            </div>
            {item.label}
          </button>
        ))}
      </nav>

      <div className={`p-6 border-t ${isDark ? 'border-slate-900' : 'border-slate-100 space-y-4'}`}>
        <div className="flex items-center gap-4 mb-6">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-slate-900 border border-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
              <UserCircle className="w-8 h-8" />
           </div>
           <div className="overflow-hidden">
              <p className={`text-sm font-black uppercase truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{userName}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{role}</p>
           </div>
        </div>
        <button 
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-3 py-4 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all"
        >
          <LogOut className="w-4 h-4" /> Finalizar Turno
        </button>
      </div>
    </aside>
  );
}
