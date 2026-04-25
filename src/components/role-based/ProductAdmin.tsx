import React, { useState, useEffect } from 'react';
import { getProducts, upsertProduct, deleteProduct } from '../../lib/dataService';
import { Plus, Edit2, Trash2, Save, X, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProductAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsertProduct(editingProduct);
      loadProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (e) {
      alert('Error al guardar');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (e) {
        alert('Error al eliminar');
      }
    }
  };

  return (
    <div className="p-8 bg-slate-950 min-h-full text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase italic italic tracking-tighter">Gestión de Productos</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Administración de Menú e Inventario</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct({ nombre: '', precio: 0 });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-2xl font-black uppercase text-xs transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" /> Nuevo Producto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <motion.div 
            layout
            key={p.id}
            className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] hover:border-slate-700 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
                <Package className="w-6 h-6" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    setEditingProduct(p);
                    setIsModalOpen(true);
                  }}
                  className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-amber-500" />
                </button>
                <button 
                  onClick={() => handleDelete(p.id)}
                  className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-1">{p.nombre}</h3>
            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{p.descripcion || 'Sin descripción'}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-black text-emerald-500">${p.precio}</span>
              <span className="bg-slate-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {p.categorias?.nombre || 'General'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-10 border border-slate-800 shadow-2xl"
            >
              <h3 className="text-2xl font-black uppercase italic mb-8">Editar Producto</h3>
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Nombre</label>
                  <input 
                    required
                    value={editingProduct.nombre}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nombre: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Precio</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.precio}
                    onChange={(e) => setEditingProduct({ ...editingProduct, precio: parseFloat(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Descripción</label>
                  <textarea 
                    value={editingProduct.descripcion || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, descripcion: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all h-32"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-slate-800 rounded-2xl font-black uppercase text-xs"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-emerald-600 rounded-2xl font-black uppercase text-xs shadow-lg shadow-emerald-500/20"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
