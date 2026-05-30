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
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#2563EB]/20 to-[#06B6D4]/10 animate-pulse" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="relative z-10 flex flex-col items-center"
          >
            <h1 className="font-serif text-5xl md:text-7xl text-white tracking-widest uppercase">
              HOUSIEE<span className="text-[#F59E0B]">.IN</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-4 text-sm md:text-base text-white/70 tracking-widest font-sans uppercase"
            >
              Real Estate Sales And Marketing
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
