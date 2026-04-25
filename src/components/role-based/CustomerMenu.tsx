import React, { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../../lib/dataService';
import { Search, ShoppingBasket, Info, Flame, Leaf, Star, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CustomerMenu() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pData, cData] = await Promise.all([getProducts(), getCategories()]);
      setProducts(pData || []);
      setCategories(cData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.categoria_id === activeCategory;
    const matchesSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) || 
                         (p.descripcion && p.descripcion.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero Header */}
      <header className="bg-rose-600 px-6 py-12 relative overflow-hidden text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-24 -translate-y-24" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Restaurant Pro</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80 mt-2">Menú Digital Interactivo</p>
            </div>
            <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>
          </div>

          {/* Buscador */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300" />
            <input 
              type="text"
              placeholder="¿Qué se te antoja hoy?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-full py-4 pl-12 pr-6 text-sm font-bold placeholder:text-rose-200 outline-none focus:bg-white focus:text-slate-900 transition-all shadow-xl"
            />
          </div>
        </div>
      </header>

      {/* Categorías (Scroll Horizontal) */}
      <div className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200">
        <div className="flex overflow-x-auto py-4 px-4 gap-3 no-scrollbar">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              activeCategory === 'all' ? 'bg-rose-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'
            }`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeCategory === cat.id ? 'bg-rose-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Listado de Productos */}
      <main className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p) => (
              <motion.div 
                layout
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white group rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100"
              >
                {/* Imagen del Producto */}
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                  {p.imagen_url ? (
                    <img 
                      src={p.imagen_url} 
                      alt={p.nombre} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Star className="w-12 h-12" />
                    </div>
                  )}
                  
                  {/* Etiquetas Visuales */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {p.precio > 50 && (
                      <span className="bg-rose-600 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                        <Flame className="w-3 h-3" /> Recomendado
                      </span>
                    )}
                    {p.nombre.toLowerCase().includes('ensalada') && (
                      <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                        <Leaf className="w-3 h-3" /> Healthy
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-2xl font-black italic uppercase tracking-tighter drop-shadow-lg">{p.nombre}</p>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-slate-400 text-[10px] font-bold leading-relaxed uppercase tracking-widest mb-6 h-10 line-clamp-2">
                    {p.descripcion || 'Una experiencia gastronómica única preparada con ingredientes locales de la más alta calidad.'}
                  </p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">A la carta</span>
                      <span className="text-2xl font-black text-rose-600 italic tracking-tighter">${p.precio}</span>
                    </div>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-rose-600 transition-colors">
                      <span className="text-[10px] font-black uppercase tracking-widest">Detalles</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-4">
            <Search className="w-16 h-16 opacity-20" />
            <p className="text-sm font-black uppercase tracking-widest italic opacity-50">No hay platos que coincidan</p>
          </div>
        )}
      </main>

      {/* Floating Action Button for Service (Dummy) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button className="bg-slate-900 text-white px-8 py-5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 hover:scale-105 active:scale-95 transition-all border border-white/10 group">
          <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center">
            <ShoppingBasket className="w-4 h-4 text-white" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Solicitar Atención</span>
        </button>
      </div>

      {/* Decorative footer */}
      <footer className="mt-12 text-center pb-32">
        <div className="w-12 h-1 w-24 bg-slate-200 mx-auto mb-6" />
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">Restaurant Pro &copy; 2026</p>
      </footer>
    </div>
  );
}
