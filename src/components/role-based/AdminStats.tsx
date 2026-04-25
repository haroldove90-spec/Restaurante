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
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <header className="bg-rose-600 p-8 lg:p-12 flex justify-between items-center text-white shrink-0">
        <div>
          <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-none">ANÁLISIS</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mt-2">Inteligencia de Negocio v2.0</p>
        </div>
        <div className="hidden sm:flex gap-4">
           <button 
             onClick={handleExportPDF}
             className="px-6 py-4 bg-black/20 border border-white/20 rounded-2xl flex items-center justify-center gap-3 hover:bg-black/30 transition-all font-black text-xs tracking-widest uppercase"
           >
             <FileText className="w-5 h-5" /> PDF
           </button>
           <button 
             onClick={handleExportExcel}
             className="px-6 py-4 bg-black/20 border border-white/20 rounded-2xl flex items-center justify-center gap-3 hover:bg-black/30 transition-all font-black text-xs tracking-widest uppercase"
           >
             <Download className="w-5 h-5" /> EXCEL
           </button>
        </div>
      </header>

      <div className="p-8 lg:p-12 space-y-12 overflow-y-auto scrollbar-hide">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatCard label="Ingresos de Hoy" value="$2,450.00" change="+14%" icon={<DollarSign />} color="rose" />
          <StatCard label="Órdenes Activas" value="18" change="+3" icon={<ShoppingBag />} color="black" />
          <StatCard label="Satisfacción" value="98%" change="+0.5%" icon={<TrendingUp />} color="rose" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-10 flex items-center gap-4">
                <Box className="w-8 h-8 text-rose-600" /> OCUPACIÓN DEL SALÓN
              </h3>
              <div className="space-y-10">
                 <ProgressBar label="Almuerzo" value={85} color="bg-rose-600" />
                 <ProgressBar label="Cena" value={45} color="bg-slate-950" />
                 <ProgressBar label="Eventos" value={12} color="bg-slate-200" />
              </div>
           </div>

           <div className="lg:col-span-4 space-y-8">
              <div className="bg-black rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                 <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                 <h4 className="text-[10px] uppercase font-black tracking-widest text-white/50 mb-4">PRODUCTO TOP</h4>
                 <p className="text-4xl lg:text-5xl font-black tracking-tighter italic uppercase leading-none">TACOS AL PASTOR</p>
                 <div className="mt-8 inline-block bg-rose-600 px-6 py-2 font-black text-xs italic tracking-widest">
                    64 VENDIDOS HOY
                 </div>
              </div>
              
              <div className="bg-white border-4 border-rose-600 rounded-[3rem] p-10 shadow-xl">
                 <h4 className="text-rose-600 text-xs font-black uppercase tracking-widest mb-6">STOCK CRÍTICO</h4>
                 <ul className="space-y-4">
                    <li className="flex justify-between items-end border-b border-rose-50 pb-2">
                       <span className="font-black text-slate-900 uppercase italic">Carne de Cerdo</span> 
                       <span className="text-rose-600 font-black text-xl italic">2.5kg</span>
                    </li>
                    <li className="flex justify-between items-end border-b border-rose-50 pb-2">
                       <span className="font-black text-slate-900 uppercase italic">Margarita Mix</span> 
                       <span className="text-rose-600 font-black text-xl italic">2 uds</span>
                    </li>
                 </ul>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, icon, color }: any) {
  return (
    <motion.div whileHover={{ y: -10 }} className="bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl transition-all group-hover:scale-110 ${
        color === 'black' ? 'bg-black text-white' : 'bg-rose-600 text-white shadow-rose-200'
      }`}>
        {React.cloneElement(icon, { size: 32, strokeWidth: 3 })}
      </div>
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{label}</p>
        <p className="text-5xl font-black text-slate-950 tracking-tighter italic">{value}</p>
        <div className="mt-4 flex items-center gap-2 text-[11px] font-black text-emerald-500 uppercase italic">
           <ArrowUpRight className="w-4 h-4" /> {change} CRECIMIENTO
        </div>
      </div>
    </motion.div>
  );
}

function ProgressBar({ label, value, color }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
        <span>{label}</span>
        <span className="text-slate-900">{value}%</span>
      </div>
      <div className="h-6 bg-slate-100 rounded-full overflow-hidden p-1.5 shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full rounded-full ${color} shadow-lg shadow-black/5`} 
        />
      </div>
    </div>
  );
}
