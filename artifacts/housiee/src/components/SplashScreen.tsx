import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasShown = sessionStorage.getItem("housiee_splash_shown");
    if (!hasShown) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("housiee_splash_shown", "true");
      }, 2500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white via-[#EFF6FF] to-[#F0FDFF]" />
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="relative z-10 flex flex-col items-center"
          >
            <h1 className="font-serif text-5xl md:text-7xl text-[#0F172A] tracking-widest uppercase">
              HOUSIEE<span className="text-[#F59E0B]">.IN</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-4 text-sm md:text-base text-slate-400 tracking-widest font-sans uppercase"
            >
              Real Estate Sales And Marketing
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.8, delay: 0.4, ease: "easeInOut" }}
              className="mt-6 h-0.5 w-32 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] rounded-full origin-left"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
