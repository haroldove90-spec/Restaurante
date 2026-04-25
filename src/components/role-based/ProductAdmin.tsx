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
              className="bg-white border-2 border-slate-100 p-8 rounded-none hover:border-rose-600 transition-all group relative overflow-hidden shadow-sm hover:shadow-xl"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-600/5 rounded-bl-full transform translate-x-12 -translate-y-12 transition-transform group-hover:scale-150" />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-14 h-14 bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-200">
                  <Package className="w-7 h-7" />
                </div>
                <div className="flex gap-2 lg:opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <button 
                    onClick={() => {
                      setEditingProduct(p);
                      setIsModalOpen(true);
                    }}
                    className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-rose-600 transition-colors shadow-lg"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="w-10 h-10 bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-2 text-slate-950 leading-none">{p.nombre}</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6 line-clamp-2 h-10 leading-relaxed">{p.descripcion || 'Sin descripción técnica disponible'}</p>
                
                <div className="flex justify-between items-end border-t border-slate-50 pt-6 mt-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Precio Unitario</span>
                    <span className="text-3xl font-black text-rose-600 italic tracking-tighter leading-none">${p.precio}</span>
                  </div>
                  <span className="bg-slate-950 text-white px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] italic">
                    {p.categorias?.nombre || 'General'}
                  </span>
                </div>
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
              className="relative bg-white w-full max-w-xl rounded-none p-12 border-t-[12px] border-rose-600 shadow-[0_0_100px_rgba(0,0,0,0.3)] overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-none text-slate-950">PRODUCTO</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Configuración Técnica de Ítem</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-12 h-12 bg-slate-100 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all transform hover:rotate-90"
                >
                   <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="space-y-10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Denominación</label>
                    <input 
                      required
                      value={editingProduct.nombre}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nombre: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-none p-5 text-lg font-black uppercase tracking-tight focus:border-rose-600 outline-none transition-all placeholder:text-slate-300"
                      placeholder="Nombre del Producto"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Valor Mercadeo</label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-rose-600">$</span>
                        <input 
                          type="number"
                          step="0.01"
                          required
                          value={editingProduct.precio}
                          onChange={(e) => setEditingProduct({ ...editingProduct, precio: parseFloat(e.target.value) })}
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-none p-5 pl-10 text-xl font-black italic tracking-tighter focus:border-rose-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Categoría ID</label>
                      <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-none p-5 text-sm font-black uppercase tracking-widest focus:border-rose-600 outline-none transition-all">
                        <option>GENERAL</option>
                        <option>ENTRADAS</option>
                        <option>PLATOS FUERTES</option>
                        <option>BEBIDAS</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Atributos / Descripción</label>
                    <textarea 
                      value={editingProduct.descripcion || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, descripcion: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-none p-5 text-sm font-bold focus:border-rose-600 outline-none transition-all h-32 resize-none"
                      placeholder="Detalles de preparación e insumos..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-5 bg-slate-100 text-slate-400 hover:bg-black hover:text-white rounded-none font-black uppercase text-xs tracking-widest transition-all"
                  >
                    CANCELAR
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-5 bg-rose-600 text-white rounded-none font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-rose-600/20 hover:bg-black transition-all"
                  >
                    GUARDAR CAMBIOS
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
