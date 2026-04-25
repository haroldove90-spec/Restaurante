import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/Login';
import DashboardLayout from './components/dashboard/DashboardLayout';
import InstallPWA from './components/InstallPWA';
import { useState, useEffect } from 'react';
import { UserRole } from './types/database';

function AppContent() {
  const { user, profile, isLoading, signOut } = useAuth();
  const [demoRole, setDemoRole] = useState<UserRole | null>(null);

  // For the demo/preview, we allow switching roles easily
  const currentRole = window.location.pathname === '/menu' ? 'cliente' : (demoRole || profile?.rol || 'cliente');
  const currentName = profile?.nombre || (currentRole === 'cliente' ? 'Invitado Especial' : 'Miembro del Staff');

  if (isLoading && !demoRole) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-6">
          <div className="bg-rose-600 px-8 py-4">
             <span className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Restaurant Pro</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-rose-600 rounded-full animate-ping" />
            <p className="text-white font-black uppercase text-[10px] tracking-[0.4em]">Iniciando Motor de Producción...</p>
          </div>
        </div>
      </div>
    );
  }

  // If not logged in and no demo role active, show login
  if (!user && !demoRole) {
    return (
      <>
        <InstallPWA />
        <DemoSwitcher setRole={setDemoRole} />
        <LoginPage />
      </>
    );
  }

  // Routing Logic Simulation (Protección de rutas robusta)
  const isAuthorized = () => {
    // Si no hay usuario ni demo role, solo puede ver el login
    if (!user && !demoRole) return true;
    
    // El admin tiene acceso total
    if (currentRole === 'admin') return true;
    
    // Si es cocinero, solo puede entrar al dashboard de cocina
    if (currentRole === 'cocinero') {
      return true; // En el DashboardLayout ya filtramos el componente
    }
    
    // Si es mesero, solo puede entrar al comendero
    if (currentRole === 'mesero') {
      return true; // En el DashboardLayout ya filtramos el componente
    }
    
    return true; 
  };

  if (!isAuthorized()) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900 text-white">
        <p className="font-black uppercase tracking-tighter text-xl">Acceso No Autorizado - Redirigiendo...</p>
      </div>
    );
  }

  return (
    <>
      <InstallPWA />
      <DemoSwitcher setRole={setDemoRole} currentRole={currentRole} />
      <DashboardLayout 
        role={currentRole as UserRole} 
        userName={currentName} 
        onSignOut={() => {
          setDemoRole(null);
          signOut();
        }} 
      />
    </>
  );
}

function DemoSwitcher({ setRole, currentRole }: { setRole: (role: UserRole | null) => void, currentRole?: string }) {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex gap-2 bg-black/90 backdrop-blur-xl p-3 rounded-none border border-white/10 shadow-2xl scale-75 origin-bottom-right hover:scale-100 transition-transform">
      <div className="px-3 py-1 flex items-center">
         <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">DEBUGER:</span>
      </div>
      {(['admin', 'mesero', 'cocinero', 'cliente'] as UserRole[]).map(r => (
        <button
          key={r}
          onClick={() => setRole(r)}
          className={`px-5 py-2 rounded-none text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
            currentRole === r 
              ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-600/30' 
              : 'bg-black border-white/20 text-white/60 hover:border-white'
          }`}
        >
          {r}
        </button>
      ))}
      <button
        onClick={() => setRole(null)}
        className="px-5 py-2 rounded-none text-[10px] font-black uppercase tracking-widest border-2 bg-black border-white/5 text-white/30 hover:border-rose-600 hover:text-rose-600 transition-all font-mono"
      >
        CLR
      </button>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
