import React, { useState } from 'react';
import { 
  CheckCircle, 
  Timer, 
  Flame, 
  ChevronRight,
  ClipboardList,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function KitchenDisplay() {
  const [tickets, setTickets] = useState([
    { id: 1, mesa: 'M05', items: ['Hamburguesa Pro', 'Papas Fritas'], time: '12m', priority: 'high' },
    { id: 2, mesa: 'M02', items: ['Pizza Pepperoni', 'Ensalada Cesar'], time: '5m', priority: 'normal' },
    { id: 3, mesa: 'M08', items: ['Lomo Saltado', 'Coca Cola'], time: '2m', priority: 'low' },
  ]);

  const complete = (id: number) => {
    setTickets(tickets.filter(t => t.id !== id));
  };

  return (
    <div className="bg-slate-950 min-h-full p-6 text-white flex flex-col gap-6">
      <div className="flex items-center gap-4 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
        <Flame className="w-8 h-8 text-rose-500" />
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Sistema de Cocina (KDS)</h1>
        <div className="ml-auto flex gap-4">
          <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
             <Download className="w-4 h-4" /> EFICIENCIA
          </button>
          <div className="bg-slate-800 px-4 py-2 rounded-xl text-amber-500 font-bold border border-amber-500/20">
             {tickets.length} PEDIDOS ACTIVOS
          </div>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 h-full items-start">
        <AnimatePresence>
          {tickets.map((t) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -100 }}
              key={t.id}
              className="bg-white text-slate-900 w-[380px] rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl shrink-0"
            >
              <div className={`${t.priority === 'high' ? 'bg-rose-600' : 'bg-slate-900'} p-6 text-white flex justify-between items-center`}>
                <span className="text-4xl font-black tracking-tighter italic">{t.mesa}</span>
                <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
                  <Timer className="w-4 h-4" />
                  <span className="text-sm font-bold">{t.time}</span>
                </div>
              </div>

              <div className="p-8 flex-1 space-y-4">
                {t.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 border-b border-slate-100 pb-4 last:border-0">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                    <span className="text-xl font-bold uppercase tracking-tight">{item}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => complete(t.id)}
                className="mx-6 mb-6 py-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.5rem] font-black uppercase text-xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 transition-all active:scale-95"
              >
                PLATILLO LISTO <CheckCircle className="w-6 h-6" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
