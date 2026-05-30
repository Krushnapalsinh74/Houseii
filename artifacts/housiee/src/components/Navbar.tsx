import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          ? "bg-[#0F172A]/90 backdrop-blur-lg border-b border-white/10 shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex flex-col">
          <span className="font-serif text-2xl md:text-3xl tracking-widest font-bold text-white leading-none">
            HOUSIEE<span className="text-[#F59E0B]">.IN</span>
          </span>
          <span className="text-[10px] text-white/70 uppercase tracking-wider hidden sm:block mt-1">
            Real Estate Sales And Marketing
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-[#F59E0B] ${
                location === link.href ? "text-[#F59E0B]" : "text-white/90"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href="https://wa.me/919213699873"
            target="_blank"
            rel="noreferrer"
            className="text-white hover:text-[#06B6D4] transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <Link href="/sell">
            <Button className="bg-[#F59E0B] hover:bg-[#d97706] text-[#0F172A] font-bold rounded-sm uppercase tracking-wider text-xs px-6">
              Post Property
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#0F172A] border-t border-white/10 shadow-xl flex flex-col p-4 gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg py-2 border-b border-white/5 ${
                location === link.href ? "text-[#F59E0B]" : "text-white/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/sell" onClick={() => setMobileMenuOpen(false)}>
            <Button className="w-full bg-[#F59E0B] hover:bg-[#d97706] text-[#0F172A] font-bold rounded-sm mt-4">
              Post Property
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
