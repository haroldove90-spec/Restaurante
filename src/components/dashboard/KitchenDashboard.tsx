import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Timer,
  ChevronRight,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrderItem {
  id: number;
  name: string;
  qty: number;
  notes?: string;
}

interface Order {
  id: string;
  mesa: string;
  time: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready';
}

const INITIAL_ORDERS: Order[] = [
  {
    id: '#1024',
    mesa: 'MESA 5',
    time: '12:45',
    status: 'pending',
    items: [
      { id: 1, name: 'Hamburguesa Triple Pro', qty: 2, notes: 'Sin Pepinillos' },
      { id: 2, name: 'Papas Fritas XL', qty: 1 },
      { id: 3, name: 'Coca Cola Zero', qty: 1 }
    ]
  },
  {
    id: '#1025',
    mesa: 'MESA 2',
    time: '12:50',
    status: 'preparing',
    items: [
      { id: 4, name: 'Pizza Pepperoni Grande', qty: 1, notes: 'Borde de Queso' },
      { id: 5, name: 'Alitas x12', qty: 1 }
    ]
  },
  {
    id: '#1026',
    mesa: 'MESA 8',
    time: '12:55',
    status: 'pending',
    items: [
      { id: 6, name: 'Lomo Saltado', qty: 1, notes: 'Término Medio' }
    ]
  }
];

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const updateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="min-h-full bg-slate-950 p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center animate-pulse">
            <Timer className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">KDS - Control de Cocina</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Kitchen Display System v2.0</p>
          </div>
        </div>
        
        <div className="flex gap-4">
           <KPICard label="Pendientes" value={orders.filter(o => o.status === 'pending').length} color="amber" />
           <KPICard label="En Curso" value={orders.filter(o => o.status === 'preparing').length} color="indigo" />
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-w-max">
          <AnimatePresence>
            {orders.filter(o => o.status !== 'ready').map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onAction={() => {
                  if (order.status === 'pending') updateStatus(order.id, 'preparing');
                  else updateStatus(order.id, 'ready');
                }} 
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, onAction }: any) {
  const isPreparing = order.status === 'preparing';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`w-[400px] bg-white rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl ${isPreparing ? 'ring-8 ring-indigo-500/30' : ''}`}
    >
      <div className={`p-6 flex justify-between items-center ${isPreparing ? 'bg-indigo-600' : 'bg-slate-900'} text-white`}>
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Pedido {order.id}</span>
          <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">{order.mesa}</h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Recibido</p>
          <div className="flex items-center gap-1 text-xl font-black">
            <Clock className="w-4 h-4" />
            {order.time}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-4 p-4 rounded-3xl bg-slate-50 border-2 border-slate-100">
            <div className="w-12 h-12 bg-white rounded-2xl border-2 border-slate-200 flex items-center justify-center text-xl font-black text-slate-800">
              {item.qty}
            </div>
            <div className="flex-1">
              <p className="text-lg font-black uppercase text-slate-900 tracking-tight">{item.name}</p>
              {item.notes && (
                <div className="mt-1 flex items-center gap-1 text-rose-600">
                  <AlertCircle className="w-3 h-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.notes}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-4">
        <button className="py-5 bg-white border-4 border-slate-200 text-slate-400 rounded-[1.5rem] flex items-center justify-center hover:bg-slate-100 transition-all">
          <Printer className="w-8 h-8" />
        </button>
        <button 
          onClick={onAction}
          className={`py-5 rounded-[1.5rem] flex items-center justify-center gap-3 font-black uppercase tracking-widest text-lg shadow-xl shadow-indigo-200 transition-all active:scale-[0.98] ${
            isPreparing ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-indigo-600 text-white'
          }`}
        >
          {isPreparing ? (
            <>
              LISTO
              <CheckCircle2 className="w-6 h-6" />
            </>
          ) : (
            <>
              EMPEZAR
              <ChevronRight className="w-6 h-6" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

function KPICard({ label, value, color }: { label: string, value: number, color: string }) {
  const colors: any = {
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30',
  };

  return (
    <div className={`px-6 py-3 rounded-2xl border ${colors[color]} flex flex-col items-center min-w-[120px]`}>
       <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</span>
       <span className="text-3xl font-black">{value}</span>
    </div>
  );
}
