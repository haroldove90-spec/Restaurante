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
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ role, onSignOut, userName, activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 flex flex-col shrink-0 transition-transform duration-300 lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isDark ? 'bg-slate-950' : 'bg-white'} border-r border-slate-200
      `}>
        <div className="bg-rose-600 p-6 flex justify-between items-center text-white">
          <div className="flex flex-col">
            <span className="font-black text-2xl tracking-tighter leading-none italic">JUSHI</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 mt-1">Restaurant Pro</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2">
            <LogOut className="w-5 h-5 rotate-180" />
          </button>
        </div>

        <div className="p-8 flex-1 flex flex-col">
          <div className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Terminal</p>
            <div className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border ${isDark ? 'bg-slate-900 border-slate-800 text-rose-500' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
               {role} active session
            </div>
          </div>

          <nav className="space-y-2">
            {currentItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold uppercase text-[11px] tracking-widest transition-all group ${
                  activeTab === item.id
                    ? (isDark ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-600')
                    : (isDark ? 'text-slate-400 hover:bg-slate-900 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-rose-600')
                }`}
              >
                <div className={`transition-transform group-hover:scale-110 ${
                  activeTab === item.id 
                    ? 'text-white' 
                    : (isDark ? 'text-rose-400' : 'text-slate-400 group-hover:text-rose-600')
                }`}>
                  {item.icon}
                </div>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

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
            className="w-full flex items-center justify-center gap-3 py-4 bg-rose-500 text-white hover:bg-rose-600 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-lg shadow-rose-500/20"
          >
            <LogOut className="w-4 h-4" /> Finalizar Turno
          </button>
        </div>
      </aside>
    </>
  );
}
