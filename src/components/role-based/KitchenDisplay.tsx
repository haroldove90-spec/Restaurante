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
    <div className="bg-black min-h-screen flex flex-col">
      <header className="bg-rose-600 p-8 lg:p-12 flex justify-between items-center text-white shrink-0">
        <div>
          <div className="flex items-center gap-4">
            <Flame className="w-10 h-10 animate-pulse" />
            <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-none">ORDER SLIPS</h1>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mt-2">KDS Engine • Live Production</p>
        </div>
        <div className="hidden sm:flex items-center gap-6">
           <div className="text-right">
             <p className="text-[10px] font-black uppercase opacity-60">Status</p>
             <p className="text-xl font-black italic">Kitchen Active</p>
           </div>
           <div className="bg-white/20 px-6 py-4 rounded-3xl border border-white/20">
             <span className="text-2xl font-black italic">{tickets.length}</span>
           </div>
        </div>
      </header>

      <div className="p-6 lg:p-12 flex-1 overflow-x-auto scrollbar-hide flex items-center">
        <div className="flex gap-8 lg:gap-10 h-full items-start min-w-max">
          <AnimatePresence>
            {tickets.map((t) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -100 }}
                key={t.id}
                className="bg-white text-slate-900 w-[350px] lg:w-[450px] rounded-[3rem] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] shrink-0 border-t-[12px] border-rose-600 self-center"
              >
                <div className="bg-slate-950 p-6 lg:p-8 text-white flex justify-between items-start">
                  <div>
                    <span className="text-5xl lg:text-7xl font-black tracking-tighter italic leading-none">{t.mesas?.num || '??'}</span>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mt-2">TABLE IDENTIFIER</p>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                    <p className="text-[9px] font-black uppercase opacity-60">ORDER ID</p>
                    <p className="text-xs font-black tracking-widest">{t.id.slice(0, 5).toUpperCase()}</p>
                  </div>
                </div>

                <div className="p-8 lg:p-10 flex-1 space-y-6 max-h-[500px] overflow-y-auto scrollbar-hide">
                  {t.detalles_orden?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-6 group">
                      <div className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shrink-0 shadow-lg shadow-rose-200 group-hover:scale-110 transition-transform">
                        {item.cantidad}
                      </div>
                      <div className="flex-1">
                        <span className="text-xl lg:text-2xl font-black uppercase tracking-tighter leading-tight italic block">
                          {item.productos?.nombre}
                        </span>
                        <div className="h-1 w-full bg-slate-50 mt-1 rounded-full overflow-hidden">
                           <div className="h-full bg-slate-200 w-1/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 lg:p-8 bg-slate-50 border-t border-slate-100">
                  <button 
                    onClick={() => complete(t.id)}
                    className="w-full py-6 bg-slate-950 active:bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-xl lg:text-2xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl"
                  >
                    READY TO SERVE <CheckCircle className="w-8 h-8 text-emerald-400" />
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
