import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, MessageCircle, User, LogOut, ChevronDown, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout, openAuthModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/properties", label: "Properties" },
    { href: "/projects", label: "Projects" },
    { href: "/buy", label: "Buy" },
    { href: "/sell", label: "Sell" },
    { href: "/commercial", label: "Commercial" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md border-b border-slate-200 py-3"
          : "bg-white/90 backdrop-blur-sm border-b border-slate-100 py-4"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col flex-shrink-0">
          <span className="font-serif text-2xl md:text-3xl tracking-widest font-bold text-[#0F172A] leading-none">
            HOUSIEE<span className="text-[#F59E0B]">.IN</span>
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider hidden sm:block mt-0.5">
            Real Estate Sales And Marketing
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-5 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-[#2563EB] whitespace-nowrap ${
                location === link.href ? "text-[#2563EB] font-semibold" : "text-slate-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <a
            href="https://wa.me/919213699873"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-[#06B6D4] transition-colors"
            title="WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </a>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] px-3 py-2 rounded-xl transition-all text-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user.name[0]?.toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate font-medium">{user.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100 bg-[#F8FAFC]">
                    <p className="font-semibold text-[#0F172A] text-sm truncate">{user.name}</p>
                    <p className="text-slate-400 text-xs truncate">{user.email}</p>
                  </div>
                  <Link href="/sell"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#2563EB]" /> Post Property
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-amber-700 hover:bg-amber-50 transition-colors border-t border-slate-100"
                    >
                      <Shield className="w-4 h-4 text-amber-500" /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-slate-100"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => openAuthModal("login")}
                className="text-slate-600 hover:text-[#2563EB] text-sm font-medium transition-colors px-3 py-2"
              >
                Login
              </button>
              <Link href="/sell">
                <button className="bg-[#F59E0B] hover:bg-[#d97706] text-[#0F172A] font-bold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider transition-colors">
                  Post Property
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-slate-600 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl">
          {/* User section */}
          {user ? (
            <div className="px-4 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm">
                  {user.name[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-[#0F172A] font-semibold text-sm">{user.name}</p>
                  <p className="text-slate-400 text-xs">{user.email}</p>
                </div>
              </div>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="text-red-500 hover:text-red-600 text-xs flex items-center gap-1 transition-colors">
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            </div>
          ) : (
            <div className="px-4 py-4 border-b border-slate-100 flex gap-3">
              <button onClick={() => { openAuthModal("login"); setMobileMenuOpen(false); }}
                className="flex-1 border border-slate-200 text-[#0F172A] font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-50 transition-colors">
                Login
              </button>
              <button onClick={() => { openAuthModal("register"); setMobileMenuOpen(false); }}
                className="flex-1 bg-[#F59E0B] text-[#0F172A] font-bold py-2.5 rounded-xl text-sm hover:bg-[#d97706] transition-colors">
                Register
              </button>
            </div>
          )}

          {/* Nav links */}
          <div className="flex flex-col py-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3.5 text-sm border-b border-slate-50 transition-colors ${
                  location === link.href
                    ? "text-[#2563EB] font-semibold bg-[#EFF6FF]"
                    : "text-slate-600 hover:text-[#2563EB] hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="px-4 py-4">
            <Link href="/sell" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full bg-[#F59E0B] hover:bg-[#d97706] text-[#0F172A] font-bold py-3 rounded-xl text-sm transition-colors">
                Post Property Free
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
