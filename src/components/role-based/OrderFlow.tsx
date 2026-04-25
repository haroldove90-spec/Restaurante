import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Search, 
  Trash2, 
  Plus, 
  Minus,
  CheckCircle2,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProducts, createOrder } from '../../lib/dataService';

interface OrderFlowProps {
  table: any;
  onBack: () => void;
  onSuccess: () => void;
}

export default function OrderFlow({ table, onBack, onSuccess }: OrderFlowProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
    }
  }

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.cantidad + delta);
        return { ...item, cantidad: newQty };
      }
      return item;
    }).filter(item => item.cantidad > 0));
  };

  const total = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  const handleSendToKitchen = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      // Nota: Aquí usaríamos el ID del mesero autenticado
      await createOrder(table.id, 'mesero-test-id', cart);
      onSuccess();
    } catch (e) {
      console.error(e);
      alert('Error al enviar la orden');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white min-h-full flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Selector de Productos (Estilo MENU Jushi) */}
      <div className="flex-1 flex flex-col bg-slate-50 border-r border-slate-200">
        <header className="bg-rose-600 p-6 lg:p-8 flex justify-between items-center text-white">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ChevronLeft className="w-8 h-8" />
            </button>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic">MENU</h1>
          </div>
          <div className="flex items-center gap-4 bg-black/20 px-4 py-2 rounded-full border border-white/20">
             <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse" />
             <span className="text-xl font-black tracking-tighter">${total.toFixed(2)}</span>
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-6 flex-1 overflow-y-auto scrollbar-hide">
          <div className="relative sticky top-0 z-10">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <input 
              type="text"
              placeholder="¿Qué te apetece hoy?"
              className="w-full bg-white border-2 border-transparent focus:border-rose-600 rounded-[2rem] py-6 pl-16 pr-6 text-lg font-bold shadow-xl outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
            {filteredProducts.map(p => (
              <div
                key={p.id}
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex gap-6 hover:shadow-2xl transition-all group"
              >
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-slate-100 rounded-[2rem] flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                   <Package className="w-12 h-12 text-slate-300 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl lg:text-2xl font-black text-slate-900 leading-tight">{p.nombre}</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{p.categorias?.nombre || 'General'}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="bg-rose-600 text-white px-4 py-1.5 rounded-lg text-lg font-black tracking-tighter italic">
                      ${p.precio}
                    </div>
                    <button
                      onClick={() => addToCart(p)}
                      className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center hover:bg-rose-500 transition-colors shadow-lg shadow-rose-200 active:scale-90"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen de Comanda (Estilo MY CART Jushi) */}
      <div className="w-full lg:w-[450px] bg-white flex flex-col shadow-2xl relative z-10 border-l lg:border-slate-200">
        <header className="p-8 border-b border-slate-100">
          <h2 className="text-4xl font-black uppercase tracking-tighter italic text-slate-950">MY CART</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600 mt-2">Mesa {table.num} • Pedido en curso</p>
        </header>
        
        <div className="flex-1 p-8 space-y-6 overflow-y-auto scrollbar-hide">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="grid grid-cols-[1fr,auto,auto] items-center gap-6 pb-6 border-b border-slate-50 last:border-0"
              >
                <div className="overflow-hidden">
                  <h4 className="font-black text-slate-900 text-base lg:text-lg uppercase leading-tight truncate">{item.nombre}</h4>
                  <p className="text-[11px] font-bold text-slate-400 mt-1 italic">${item.precio} unit.</p>
                </div>
                
                {/* Control de Cantidad Estilo Jushi */}
                <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-3">
                  <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-900 shadow-sm hover:text-rose-600 transition-colors"><Minus className="w-4 h-4" /></button>
                  <span className="font-black text-lg w-4 text-center">{item.cantidad}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-900 shadow-sm hover:text-rose-600 transition-colors"><Plus className="w-4 h-4" /></button>
                </div>

                <div className="text-right">
                  <p className="font-black text-lg lg:text-xl tracking-tighter text-rose-600 italic">
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
              <Plus className="w-16 h-16 mb-4 rotate-45 text-slate-400" />
              <p className="text-sm font-black uppercase tracking-widest">Carrito Vacío</p>
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
          <div className="flex justify-between items-end">
             <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Total comanda</p>
             <h2 className="text-5xl font-black text-slate-950 tracking-tighter italic">${total.toFixed(2)}</h2>
          </div>
          
          <button 
            disabled={cart.length === 0 || loading}
            onClick={() => setIsConfirming(true)}
            className="w-full py-6 bg-rose-600 disabled:bg-slate-200 text-white rounded-[1.5rem] font-black uppercase text-base tracking-[0.2em] shadow-2xl shadow-rose-500/20 active:scale-95 transition-all"
          >
            {loading ? 'PROCESANDO...' : 'ENVIAR PEDIDO'}
          </button>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <AnimatePresence>
        {isConfirming && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsConfirming(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black uppercase italic mb-2 tracking-tighter">¿CONFIRMAR COMANDA?</h3>
              <p className="text-slate-500 text-sm font-medium mb-10">La orden se enviará inmediatamente al sistema de producción en cocina.</p>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleSendToKitchen}
                  className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl shadow-rose-600/20 active:scale-95 transition-all"
                >
                  SÍ, ENVIAR AHORA
                </button>
                <button 
                  onClick={() => setIsConfirming(false)}
                  className="w-full py-5 bg-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl font-black uppercase text-sm tracking-widest transition-all"
                >
                  CORREGIR ORDEN
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
