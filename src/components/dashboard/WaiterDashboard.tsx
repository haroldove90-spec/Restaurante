import React, { useState } from 'react';
import { 
  Users, 
  CircleDot, 
  PlusCircle, 
  X, 
  ShoppingCart, 
  Search,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Mesa {
  id: number;
  numero: string;
  estado: 'libre' | 'ocupada' | 'por-pagar';
  comensales?: number;
}

const MESAS_MOCK: Mesa[] = [
  { id: 1, numero: 'Mesa 1', estado: 'libre' },
  { id: 2, numero: 'Mesa 2', estado: 'ocupada', comensales: 4 },
  { id: 3, numero: 'Mesa 3', estado: 'por-pagar', comensales: 2 },
  { id: 4, numero: 'Mesa 4', estado: 'libre' },
  { id: 5, numero: 'Mesa 5', estado: 'ocupada', comensales: 6 },
  { id: 6, numero: 'Mesa 6', estado: 'libre' },
  { id: 7, numero: 'Mesa 7', estado: 'libre' },
  { id: 8, numero: 'Mesa 8', estado: 'ocupada', comensales: 3 },
];

export default function WaiterDashboard() {
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null);

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Comandero Digital</h1>
          <p className="text-slate-500 font-bold text-sm">Mesero: Juan Pérez | Turno: Almuerzo</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-xs font-bold uppercase text-slate-600">Disponibles: 4</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {MESAS_MOCK.map((mesa) => (
          <MesaCard 
            key={mesa.id} 
            mesa={mesa} 
            onClick={() => tableAction(mesa)} 
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedMesa && (
          <OrderModal mesa={selectedMesa} onClose={() => setSelectedMesa(null)} />
        )}
      </AnimatePresence>
    </div>
  );

  function tableAction(mesa: Mesa) {
    if (mesa.estado === 'libre') {
      setSelectedMesa(mesa);
    }
  }
}

function MesaCard({ mesa, onClick }: any) {
  const colors = {
    'libre': 'bg-white border-emerald-500 text-emerald-600 shadow-emerald-100',
    'ocupada': 'bg-rose-500 border-rose-600 text-white shadow-rose-200',
    'por-pagar': 'bg-amber-400 border-amber-500 text-white shadow-amber-100',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`aspect-square rounded-3xl border-4 flex flex-col items-center justify-center gap-3 transition-all shadow-xl p-4 ${colors[mesa.estado]}`}
    >
      <CircleDot className={`w-8 h-8 ${mesa.estado === 'libre' ? 'opacity-100' : 'opacity-40'}`} />
      <span className="text-xl font-black uppercase tracking-tighter">{mesa.numero}</span>
      {mesa.comensales && (
        <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-white/20 px-2 py-1 rounded-full">
          <Users className="w-3 h-3" /> {mesa.comensales} Pers
        </span>
      )}
    </motion.button>
  );
}

function OrderModal({ mesa, onClose }: { mesa: Mesa, onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ y: 50, scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.9 }}
        className="bg-white w-full max-w-4xl h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-xl font-black">
              {mesa.numero.split(' ')[1]}
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">Nueva Comanda</h2>
              <p className="text-indigo-300 text-xs font-bold uppercase">Asignando Orden a {mesa.numero}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Menú Selection */}
          <div className="flex-[1.5] p-6 border-r border-slate-100 bg-slate-50/50 overflow-y-auto">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="BUSCAR PRODUCTO..." 
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl font-bold uppercase text-sm focus:border-indigo-500 focus:ring-0 transition-all outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProductItem name="Hamburguesa Pro" price="$15.00" category="Platos Fuertes" />
              <ProductItem name="Ceviche Clásico" price="$12.00" category="Entradas" />
              <ProductItem name="Coca Cola 500ml" price="$2.50" category="Bebidas" />
              <ProductItem name="Tiramisú Casa" price="$6.00" category="Postres" />
            </div>
          </div>

          {/* Current Order Summary */}
          <div className="flex-1 p-6 flex flex-col bg-white">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart className="w-6 h-6 text-indigo-600" />
              <h3 className="text-sm font-black uppercase text-slate-500 tracking-widest">Resumen de Cuenta</h3>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-black text-slate-800">1x Hamburguesa Pro</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Sin cebolla, Término 3/4</p>
                </div>
                <span className="font-bold text-slate-900">$15.00</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-200 space-y-4">
              <div className="flex justify-between text-xl font-black uppercase text-slate-900">
                <span>Total</span>
                <span>$15.00</span>
              </div>
              <button 
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-lg shadow-xl shadow-emerald-200 transition-all active:scale-[0.98]"
                onClick={onClose}
              >
                Enviar a Cocina
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProductItem({ name, price, category }: { name: string, price: string, category: string }) {
  return (
    <button className="p-4 bg-white border-2 border-slate-100 rounded-3xl hover:border-indigo-500 transition-all text-left flex justify-between items-center shadow-sm">
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{category}</p>
        <p className="text-sm font-black text-slate-800 uppercase">{name}</p>
      </div>
      <span className="text-sm font-black text-slate-900">{price}</span>
    </button>
  );
}
