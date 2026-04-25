import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function InstallPWA() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Detección para iOS (Safari no soporta beforeinstallprompt)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isIOS && !isStandalone) {
      setShowBanner(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // Instrucciones para iOS
      alert('Para instalar: Pulsa el icono "Compartir" en la barra inferior de Safari y elige "Añadir a pantalla de inicio"');
    }
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:right-8 md:bottom-8 md:w-96"
        >
          <div className="bg-indigo-600 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 border border-white/20">
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase text-sm tracking-tight">Acceso Rápido</h4>
                    <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest">Instala Restaurant Pro</p>
                  </div>
               </div>
               <button onClick={() => setShowBanner(false)} className="text-white/60 hover:text-white">
                  <X className="w-5 h-5" />
               </button>
            </div>
            <p className="text-xs text-indigo-50 font-medium leading-relaxed">
              Trabaja más rápido instalando la app en tu pantalla de inicio. Menos consumo de datos y acceso instantáneo.
            </p>
            <button 
              onClick={handleInstall}
              className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Instalar App
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
