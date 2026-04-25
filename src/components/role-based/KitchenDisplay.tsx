import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Timer, 
  Flame, 
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { updateOrderStatus, subscribeToOrders } from '../../lib/dataService';

export default function KitchenDisplay() {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    loadTickets();
    const subscription = subscribeToOrders(() => {
      loadTickets();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadTickets() {
    const { data, error } = await supabase
      .from('ordenes')
      .select('*, mesas(num), detalles_orden(*, productos(nombre))')
      .in('estado', ['pendiente', 'en_preparacion'])
      .order('created_at', { ascending: true });
    
    if (error) console.error(error);
    else setTickets(data || []);
  }

  const complete = async (id: string) => {
    try {
      await updateOrderStatus(id, 'listo');
      loadTickets();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-slate-950 min-h-full p-4 lg:p-6 text-white flex flex-col gap-4 lg:gap-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3 lg:gap-4">
          <Flame className="w-6 h-6 lg:w-8 lg:h-8 text-rose-500" />
          <h1 className="text-xl lg:text-3xl font-black uppercase italic tracking-tighter">Sistema de Cocina (KDS)</h1>
        </div>
        <div className="flex gap-3 lg:gap-4 w-full sm:w-auto sm:ml-auto">
          <button className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl text-[10px] lg:text-xs font-bold flex items-center justify-center gap-2 transition-all">
             <Download className="w-4 h-4" /> REPORTE
          </button>
          <div className="flex-1 sm:flex-none bg-slate-800 px-4 py-2.5 rounded-xl text-amber-500 font-bold border border-amber-500/20 text-[10px] lg:text-sm text-center">
             {tickets.length} ACTIVOS
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-6 scrollbar-hide">
        <div className="flex gap-4 lg:gap-6 h-full items-start min-w-max">
          <AnimatePresence>
            {tickets.map((t) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -100 }}
                key={t.id}
                className="bg-white text-slate-900 w-[300px] lg:w-[380px] rounded-[2rem] lg:rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl shrink-0 border-t-8 border-rose-500"
              >
                <div className="bg-slate-900 p-4 lg:p-6 text-white flex justify-between items-center">
                  <div>
                    <span className="text-3xl lg:text-4xl font-black tracking-tighter italic leading-none">{t.mesas?.num || '??'}</span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">ORDEN #{t.id.slice(0, 5)}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                    <Timer className="w-3 h-3 lg:w-4 lg:h-4 text-emerald-400" />
                    <span className="text-[10px] lg:text-sm font-bold uppercase tracking-widest">Activo</span>
                  </div>
                </div>

                <div className="p-6 lg:p-8 flex-1 space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide">
                  {t.detalles_orden?.map((item: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 border-b border-slate-100 pb-3 lg:pb-4 last:border-0">
                      <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm font-black shrink-0">
                        {item.cantidad}
                      </div>
                      <span className="text-base lg:text-xl font-bold uppercase tracking-tight leading-tight flex-1 pt-0.5">
                        {item.productos?.nombre}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 lg:p-6 bg-slate-50 border-t border-slate-100">
                  <button 
                    onClick={() => complete(t.id)}
                    className="w-full py-4 lg:py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.2rem] lg:rounded-[1.5rem] font-black uppercase text-base lg:text-xl flex items-center justify-center gap-2 lg:gap-3 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                  >
                    DESPACHAR <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {tickets.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center opacity-20 py-32 flex-1">
              <Flame className="w-24 h-24 mb-4" />
              <h2 className="text-2xl font-black uppercase tracking-tighter">Sin pedidos pendientes</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
