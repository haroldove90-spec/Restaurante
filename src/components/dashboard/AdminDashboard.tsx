import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  AlertTriangle,
  ArrowUpRight,
  Package,
  Calendar,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

const CHART_DATA = [
  { name: '10:00', sales: 400 },
  { name: '12:00', sales: 1200 },
  { name: '14:00', sales: 900 },
  { name: '16:00', sales: 600 },
  { name: '18:00', sales: 1500 },
  { name: '20:00', sales: 2400 },
  { name: '22:00', sales: 1100 },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-full bg-slate-900 text-slate-100 p-8 space-y-8 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Panel Administrativo</h1>
          <p className="text-slate-400 text-sm font-medium">Visualización de rendimiento en tiempo real</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-700 transition-colors">
            <Calendar className="w-4 h-4" /> Hoy: Abril 25
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-shadow shadow-lg shadow-indigo-500/20">
             Exportar Reporte
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Ventas Totales" 
          value="$4,250.32" 
          change="+12.5%" 
          trend="up" 
          icon={<DollarSign className="w-5 h-5" />} 
        />
        <MetricCard 
          label="Órdenes" 
          value="142" 
          change="+5.2%" 
          trend="up" 
          icon={<ShoppingBag className="w-5 h-5" />} 
        />
        <MetricCard 
          label="Plato Estrella" 
          value="Hamburguesa Pro" 
          subValue="45 ventas hoy"
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} 
        />
        <MetricCard 
          label="Stock Crítico" 
          value="3 Ítems" 
          trend="down"
          change="Acción Requerida"
          icon={<AlertTriangle className="w-5 h-5 text-rose-400" />} 
        />
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Sales Chart */}
        <div className="col-span-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold">Flujo de Ventas</h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded uppercase">Ventas Brutas</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                   dataKey="name" 
                   stroke="#64748b" 
                   fontSize={12} 
                   tickLine={false} 
                   axisLine={false} 
                />
                <YAxis 
                   stroke="#64748b" 
                   fontSize={12} 
                   tickLine={false} 
                   axisLine={false}
                   tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#f1f5f9', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                   type="monotone" 
                   dataKey="sales" 
                   stroke="#818cf8" 
                   strokeWidth={3}
                   fillOpacity={1} 
                   fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="col-span-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold">Alertas de Stock</h3>
            </div>
            <button className="text-xs text-indigo-400 font-bold hover:underline">Ver Todo</button>
          </div>
          
          <div className="space-y-4 flex-1">
             <InventoryItem name="Carne de Res 80/20" stock="2.5 kg" min="5.0 kg" status="critical" />
             <InventoryItem name="Pan Brioche" stock="12 uds" min="20 uds" status="low" />
             <InventoryItem name="Papas Prefiltas" stock="10 kg" min="15 kg" status="low" />
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
             <button className="text-xs font-bold text-slate-400 flex items-center justify-center gap-2 w-full py-3 hover:text-white transition-colors">
                Personalizar Rangos <Filter className="w-3 h-3" />
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ label, value, change, trend, icon, subValue }: any) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-indigo-400 border border-slate-700/50">
           {icon}
        </div>
        {change && (
          <div className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {subValue && <p className="text-emerald-400 text-[10px] font-bold mt-1 uppercase tracking-widest">{subValue}</p>}
      </div>
    </motion.div>
  );
}

function InventoryItem({ name, stock, min, status }: any) {
  return (
    <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl flex justify-between items-center group hover:border-indigo-500/50 transition-colors">
       <div>
         <p className="text-sm font-bold text-slate-200">{name}</p>
         <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest mt-1">
            <span className="text-slate-500">Actual: <span className={status === 'critical' ? 'text-rose-400' : 'text-amber-400'}>{stock}</span></span>
            <span className="text-slate-500">Mín: {min}</span>
         </div>
       </div>
       <div className={`w-2 h-2 rounded-full ${status === 'critical' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'}`} />
    </div>
  );
}
