import React, { useState, useEffect } from 'react';
import { getProducts, upsertProduct, deleteProduct, getInventory, updateStock } from '../../lib/dataService';
import { Plus, Edit2, Trash2, Save, X, Package, FileText, Download, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { exportToPDF, exportToExcel } from '../../lib/exportUtils';

export default function ProductAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInventoryTab, setIsInventoryTab] = useState(false);
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    loadProducts();
    loadInventory();
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

  const loadInventory = async () => {
    try {
      const data = await getInventory();
      setInventory(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportPDF = () => {
    const cols = ['Nombre', 'Precio', 'Categoría'];
    const data = products.map(p => [p.nombre, `$${p.precio}`, p.categorias?.nombre || 'General']);
    exportToPDF('Menú de Productos', cols, data);
  };

  const handleExportExcel = () => {
    const data = products.map(p => ({
      Nombre: p.nombre,
      Precio: p.precio,
      Categoria: p.categorias?.nombre || 'General'
    }));
    exportToExcel('Inventario_Restaurante', data);
  };

  const handleQuickStockUpdate = async (id: string, current: number) => {
    const val = prompt('Nuevo stock disponible:', current.toString());
    if (val !== null) {
      const newVal = parseInt(val);
      if (!isNaN(newVal)) {
        try {
          await updateStock(id, newVal);
          loadInventory();
        } catch (e) {
          alert('Error al actualizar stock');
        }
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
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
    if (confirm('¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (e) {
        alert('Error al eliminar');
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <header className="bg-rose-600 p-8 lg:p-12 flex flex-col md:flex-row justify-between items-start md:items-center text-white gap-6">
        <div>
          <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-none">ADMIN</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mt-2">Control Maestro de Operaciones</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button onClick={handleExportPDF} className="flex-1 md:flex-none p-4 bg-black/20 border border-white/20 rounded-2xl flex items-center justify-center gap-2 hover:bg-black/30 transition-all font-black text-[10px] tracking-widest uppercase">
            <FileText className="w-5 h-5" /> PDF
          </button>
          <button onClick={handleExportExcel} className="flex-1 md:flex-none p-4 bg-black/20 border border-white/20 rounded-2xl flex items-center justify-center gap-2 hover:bg-black/30 transition-all font-black text-[10px] tracking-widest uppercase">
            <Download className="w-5 h-5" /> EXCEL
          </button>
          <button 
            onClick={() => {
              setEditingProduct({ nombre: '', precio: 0 });
              setIsModalOpen(true);
            }}
            className="w-full md:w-auto p-4 bg-white text-rose-600 rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-50 transition-all font-black text-[10px] tracking-widest uppercase shadow-xl"
          >
            <Plus className="w-5 h-5" /> NUEVO
          </button>
        </div>
      </header>

      <div className="p-6 lg:p-12 flex-1 overflow-y-auto scrollbar-hide">
        <div className="flex gap-8 mb-12 border-b border-slate-200">
          <button 
            onClick={() => setIsInventoryTab(false)}
            className={`text-sm font-black uppercase tracking-[0.2em] pb-4 transition-all relative ${!isInventoryTab ? 'text-rose-600 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-rose-600' : 'text-slate-400'}`}
          >
            PRODUCTOS
          </button>
          <button 
            onClick={() => setIsInventoryTab(true)}
            className={`text-sm font-black uppercase tracking-[0.2em] pb-4 transition-all relative ${isInventoryTab ? 'text-rose-600 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-rose-600' : 'text-slate-400'}`}
          >
            STOCK
          </button>
        </div>

      {!isInventoryTab ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {products.map((p) => (
            <motion.div 
              layout
              key={p.id}
              className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] hover:border-slate-700 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
                  <Package className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <div className="flex gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setEditingProduct(p);
                      setIsModalOpen(true);
                    }}
                    className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-amber-500" />
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg lg:text-xl font-black uppercase tracking-tight mb-1">{p.nombre}</h3>
              <p className="text-slate-500 text-xs lg:text-sm mb-4 line-clamp-2 h-8 lg:h-10">{p.descripcion || 'Sin descripción'}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl lg:text-2xl font-black text-emerald-500">${p.precio}</span>
                <span className="bg-slate-800 px-3 py-1 rounded-full text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {p.categorias?.nombre || 'General'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-white">
                <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] opacity-60">Producto</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] opacity-60">Stock Actual</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] opacity-60 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-8">
                    <p className="font-black text-slate-950 uppercase text-lg leading-none">{inv.productos?.nombre}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">{inv.productos?.categorias?.nombre}</p>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <span className={`text-3xl font-black italic tracking-tighter ${inv.stock_actual <= 5 ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>
                        {inv.stock_actual}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">unidades</span>
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <button 
                      onClick={() => handleQuickStockUpdate(inv.id, inv.stock_actual)}
                      className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:border-rose-600 transition-all text-slate-400 hover:text-rose-600 shadow-sm"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>

      <AnimatePresence>
        {isModalOpen && editingProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-slate-900 w-full max-w-lg rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-10 border border-slate-800 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl lg:text-2xl font-black uppercase italic tracking-tighter">Editar Producto</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-500 lg:hidden">
                   <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Nombre</label>
                  <input 
                    required
                    value={editingProduct.nombre}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nombre: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Precio</label>
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
                  <label className="block text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Descripción</label>
                  <textarea 
                    value={editingProduct.descripcion || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, descripcion: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all h-24 lg:h-32"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-slate-800 rounded-2xl font-black uppercase text-xs order-2 sm:order-1"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-emerald-600 rounded-2xl font-black uppercase text-xs shadow-lg shadow-emerald-500/20 order-1 sm:order-2"
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
