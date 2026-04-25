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
    { id: 4, num: '04', status: 'waiting', color: 'bg-slate-950', label: 'Esperando' },
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
      <div className="bg-slate-50 min-h-screen flex flex-col">
        <header className="bg-rose-600 p-8 lg:p-12 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSelectedTable(null)}
              className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all border border-white/20"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <div>
              <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter italic leading-none">TABLE {selectedTable.num}</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mt-2">Gestión de Servicio</p>
            </div>
          </div>
          <div className="hidden sm:block bg-black/20 px-6 py-3 rounded-2xl border border-white/20">
             <span className="text-sm font-black uppercase tracking-widest">{selectedTable.label || 'Ocupada'}</span>
          </div>
        </header>

        <div className="p-8 lg:p-12 flex-1 space-y-8 overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
             {/* Opción Pedir */}
             <button 
               onClick={() => setIsOrdering(true)}
               className="bg-white p-12 rounded-[3.5rem] flex flex-col items-center gap-8 hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-100 group"
             >
               <div className="w-24 h-24 bg-rose-600 text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-rose-200 group-hover:scale-110 transition-transform">
                  <Plus className="w-12 h-12" />
               </div>
               <div className="text-center">
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic text-slate-950">REDACTAR COMANDA</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Añadir productos al pedido</p>
               </div>
             </button>
             
             {/* Opción Cuenta */}
             <button className="bg-slate-950 p-12 rounded-[3.5rem] flex flex-col items-center gap-8 hover:shadow-2xl hover:-translate-y-2 transition-all group">
               <div className="w-24 h-24 bg-white text-slate-950 rounded-[2rem] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Download className="w-12 h-12 rotate-180" />
               </div>
               <div className="text-center text-white">
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">SOLICITAR CUENTA</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-2">Pre-ticket para el cliente</p>
               </div>
             </button>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping" />
               <div>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Estado del Servicio</p>
                 <p className="text-xl font-black italic uppercase text-slate-900">Mesa Activa • 12:45 PM</p>
               </div>
            </div>
            <button className="w-full md:w-auto px-12 py-6 bg-rose-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] italic shadow-2xl shadow-rose-200 active:scale-95 transition-all">
              FINALIZAR Y LIBERAR
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
