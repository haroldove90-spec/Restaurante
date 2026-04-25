import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/Login';
import DashboardLayout from './components/dashboard/DashboardLayout';
import { useState, useEffect } from 'react';
import { UserRole } from './types/database';

function AppContent() {
  const { user, profile, isLoading, signOut } = useAuth();
  const [demoRole, setDemoRole] = useState<UserRole | null>(null);

  // For the demo/preview, we allow switching roles easily
  const currentRole = demoRole || profile?.rol || 'mesero';
  const currentName = profile?.nombre || 'Miembro del Staff';

  if (isLoading && !demoRole) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-indigo-400 font-black uppercase text-xs tracking-widest">Iniciando Sistema Pro...</p>
        </div>
      </div>
    );
  }

  // If not logged in and no demo role active, show login
  if (!user && !demoRole) {
    return (
      <>
        <DemoSwitcher setRole={setDemoRole} />
        <LoginPage />
      </>
    );
  }

  return (
    <>
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
    <div className="fixed bottom-4 right-4 z-[9999] flex gap-2 bg-slate-900/90 backdrop-blur-xl p-2 rounded-2xl border border-slate-700 shadow-2xl scale-75 origin-bottom-right hover:scale-100 transition-transform">
      <div className="px-3 py-1 flex items-center">
         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Demo Roles:</span>
      </div>
      {(['admin', 'mesero', 'cocinero'] as UserRole[]).map(r => (
        <button
          key={r}
          onClick={() => setRole(r)}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
            currentRole === r 
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' 
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
          }`}
        >
          {r}
        </button>
      ))}
      <button
        onClick={() => setRole(null)}
        className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-slate-800 border-slate-700 text-rose-400 hover:bg-rose-950 transition-all"
      >
        Reset
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
