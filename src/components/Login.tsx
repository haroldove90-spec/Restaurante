import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Utensils, Lock, Mail, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Credenciales incorrectas o error de conexión.');
      setLoading(false);
      return;
    }

    // Redirección basada en rol (Simulada para el demo activo en App.tsx)
    // En una app real de Next.js se usaría useRouter()
    console.log('Login exitoso, redirigiendo según rol...');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-none shadow-[0_0_100px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden"
      >
        <div className="bg-rose-600 p-12 text-center text-white relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-3xl transform translate-x-12 -translate-y-12" />
          <div className="w-20 h-20 bg-white text-rose-600 rounded-none flex items-center justify-center mx-auto mb-6 shadow-2xl relative z-10">
            <Utensils className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none relative z-10">JUSHI</h1>
          <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.4em] mt-3 relative z-10">Sistema de Gestión Pro</p>
        </div>
        
        <div className="p-10">
          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <div className="bg-black text-rose-600 text-[10px] font-black uppercase tracking-widest p-4 rounded-none border-l-4 border-rose-600 flex items-center gap-3">
                <span className="w-2 h-2 bg-rose-600 rounded-full animate-pulse" />
                {error}
              </div>
            )}
            
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Email del Personal</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-5 bg-slate-50 border-2 border-slate-100 rounded-none text-base font-bold focus:border-rose-600 transition-all outline-none"
                  placeholder="ejemplo@jushi.com.mx"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Pin de Seguridad</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-5 bg-slate-50 border-2 border-slate-100 rounded-none text-base font-bold focus:border-rose-600 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-rose-600 hover:bg-black text-white rounded-none font-black uppercase text-base tracking-[0.2em] shadow-xl shadow-rose-600/20 transition-all flex items-center justify-center gap-3 group"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <span>ACCEDER AL SISTEMA</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors">Solicitar Acceso a IT</a>
            </div>
          </form>
        </div>

        <div className="px-10 py-6 bg-black text-white flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
          <span className="opacity-40">Terminal v2.0 - AES256</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse" /> SYSTEM READY
          </span>
        </div>
      </motion.div>
    </div>
  );
}
