import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Box,
  ArrowUpRight,
  FileText,
  Download
} from 'lucide-react';
import { motion } from 'motion/react';
import { exportToPDF, exportToExcel } from '../../lib/exportUtils';
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

export default function AdminStats() {
  const handleExportPDF = () => {
    const headers = [['Módulo', 'Valor', 'Tendencia']];
    const data = [
      ['Ingresos de Hoy', '$2,450.00', '+14%'],
      ['Órdenes Activas', '18', '+3'],
      ['Satisfacción', '98%', '+0.5%'],
      ['Plato Estrella', 'Hambur. Pro', '48 platos'],
    ];
    exportToPDF('Reporte General Administrativo', headers, data, 'admin_report_restaurant_pro');
  };

  const handleExportExcel = () => {
    const data = [
      { Modulo: 'Ingresos de Hoy', Valor: '$2,450.00', Cambio: '+14%' },
      { Modulo: 'Órdenes Activas', Valor: '18', Cambio: '+3' },
      { Modulo: 'Satisfacción', Valor: '98%', Cambio: '+0.5%' },
    ];
    exportToExcel(data, 'admin_data_restaurant_pro');
  };

  return (
    <div className="bg-slate-950 min-h-full p-8 text-slate-100 space-y-10 overflow-y-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">Análisis de Operaciones</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Admin Dashboard v1.2</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={handleExportPDF}
             className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold uppercase flex items-center gap-2 hover:bg-slate-800 transition-colors"
           >
             <FileText className="w-4 h-4 text-rose-500" /> Exportar PDF
           </button>
           <button 
             onClick={handleExportExcel}
             className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold uppercase flex items-center gap-2 hover:bg-slate-800 transition-colors"
           >
             <Download className="w-4 h-4 text-emerald-500" /> Exportar Excel
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Ingresos de Hoy" value="$2,450.00" change="+14%" icon={<DollarSign />} color="indigo" />
        <StatCard label="Órdenes Activas" value="18" change="+3" icon={<ShoppingBag />} color="emerald" />
        <StatCard label="Satisfacción" value="98%" change="+0.5%" icon={<TrendingUp />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10">
            <h3 className="text-xl font-black uppercase mb-8 flex items-center gap-3">
              <Box className="w-6 h-6 text-indigo-500" /> Ocupación del Salón
            </h3>
            <div className="space-y-8">
               <ProgressBar label="Almuerzo" value={85} color="bg-indigo-500" />
               <ProgressBar label="Cena" value={45} color="bg-emerald-500" />
               <ProgressBar label="Eventos" value={12} color="bg-slate-700" />
            </div>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
               <h4 className="text-lg font-black uppercase italic mb-2">Plato Estrella</h4>
               <p className="text-4xl font-black tracking-tighter">Hambur. Pro</p>
               <p className="text-indigo-200 text-xs mt-2 font-bold uppercase tracking-widest">48 platos hoy</p>
            </div>
            
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-[2rem] p-8">
               <h4 className="text-rose-400 text-xs font-black uppercase tracking-widest mb-4">Stock Bajo</h4>
               <ul className="space-y-3">
                  <li className="flex justify-between text-sm font-bold"><span className="text-slate-300">Carne Res</span> <span className="text-rose-500">2.5kg</span></li>
                  <li className="flex justify-between text-sm font-bold"><span className="text-slate-300">Cerveza IPA</span> <span className="text-rose-500">5 uds</span></li>
               </ul>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, icon, color }: any) {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-white/5 ${color === 'indigo' ? 'bg-indigo-500/20 text-indigo-400' : color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
        <div className="mt-2 flex items-center gap-1 text-[10px] font-black text-emerald-400">
           <ArrowUpRight className="w-3 h-3" /> {change} HASTA AHORA
        </div>
      </div>
    </motion.div>
  );
}

function ProgressBar({ label, value, color }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-4 bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full rounded-full ${color} shadow-[0_0_15px_rgba(99,102,241,0.4)]`} 
        />
      </div>
    </div>
  );
}
