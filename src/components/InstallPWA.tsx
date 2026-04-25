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
          <div className="bg-black rounded-none p-8 shadow-[0_0_50px_rgba(225,29,72,0.3)] flex flex-col gap-6 border-t-8 border-rose-600">
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-rose-600 text-white rounded-none flex items-center justify-center shadow-lg shadow-rose-600/20">
                    <Smartphone className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase text-xl leading-none italic tracking-tighter">REST PRO TERMINAL</h4>
                    <p className="text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">App Lista para Instalar</p>
                  </div>
               </div>
               <button onClick={() => setShowBanner(false)} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
               </button>
            </div>
            <p className="text-xs text-white/60 font-bold uppercase tracking-widest leading-relaxed">
              Optimizado para alto rendimiento. Añade Restaurant Pro a tu pantalla de inicio para acceso inmediato al sistema.
            </p>
            <button 
              onClick={handleInstall}
              className="w-full py-5 bg-rose-600 text-white rounded-none font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-rose-600/30 hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
            >
              <Download className="w-5 h-5" /> DESCARGAR AHORA
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
