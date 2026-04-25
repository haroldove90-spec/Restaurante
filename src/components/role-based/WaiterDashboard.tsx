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

// Estilo de Alto Contraste para Meseros
export default function WaiterDashboard() {
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [orderItems, setOrderItems] = useState([
    { id: 1, name: 'Tacos Pastor', qty: 2, price: 12 },
    { id: 2, name: 'Coca Cola', qty: 1, price: 2.5 }
  ]);

  const mesas = [
    { id: 1, num: '01', status: 'ready', color: 'bg-emerald-500' },
    { id: 2, num: '02', status: 'busy', color: 'bg-rose-600' },
    { id: 3, num: '03', status: 'free', color: 'bg-slate-200' },
    { id: 4, num: '04', status: 'busy', color: 'bg-rose-600' },
    { id: 5, num: '05', status: 'free', color: 'bg-slate-200' },
    { id: 6, num: '06', status: 'paying', color: 'bg-amber-400' },
  ];

  if (selectedTable) {
    return (
      <div className="bg-slate-50 min-h-full p-6 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedTable(null)}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-900 border border-slate-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Mesa {selectedTable.num}</h1>
          <div className="ml-auto px-4 py-2 bg-rose-100 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-200">
             Ocupada
          </div>
        </div>

        <div className="flex-1 bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-8 flex-1 space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Detalle de Comanda</h3>
            {orderItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h4 className="text-xl font-bold uppercase text-slate-900">{item.name}</h4>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">${item.price} c/u</p>
                </div>
                <div className="flex items-center gap-4">
                   <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400">-</button>
                   <span className="text-2xl font-black w-8 text-center">{item.qty}</span>
                   <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm">+</button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-8 bg-slate-950 text-white flex justify-between items-center">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none">Total Consumo</p>
              <h2 className="text-4xl font-black mt-1">$26.50</h2>
            </div>
            <button className="px-8 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg transition-all active:scale-95">
              Enviar a Cocina
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-full p-8">
      <div className="mb-10 flex justify-between items-center">
        <h1 className="text-4xl font-black text-slate-900 border-l-8 border-indigo-600 pl-4">COMANDAS</h1>
        <div className="flex gap-4">
           <button className="bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-all">
              <Download className="w-4 h-4 text-slate-600" /> RESUMEN DÍA
           </button>
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
            onClick={() => {
              if (mesa.status !== 'free') setSelectedTable(mesa);
            }}
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
