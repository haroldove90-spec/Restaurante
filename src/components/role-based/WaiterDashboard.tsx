import React from 'react';
import { 
  Users, 
  Circle, 
  Plus, 
  Clock, 
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

// Estilo de Alto Contraste para Meseros
export default function WaiterDashboard() {
  const mesas = [
    { id: 1, num: '01', status: 'ready', color: 'bg-emerald-500' },
    { id: 2, num: '02', status: 'busy', color: 'bg-rose-600' },
    { id: 3, num: '03', status: 'free', color: 'bg-slate-200' },
    { id: 4, num: '04', status: 'busy', color: 'bg-rose-600' },
    { id: 5, num: '05', status: 'free', color: 'bg-slate-200' },
    { id: 6, num: '06', status: 'paying', color: 'bg-amber-400' },
  ];

  return (
    <div className="bg-white min-h-full p-8">
      <div className="mb-10 flex justify-between items-center">
        <h1 className="text-4xl font-black text-slate-900 border-l-8 border-indigo-600 pl-4">COMANDAS</h1>
        <div className="flex gap-4">
           <div className="bg-slate-100 px-6 py-4 rounded-2xl flex items-center gap-3">
              <Users className="w-6 h-6 text-slate-600" />
              <span className="text-xl font-black">12/24</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {mesas.map((mesa) => (
          <motion.button
            whileTap={{ scale: 0.95 }}
            key={mesa.id}
            className={`aspect-video rounded-[2rem] flex flex-col items-center justify-center gap-2 border-4 transition-all shadow-2xl relative overflow-hidden ${
              mesa.status === 'free' ? 'bg-white border-slate-200 text-slate-400' : `${mesa.color} border-white/20 text-white`
            }`}
          >
            <span className="text-5xl font-black tracking-tighter">{mesa.num}</span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">
              {mesa.status === 'free' ? 'Libre' : mesa.status === 'busy' ? 'Ocupada' : 'Cuenta'}
            </span>
            {mesa.status === 'ready' && (
              <div className="absolute top-4 right-4 bg-white text-emerald-600 p-2 rounded-full animate-bounce">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <button className="fixed bottom-8 right-8 w-20 h-20 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-500/50 flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
         <Plus className="w-10 h-10" />
      </button>
    </div>
  );
}
