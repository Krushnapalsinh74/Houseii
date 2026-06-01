import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2 } from "lucide-react";

export function SplashScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasShown = sessionStorage.getItem("housiee_splash_shown");
    if (!hasShown) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("housiee_splash_shown", "true");
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] to-[#1E293B]" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Animated House Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-20 h-20 mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#D97706] to-[#FDE68A] shadow-[0_0_40px_rgba(217,119,6,0.3)]"
            >
              <Building2 className="w-10 h-10 text-[#0F172A]" />
              
              {/* Spinning ring around it */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1 rounded-2xl border border-[#F59E0B]/30"
              />
            </motion.div>

            {/* Typography Reveal */}
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                className="font-serif text-5xl md:text-7xl text-white tracking-widest uppercase flex items-baseline"
              >
                HOUSIEE<span className="text-[#F59E0B]">.IN</span>
              </motion.h1>
            </div>
            
            <div className="overflow-hidden mt-3">
              <motion.p
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="text-xs md:text-sm text-slate-400 tracking-[0.3em] font-sans uppercase"
              >
                Premium Real Estate
              </motion.p>
            </div>

            {/* Loading Bar */}
            <div className="mt-10 h-1 w-48 bg-slate-800 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 2.2, delay: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-[#D97706] via-[#FDE68A] to-[#D97706] rounded-full"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
