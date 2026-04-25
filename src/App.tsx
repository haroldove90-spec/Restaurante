import { 
  Users, 
  LayoutDashboard, 
  ChefHat, 
  Utensils, 
  CreditCard, 
  Database, 
  FolderTree, 
  ArrowRight,
  Package,
  Settings,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white font-bold">RP</div>
            <span className="font-semibold text-white tracking-tight">Restaurante Pro</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Arquitectura de Sistema</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#schema" className="flex items-center gap-3 px-3 py-2 bg-slate-800 text-white rounded-md text-sm font-medium transition-colors">
            <Database className="w-4 h-4" />
            1. Esquema DB e Interiores
          </a>
          <a href="#security" className="flex items-center gap-3 px-3 py-2 bg-indigo-900/40 text-indigo-100 rounded-md text-sm font-medium border border-indigo-500/30">
            <Settings className="w-4 h-4" />
            2. Capa de Seguridad (RLS)
          </a>
          <a href="#actions" className="flex items-center gap-3 px-3 py-2 bg-indigo-900/40 text-indigo-100 rounded-md text-sm font-medium border border-indigo-500/30">
            <ArrowRight className="w-4 h-4" />
            3. Server Actions (Lógica)
          </a>
          <a href="#auth" className="flex items-center gap-3 px-3 py-2 bg-emerald-900/40 text-emerald-100 rounded-md text-sm font-medium border border-emerald-500/30">
            <Lock className="w-4 h-4" />
            4. Auth & Middleware
          </a>
        </nav>
        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 italic">
          v1.2.0 - Fase 3: Seguridad y Auth
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <h1 className="text-lg font-semibold text-slate-800">Blueprint: Capa de Datos y Seguridad (Supabase)</h1>
          <div className="flex gap-4">
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase self-center">Fase 2: Implementación</span>
            <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded shadow-sm transition-colors">
              Validar Arquitectura
            </button>
          </div>
        </header>

        {/* Content Grid */}
        <div className="p-6 grid grid-cols-12 gap-6 flex-1 overflow-auto">
          
          {/* RLS View */}
          <section id="security" className="col-span-12 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Configuración de Seguridad (Row Level Security)</span>
              <span className="text-[10px] text-emerald-600 font-mono font-bold">3 Políticas Críticas Definidas</span>
            </div>
            <div className="p-6 grid grid-cols-3 gap-6">
              <SecurityPolicyCard 
                title="Rol: Meseros" 
                rules={[
                  "Ver todas las mesas/productos",
                  "Crear nuevas órdenes",
                  "Prohibido editar precios"
                ]}
                color="indigo"
              />
              <SecurityPolicyCard 
                title="Rol: Cocineros" 
                rules={[
                  "Ver solo órdenes pendientes/preparando",
                  "Solo actualizar campo 'estado'",
                  "Acceso restringido a inventario"
                ]}
                color="amber"
              />
              <SecurityPolicyCard 
                title="Rol: Contables/Admin" 
                rules={[
                  "Acceso total a reportes",
                  "Gestión de costos y precios",
                  "Control total de inventario"
                ]}
                color="slate"
              />
            </div>
          </section>

          {/* Server Action Logic (Bottom Left) */}
          <section id="actions" className="col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Server Action: crearNuevaOrden</span>
            </div>
            <div className="p-6 overflow-auto">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">1</div>
                  <div>
                    <h5 className="text-[12px] font-bold text-slate-800">Cabecera de Orden</h5>
                    <p className="text-[11px] text-slate-500">Crea el registro en la tabla <code>ordenes</code> calculando el total bruto desde el servidor.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">2</div>
                  <div>
                    <h5 className="text-[12px] font-bold text-slate-800">Detalles Masivos</h5>
                    <p className="text-[11px] text-slate-500">Inserta múltiples filas en <code>detalles_orden</code> en una sola transacción.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">3</div>
                  <div>
                    <h5 className="text-[12px] font-bold text-slate-800">Descuento de Stock</h5>
                    <p className="text-[11px] text-slate-500">Resta la cantidad de productos vendidos del <code>inventario</code> para control en tiempo real.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DB Reference (Small) */}
          <section id="schema" className="col-span-5 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="px-4 py-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase">Tipado TypeScript (Interfaces)</span>
            </div>
            <div className="flex-1 p-4 font-mono text-[11px] text-slate-700 overflow-auto">
              <div className="text-indigo-600">interface <span className="text-slate-900">Orden</span> &#123;</div>
              <div className="pl-4">id: <span className="text-emerald-600">string</span>;</div>
              <div className="pl-4">mesa_id: <span className="text-emerald-600">string</span>;</div>
              <div className="pl-4">estado: <span className="text-slate-500">'pendiente' | 'preparando' | ...</span>;</div>
              <div className="pl-4">total: <span className="text-amber-600">number</span>;</div>
              <div>&#125;</div>
              <div className="mt-4 text-indigo-600">interface <span className="text-slate-900">Detalle</span> &#123;</div>
              <div className="pl-4">cantidad: <span className="text-amber-600">number</span>;</div>
              <div className="pl-4">precio_unitario: <span className="text-amber-600">number</span>;</div>
              <div>&#125;</div>
            </div>
          </section>

          {/* Auth & Middleware Presentation */}
          <section id="auth" className="col-span-12 grid grid-cols-2 gap-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <Lock className="w-4 h-4 text-emerald-500" /> Control de Acceso (Middleware)
                </h3>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-[11px] text-indigo-300">
                  <div className="text-slate-500">// middleware.ts</div>
                  <div><span className="text-purple-400">if</span> (!session && pathname.<span className="text-indigo-400">startsWith</span>(<span className="text-emerald-400">'/admin'</span>)) &#123;</div>
                  <div className="pl-4 text-slate-400">return <span className="text-indigo-400">redirect</span>(<span className="text-emerald-400">'/login'</span>);</div>
                  <div>&#125;</div>
                  <div className="mt-2 text-slate-500">// Roles logic</div>
                  <div><span className="text-purple-400">if</span> (role === <span className="text-emerald-400">'cocinero'</span> && path === <span className="text-emerald-400">'/ventas'</span>) &#123;</div>
                  <div className="pl-4 text-slate-400">return <span className="text-indigo-400">unauthorized</span>();</div>
                  <div>&#125;</div>
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  <strong>Estrategia de Perfil:</strong> El perfil se recupera mediante un Hook <code>useAuth</code> que escucha <code>onAuthStateChange</code>. El rol se inyecta desde la tabla <code>usuarios</code> para asegurar integridad.
                </p>
              </div>
            </div>
            
            <div className="border border-slate-200 rounded-xl bg-slate-50/50 p-4 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
              <div className="relative z-10 w-full max-w-xs scale-75 origin-center transition-transform group-hover:scale-[0.8]">
                 <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden pointer-events-none">
                    <div className="bg-indigo-600 h-16 flex items-center justify-center"><Utensils className="text-white w-6 h-6" /></div>
                    <div className="p-6 space-y-3">
                      <div className="h-2 w-12 bg-slate-200 rounded" />
                      <div className="h-8 w-full bg-slate-50 border border-slate-100 rounded" />
                      <div className="h-2 w-12 bg-slate-200 rounded" />
                      <div className="h-8 w-full bg-slate-50 border border-slate-100 rounded" />
                      <div className="h-8 w-full bg-indigo-500 rounded mt-2" />
                    </div>
                 </div>
                 <div className="text-center mt-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vista Previa: Login Mobile-First</span>
                 </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function TableCard({ name, fields, highlight = false, color = 'primary' }: any) {
  const borderColor = highlight ? 'border-indigo-400 shadow-indigo-100' : 'border-slate-200 shadow-sm';
  const headerBg = color === 'primary' ? 'bg-slate-800' : 'bg-slate-700';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-48 border rounded-lg bg-white overflow-hidden shrink-0 ${borderColor}`}
    >
      <div className={`${headerBg} text-white text-[11px] px-3 py-1.5 font-mono flex justify-between items-center`}>
        <span>{name}</span>
        {highlight && <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />}
      </div>
      <div className="p-3 space-y-1.5 text-[10px] font-mono">
        {fields.map((field: any, i: number) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-slate-700">{field.name}</span>
            <div className="flex gap-2">
              <span className="text-slate-400 text-[9px]">{field.type}</span>
              {field.key && (
                <span className={`font-bold ${field.key === 'PK' ? 'text-indigo-500' : 'text-amber-500'}`}>
                  {field.key}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function FlowStep({ number, role, status, color }: any) {
  const colors: any = {
    indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
    amber: 'bg-amber-100 text-amber-600 border-amber-200',
    emerald: 'bg-emerald-100 text-emerald-600 border-emerald-200',
    blue: 'bg-blue-100 text-blue-600 border-blue-200',
  };
  
  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className={`w-12 h-12 rounded-full ${colors[color]} flex items-center justify-center font-bold border-2 transition-transform group-hover:scale-110`}>
        {number}
      </div>
      <div className="text-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none mb-1">{role}</span>
        <span className="text-[11px] font-semibold text-slate-800">{status}</span>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="h-px flex-1 bg-slate-200 mx-2 relative min-w-[30px]">
      <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-slate-200 rotate-45"></div>
    </div>
  );
}

function FolderItem({ label, indent = 0, secondary }: any) {
  return (
    <div className="flex items-center gap-2" style={{ paddingLeft: `${indent * 1.25}rem` }}>
      <span className="text-slate-600">📂</span>
      <span>{label}</span>
      {secondary && <span className="text-slate-600 text-[10px] ml-2">{secondary}</span>}
    </div>
  );
}

function FileItem({ label, indent = 0, secondary }: any) {
  return (
    <div className="flex items-center gap-2" style={{ paddingLeft: `${indent * 1.25}rem` }}>
      <span className="text-slate-600">📄</span>
      <span className="text-indigo-200">{label}</span>
      {secondary && <span className="text-slate-600 text-[10px] ml-2">{secondary}</span>}
    </div>
  );
}

function SecurityPolicyCard({ title, rules, color }: any) {
  const colors: any = {
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    slate: 'bg-slate-50 border-slate-200 text-slate-800',
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[color]} space-y-3`}>
      <h4 className="text-[12px] font-bold uppercase tracking-tight">{title}</h4>
      <ul className="space-y-2">
        {rules.map((rule: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-[11px]">
            <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${color === 'amber' ? 'bg-amber-400' : color === 'indigo' ? 'bg-indigo-400' : 'bg-slate-400'}`} />
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
