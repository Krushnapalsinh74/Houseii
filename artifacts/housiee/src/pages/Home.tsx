import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background font-sans">
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-[#0F172A]/90 border-b border-white/10 text-white">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-widest font-bold">
            HOUSIEE<span className="text-[#F59E0B]">.IN</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-[#F59E0B] transition-colors">Home</Link>
            <Link href="/properties" className="hover:text-[#F59E0B] transition-colors">Properties</Link>
            <Link href="/projects" className="hover:text-[#F59E0B] transition-colors">Projects</Link>
            <Link href="/buy" className="hover:text-[#F59E0B] transition-colors">Buy</Link>
            <Link href="/sell" className="hover:text-[#F59E0B] transition-colors">Sell</Link>
            <Link href="/commercial" className="hover:text-[#F59E0B] transition-colors">Commercial</Link>
            <Link href="/contact" className="hover:text-[#F59E0B] transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sell" className="bg-[#F59E0B] hover:bg-[#d97706] text-[#0F172A] px-5 py-2 rounded font-bold text-sm transition-all hidden sm:block">
              Post Property
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/80 to-transparent z-10" />
          <img src="/hero.png" alt="Luxury Real Estate" className="absolute inset-0 w-full h-full object-cover" />
          <div className="relative z-20 container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
                Find Your <span className="text-[#F59E0B]">Perfect</span> Space in Ahmedabad
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-xl">
                Ahmedabad's most trusted real estate sales & marketing platform. Premium properties curated for discerning buyers.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-[#0F172A] text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center text-sm text-white/60">
          <p>© 2024 HOUSIEE.IN. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}