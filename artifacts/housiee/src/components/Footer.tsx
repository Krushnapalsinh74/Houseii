import { Link } from "wouter";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#020617] text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex flex-col mb-6">
              <span className="font-serif text-3xl tracking-widest font-bold text-white leading-none">
                HOUSIEE<span className="text-[#F59E0B]">.IN</span>
              </span>
              <span className="text-xs text-white/60 uppercase tracking-wider mt-2">
                Ahmedabad's Trusted Real Estate Platform
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Your gateway to premium properties, luxury villas, and high-end commercial spaces in Ahmedabad. We bring transparency and trust to real estate.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F59E0B] hover:text-[#0F172A] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F59E0B] hover:text-[#0F172A] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F59E0B] hover:text-[#0F172A] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F59E0B] hover:text-[#0F172A] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 font-serif tracking-wide border-b border-white/10 pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/properties" className="text-white/60 hover:text-[#F59E0B] transition-colors">Featured Properties</Link></li>
              <li><Link href="/projects" className="text-white/60 hover:text-[#F59E0B] transition-colors">New Projects</Link></li>
              <li><Link href="/buy" className="text-white/60 hover:text-[#F59E0B] transition-colors">Buy Property</Link></li>
              <li><Link href="/sell" className="text-white/60 hover:text-[#F59E0B] transition-colors">Sell Property</Link></li>
              <li><Link href="/commercial" className="text-white/60 hover:text-[#F59E0B] transition-colors">Commercial Spaces</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 font-serif tracking-wide border-b border-white/10 pb-2 inline-block">Services</h4>
            <ul className="space-y-3">
              <li><Link href="/services" className="text-white/60 hover:text-[#F59E0B] transition-colors">Property Consulting</Link></li>
              <li><Link href="/services" className="text-white/60 hover:text-[#F59E0B] transition-colors">Sales & Marketing</Link></li>
              <li><Link href="/services" className="text-white/60 hover:text-[#F59E0B] transition-colors">Home Loan Assistance</Link></li>
              <li><Link href="/services" className="text-white/60 hover:text-[#F59E0B] transition-colors">Legal Documentation</Link></li>
              <li><Link href="/services" className="text-white/60 hover:text-[#F59E0B] transition-colors">Property Valuation</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 font-serif tracking-wide border-b border-white/10 pb-2 inline-block">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60">
                <MapPin className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                <span className="text-sm">B-329, Moneyplant Highstreet,<br/>Gota, Ahmedabad</span>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <Phone className="w-5 h-5 text-[#F59E0B] shrink-0" />
                <span className="text-sm">+91 92136 99873</span>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <Mail className="w-5 h-5 text-[#F59E0B] shrink-0" />
                <span className="text-sm">info@housiee.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">© {new Date().getFullYear()} HOUSIEE.IN. All rights reserved.</p>
          <div className="flex gap-4 text-sm">
            <Link href="#" className="text-white/40 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-white/40 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
