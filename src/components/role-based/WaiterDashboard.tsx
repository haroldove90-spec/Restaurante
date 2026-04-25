import React, { useState } from 'react';
import { 
  Users, 
  Circle, 
  Plus, 
  Clock, 
  AlertCircle,
  Download,
  Utensils,
  ChevronLeft,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import OrderFlow from './OrderFlow';

// Estilo de Alto Contraste para Meseros
export default function WaiterDashboard() {
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [isOrdering, setIsOrdering] = useState(false);

  const mesas = [
    { id: 1, num: '01', status: 'ready', color: 'bg-emerald-500', label: 'Cuenta Pedida' },
    { id: 2, num: '02', status: 'busy', color: 'bg-rose-600', label: 'Comiendo' },
    { id: 3, num: '03', status: 'free', color: 'bg-slate-100', label: 'Libre' },
    { id: 4, num: '04', status: 'waiting', color: 'bg-indigo-600', label: 'Esperando' },
    { id: 5, num: '05', status: 'free', color: 'bg-slate-100', label: 'Libre' },
    { id: 6, num: '06', status: 'paying', color: 'bg-amber-400', label: 'Pagando' },
  ];

  if (isOrdering && selectedTable) {
    return (
      <OrderFlow 
        table={selectedTable} 
        onBack={() => setIsOrdering(false)} 
        onSuccess={() => {
          setIsOrdering(false);
          setSelectedTable(null);
        }}
      />
    );
  }

  if (selectedTable) {
    return (
      <div className="bg-slate-50 min-h-full p-4 lg:p-6 flex flex-col gap-4 lg:gap-6">
        <div className="flex items-center gap-3 lg:gap-4">
          <button 
            onClick={() => setSelectedTable(null)}
            className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-900 border border-slate-200"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
          <h1 className="text-xl lg:text-3xl font-black uppercase tracking-tighter">Mesa {selectedTable.num}</h1>
          <div className={`ml-auto px-3 py-1.5 rounded-lg text-[9px] lg:text-[10px] font-black uppercase tracking-widest border ${
            selectedTable.status === 'busy' ? 'bg-rose-100 text-rose-600 border-rose-200' : 
            selectedTable.status === 'waiting' ? 'bg-indigo-100 text-indigo-600 border-indigo-200' :
            'bg-amber-100 text-amber-600 border-amber-200'
          }`}>
             {selectedTable.label || 'Ocupada'}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-[2rem] lg:rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 lg:p-8 flex-1 space-y-4 lg:space-y-6 overflow-y-auto">
            <h3 className="text-[10px] lg:text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Acciones de Mesa</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <button 
                 onClick={() => setIsOrdering(true)}
                 className="p-8 bg-indigo-50 border-2 border-indigo-100 rounded-3xl flex flex-col items-center gap-4 hover:border-indigo-600 transition-all group"
               >
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8" />
                 </div>
                 <span className="text-sm font-black uppercase tracking-widest text-indigo-900">Nueva Comanda</span>
               </button>
               
               <button className="p-8 bg-slate-50 border-2 border-slate-100 rounded-3xl flex flex-col items-center gap-4 hover:border-slate-400 transition-all group">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Download className="w-8 h-8 rotate-180" />
                 </div>
                 <span className="text-sm font-black uppercase tracking-widest text-slate-900">Pedir Cuenta</span>
               </button>
            </div>
          </div>
          <div className="p-6 lg:p-8 bg-slate-950 text-white flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center text-center sm:text-left">
            <div>
              <p className="text-slate-500 text-[9px] lg:text-[10px] font-black uppercase tracking-widest leading-none">Última actividad</p>
              <h2 className="text-xl lg:text-2xl font-black mt-1">Hace 12 min</h2>
            </div>
            <button className="w-full sm:w-auto px-8 py-4 lg:py-5 bg-rose-600 hover:bg-rose-500 rounded-2xl font-black uppercase text-[10px] lg:text-xs tracking-[0.2em] shadow-lg transition-all active:scale-95">
              Cerrar Mesa
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <header className="bg-rose-600 p-8 lg:p-12 flex justify-between items-center text-white shrink-0">
        <div>
          <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-none">TABLES</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mt-2">Gestión de Salón en Tiempo Real</p>
        </div>
        <div className="hidden sm:flex items-center gap-6">
           <div className="text-right">
             <p className="text-[10px] font-black uppercase opacity-60">Status</p>
             <p className="text-xl font-black italic">Operativo</p>
           </div>
           <div className="w-16 h-16 bg-black/20 rounded-full flex items-center justify-center border border-white/20">
             <div className="w-4 h-4 bg-emerald-400 rounded-full animate-ping" />
           </div>
        </div>
      </header>

      <div className="p-6 lg:p-12 flex-1 overflow-y-auto scrollbar-hide">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 lg:gap-8">
          {mesas.map((mesa) => (
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              key={mesa.id}
              onClick={() => setSelectedTable(mesa)}
              className={`
                aspect-square rounded-[3rem] p-8 flex flex-col justify-between items-center text-center transition-all shadow-xl relative overflow-hidden group
                ${mesa.status === 'free' ? 'bg-white text-slate-900 border-2 border-slate-100 hover:border-rose-600' : 
                  mesa.status === 'busy' ? 'bg-slate-950 text-white' : 
                  'bg-rose-600 text-white shadow-rose-500/20'}
              `}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-5 rounded-bl-full transform translate-x-12 -translate-y-12" />
              
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">NÚMERO</span>
              <span className="text-5xl lg:text-6xl font-black italic tracking-tighter">{mesa.num}</span>
              <div className="flex flex-col items-center gap-1">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${mesa.status === 'free' ? 'bg-slate-100 text-slate-500' : 'bg-white/20 text-white'}`}>
                  {mesa.label}
                </span>
              </div>
              
              {/* Indicador de acción hover */}
              <div className="absolute inset-0 bg-rose-600/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                 <Plus className="w-12 h-12 text-rose-600" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
