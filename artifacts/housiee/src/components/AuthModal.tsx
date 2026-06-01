import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Loader2, User, Mail, Phone, Lock, Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function InputField({
  icon, type = "text", placeholder, value, onChange, rightSlot,
}: {
  icon: React.ReactNode;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-[#D97706] focus-within:ring-2 focus-within:ring-[#D97706]/10 transition-all bg-white">
      <span className="text-slate-400 flex-shrink-0">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 text-sm text-[#0F172A] outline-none placeholder:text-slate-400 bg-transparent min-w-0"
        autoComplete={type === "password" ? "current-password" : undefined}
      />
      {rightSlot}
    </div>
  );
}

export function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => { setName(""); setEmail(""); setPhone(""); setPassword(""); setError(""); setShowPassword(false); };

  const switchMode = (mode: "login" | "register") => { reset(); openAuthModal(mode); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (authModalMode === "login") {
        await login(email, password);
      } else {
        if (!name.trim()) { setError("Please enter your name"); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
        await register(name, email, phone, password);
      }
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {authModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden">
              {/* Header */}
              <div className="bg-[#FFFBEB] border-b border-slate-100 px-8 pt-8 pb-6 relative">
                <button onClick={closeAuthModal} className="absolute top-5 right-5 text-slate-400 hover:text-[#0F172A] transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#D97706] rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-[#0F172A] font-bold text-lg tracking-wide">HOUSIEE<span className="text-[#F59E0B]">.IN</span></span>
                    <p className="text-slate-400 text-xs">Real Estate Sales & Marketing</p>
                  </div>
                </div>
                <h2 className="text-[#0F172A] text-2xl font-bold">
                  {authModalMode === "login" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {authModalMode === "login"
                    ? "Sign in to access property details and exclusive listings"
                    : "Join thousands of property buyers and sellers on HOUSIEE.IN"}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
                {authModalMode === "register" && (
                  <InputField
                    icon={<User className="w-4 h-4" />}
                    placeholder="Your full name"
                    value={name}
                    onChange={setName}
                  />
                )}

                <InputField
                  icon={<Mail className="w-4 h-4" />}
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={setEmail}
                />

                {authModalMode === "register" && (
                  <InputField
                    icon={<Phone className="w-4 h-4" />}
                    type="tel"
                    placeholder="Phone number (optional)"
                    value={phone}
                    onChange={setPhone}
                  />
                )}

                <InputField
                  icon={<Lock className="w-4 h-4" />}
                  type={showPassword ? "text" : "password"}
                  placeholder={authModalMode === "login" ? "Password" : "Create password (min 6 chars)"}
                  value={password}
                  onChange={setPassword}
                  rightSlot={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-[#D97706] transition-colors flex-shrink-0">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#D97706] hover:bg-[#B45309] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {authModalMode === "login" ? "Sign In" : "Create Account"}
                </button>

                <p className="text-center text-sm text-slate-500">
                  {authModalMode === "login" ? "Don't have an account?" : "Already have an account?"}
                  {" "}
                  <button
                    type="button"
                    onClick={() => switchMode(authModalMode === "login" ? "register" : "login")}
                    className="text-[#D97706] font-semibold hover:underline"
                  >
                    {authModalMode === "login" ? "Register free" : "Sign in"}
                  </button>
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
