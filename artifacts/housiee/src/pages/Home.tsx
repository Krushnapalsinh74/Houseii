import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence, useInView, animate } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import {
  Search, MapPin, ChevronLeft, ChevronRight, ArrowRight,
  BedDouble, Bath, Maximize2, Building2, Home as HomeIcon,
  Landmark, TreePine, Store, Warehouse, Star, CheckCircle2,
  TrendingUp, Shield, FileText, CreditCard, Camera, Video, Phone,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { useListProperties, useGetPlatformStats, useListProjects, useListTestimonials, useListServices } from "@workspace/api-client-react";
import type { Property, Project } from "@workspace/api-client-react";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(price: number, unit: string) {
  if (unit === "Cr") return `₹${price} Cr`;
  if (price >= 100) return `₹${(price / 100).toFixed(2)} Cr`;
  return `₹${price} Lac`;
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Animated Counter ──────────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, target, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate(v) {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString("en-IN") + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, target, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

// ─── Property Card ─────────────────────────────────────────────────────────────

function PropertyCard({ property }: { property: Property }) {
  const [, navigate] = useLocation();
  const FALLBACK = `https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80`;
  const img = Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : FALLBACK;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 24px 48px rgba(245,158,11,0.1)" }}
      transition={{ duration: 0.25 }}
      onClick={() => navigate(`/properties/${property.id}`)}
      className="cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#FDE68A] flex-shrink-0 w-60 sm:w-64 select-none shadow-sm"
    >
      <div className="relative overflow-hidden h-36">
        <img
          src={img}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
        />
        {property.featured && (
          <span className="absolute top-3 left-3 bg-[#F59E0B] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
            Featured
          </span>
        )}
        <span className="absolute top-3 right-3 bg-[#0F172A]/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
          {formatPrice(property.price, property.priceUnit ?? "Lac")}
        </span>
      </div>
      <div className="p-3">
        <p className="text-[#D97706] text-[10px] font-semibold uppercase tracking-wider mb-1">{property.category}</p>
        <h3 className="font-semibold text-[#451a03] text-[13px] leading-snug mb-1.5 line-clamp-2">{property.title}</h3>
        <div className="flex items-center gap-1 text-[#78350f] text-xs mb-2.5">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>
        <div className="flex items-center gap-2 text-[#78350f] text-[11px] border-t border-[#FDE68A]/50 pt-2.5">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5" />{property.bedrooms} Bed
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" />{property.bathrooms} Bath
            </span>
          )}
          {property.area != null && (
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5" />{property.area} {property.areaUnit ?? "sq.ft"}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Carousel Section ──────────────────────────────────────────────────────────

function CategorySlider({
  title, icon, properties, viewAllHref,
}: {
  title: string;
  icon: React.ReactNode;
  properties: Property[];
  viewAllHref: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true, containScroll: "trimSnaps", align: "start" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  if (properties.length === 0) return null;

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFFBEB] flex items-center justify-center text-[#D97706]">
              {icon}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#451a03]">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="w-9 h-9 rounded-full border border-[#FDE68A] flex items-center justify-center text-[#78350f] hover:border-[#D97706] hover:text-[#D97706] disabled:opacity-30 transition-all bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              className="w-9 h-9 rounded-full border border-[#FDE68A] flex items-center justify-center text-[#78350f] hover:border-[#D97706] hover:text-[#D97706] disabled:opacity-30 transition-all bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              href={viewAllHref}
              className="hidden sm:flex items-center gap-1 text-[#D97706] text-sm font-semibold hover:gap-2 transition-all ml-2"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>

        <Link
          href={viewAllHref}
          className="sm:hidden mt-4 flex items-center gap-1 text-[#D97706] text-sm font-semibold"
        >
          View all {title} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

// ─── Project Card ──────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  const [, navigate] = useLocation();
  const FALLBACK = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80";
  const img = Array.isArray(project.images) && project.images.length > 0 ? project.images[0] : FALLBACK;

  const statusColor: Record<string, string> = {
    ongoing: "bg-blue-100 text-blue-700",
    ready_to_move: "bg-green-100 text-green-700",
    under_construction: "bg-amber-100 text-amber-700",
    luxury: "bg-purple-100 text-purple-700",
  };
  const statusLabel: Record<string, string> = {
    ongoing: "Ongoing",
    ready_to_move: "Ready to Move",
    under_construction: "Under Construction",
    luxury: "Luxury",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/projects/${project.id}`)}
      className="cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#FDE68A] flex-shrink-0 w-60 sm:w-64 shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="relative h-36 overflow-hidden">
        <img src={img} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }} />
        <span className={cn("absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded", statusColor[project.status] ?? "bg-white/5 text-slate-700")}>
          {statusLabel[project.status] ?? project.status}
        </span>
      </div>
      <div className="p-3">
        <p className="text-[#D97706] text-[10px] font-semibold uppercase tracking-wider mb-1">{project.type}</p>
        <h3 className="font-bold text-[#451a03] text-[13px] leading-snug mb-1">{project.name}</h3>
        <p className="text-[#78350f] text-xs mb-2">{project.builderName}</p>
        <div className="flex items-center gap-1 text-[#78350f] text-xs mb-2.5">
          <MapPin className="w-3 h-3" /><span className="truncate">{project.location}</span>
        </div>
        {project.minPrice && (
          <p className="text-[#451a03] font-bold text-sm">
            {formatPrice(project.minPrice, "Lac")}
            {project.maxPrice && ` – ${formatPrice(project.maxPrice, "Lac")}`}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Hero Search Bar ───────────────────────────────────────────────────────────

const PROPERTY_TYPES = ["All Types", "Apartment", "Villa", "Plot", "Office", "Shop", "Farmhouse", "Warehouse"];
const BUDGETS = ["Any Budget", "Under 30 Lac", "30–50 Lac", "50–80 Lac", "80 Lac–1 Cr", "1–2 Cr", "2 Cr+"];
const LOCATIONS = ["Anywhere in Ahmedabad", "South Bopal", "Gota", "Chandkheda", "SG Highway", "Shilaj", "Makarba", "Adalaj", "Bopal", "Prahlad Nagar"];

function HeroSearch() {
  const [tab, setTab] = useState<"Buy" | "Rent" | "Commercial">("Buy");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [propType, setPropType] = useState("");
  const [, navigate] = useLocation();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (budget) params.set("budget", budget);
    if (propType && propType !== "All Types") params.set("type", propType.toLowerCase());
    if (tab === "Commercial") params.set("type", "commercial");
    navigate(`/properties?${params.toString()}`);
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full max-w-4xl mx-auto lg:mx-0 mt-8 relative z-20"
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-3 justify-center lg:justify-start">
        {(["Buy", "Rent", "Commercial"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-semibold transition-all backdrop-blur-md border",
              tab === t
                ? "bg-[#0B0F19]/20 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                : "bg-black/20 border-white/10 text-white/70 hover:bg-[#0B0F19]/10 hover:text-white"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Search box */}
      <form
        onSubmit={handleSearch}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-xl flex flex-col sm:flex-row gap-2 sm:gap-3"
      >
        {/* Location */}
        <div className="flex-1 flex items-center gap-2 sm:gap-3 bg-black/20 border border-white/10 hover:border-white/30 rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 transition-colors">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 flex-shrink-0" />
          <input
            list="locations-list"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location, Project or Society"
            className="flex-1 text-xs sm:text-sm text-white outline-none placeholder:text-white/60 bg-transparent min-w-0 font-medium"
          />
          <datalist id="locations-list">
            {LOCATIONS.map((l) => <option key={l} value={l} />)}
          </datalist>
        </div>

        {/* Dropdowns side-by-side on mobile */}
        <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
          {/* Budget */}
          <div className="flex items-center gap-2 bg-black/20 border border-white/10 hover:border-white/30 rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 transition-colors sm:min-w-[140px]">
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="flex-1 text-xs sm:text-sm text-white outline-none bg-transparent cursor-pointer font-medium [&>option]:text-slate-900 [&>option]:bg-white"
            >
              <option value="">Budget</option>
              {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Property Type */}
          {tab !== "Commercial" && (
            <div className="flex items-center gap-2 bg-black/20 border border-white/10 hover:border-white/30 rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 transition-colors sm:min-w-[140px]">
              <select
                value={propType}
                onChange={(e) => setPropType(e.target.value)}
                className="flex-1 text-xs sm:text-sm text-white outline-none bg-transparent cursor-pointer font-medium [&>option]:text-slate-900 [&>option]:bg-white"
              >
                <option value="">Property Type</option>
                {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Search CTA */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex-shrink-0 mt-1 sm:mt-0"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Search</span>
        </button>
      </form>
    </motion.div>
  );
}

// ─── Stats ─────────────────────────────────────────────────────────────────────

function Stats() {
  const { data } = useGetPlatformStats();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const items = [
    { label: "Properties Listed", value: data?.totalProperties ?? 1000, suffix: "+" },
    { label: "Happy Clients", value: data?.happyClients ?? 500, suffix: "+" },
    { label: "Projects", value: data?.totalProjects ?? 100, suffix: "+" },
    { label: "Developer Partners", value: data?.developerPartners ?? 50, suffix: "+" },
  ];

  return (
    <section className="bg-[#D97706] py-12 sm:py-16" ref={ref}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {items.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {inView && <AnimatedCounter target={item.value} suffix={item.suffix} />}
              </div>
              <p className="text-white/70 text-sm sm:text-base">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Choose Us ─────────────────────────────────────────────────────────────

const WHY_US = [
  { icon: <CheckCircle2 className="w-5 h-5" />, title: "Verified Properties", desc: "Every listing is physically verified by our expert team" },
  { icon: <Building2 className="w-5 h-5" />, title: "Direct Builder Connect", desc: "No middlemen — connect directly with top builders" },
  { icon: <Shield className="w-5 h-5" />, title: "Legal Assistance", desc: "Expert legal guidance for safe property transactions" },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Best Price Deals", desc: "Negotiated pricing and exclusive deals for our clients" },
  { icon: <CreditCard className="w-5 h-5" />, title: "Loan Assistance", desc: "Get the best home loan from top banks" },
  { icon: <FileText className="w-5 h-5" />, title: "Documentation Support", desc: "Hassle-free paperwork from agreement to registration" },
  { icon: <MapPin className="w-5 h-5" />, title: "Site Visit Assistance", desc: "Coordinated visits with our area experts" },
  { icon: <Phone className="w-5 h-5" />, title: "After Sales Support", desc: "We stay by your side even after the deal is done" },
];

function WhyChooseUs() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-12 sm:py-16 bg-[#FFFBEB]" ref={ref}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <p className="text-[#D97706] text-sm font-semibold uppercase tracking-wider mb-2">Why HOUSIEE.IN</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#451a03]">
            Ahmedabad's Most Trusted Platform
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {WHY_US.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-5 border border-[#FDE68A] hover:border-[#D97706] hover:shadow-lg transition-all group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] flex items-center justify-center text-[#D97706] mb-4 group-hover:bg-[#D97706] group-hover:text-white transition-all">
                {item.icon}
              </div>
              <h3 className="font-semibold text-[#451a03] text-sm mb-1">{item.title}</h3>
              <p className="text-[#78350f] text-xs leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────────────────────────

function Testimonials() {
  const { data } = useListTestimonials();
  const testimonials: any[] = Array.isArray(data) ? data : (data as any)?.testimonials ?? [];
  const [emblaRef] = useEmblaCarousel({ dragFree: true, containScroll: "trimSnaps", align: "start" });

  if (!testimonials.length) return null;

  return (
    <section className="py-12 sm:py-16 bg-[#FAFAF9]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[#D97706] text-sm font-semibold uppercase tracking-wider mb-2">Client Stories</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#451a03]">What Our Clients Say</h2>
        </div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white border border-[#FDE68A] shadow-md rounded-2xl p-6 flex-shrink-0 w-72 sm:w-80">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("w-4 h-4", i < (t.rating ?? 5) ? "fill-[#F59E0B] text-[#F59E0B]" : "text-slate-200")} />
                  ))}
                </div>
                <p className="text-[#78350f] text-sm leading-relaxed mb-5 line-clamp-4">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.clientName?.[0] ?? "C"}
                  </div>
                  <div>
                    <p className="text-[#451a03] font-semibold text-sm">{t.clientName}</p>
                    {t.location && <p className="text-[#78350f] text-xs">{t.location}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Projects Slider ───────────────────────────────────────────────────────────

function ProjectsSlider() {
  const { data } = useListProjects();
  const projects: any[] = Array.isArray(data) ? data : (data as any)?.projects ?? [];
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true, containScroll: "trimSnaps", align: "start" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  if (!projects.length) return null;

  return (
    <section className="py-12 sm:py-16 bg-[#FAFAF9]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[#D97706] text-sm font-semibold uppercase tracking-wider mb-1">New Projects</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#451a03]">Latest Projects</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => emblaApi?.scrollPrev()} disabled={!canScrollPrev}
              className="w-9 h-9 rounded-full border border-[#FDE68A] flex items-center justify-center text-[#78350f] hover:border-[#D97706] hover:text-[#D97706] disabled:opacity-30 transition-all bg-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => emblaApi?.scrollNext()} disabled={!canScrollNext}
              className="w-9 h-9 rounded-full border border-[#FDE68A] flex items-center justify-center text-[#78350f] hover:border-[#D97706] hover:text-[#D97706] disabled:opacity-30 transition-all bg-white">
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link href="/projects" className="hidden sm:flex items-center gap-1 text-[#D97706] text-sm font-semibold hover:gap-2 transition-all ml-2">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ────────────────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#FFFBEB] border-y border-[#FDE68A]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[#D97706] text-sm font-semibold uppercase tracking-wider mb-3">Ready to Begin?</p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#451a03] mb-4">
          Find Your Dream Property Today
        </h2>
        <p className="text-[#78350f] mb-8 max-w-xl mx-auto text-sm sm:text-base">
          Talk to our expert consultants and get personalised property recommendations tailored to your needs and budget.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-sm shadow-md">
            Schedule Free Consultation <ChevronRightIcon className="w-4 h-4" />
          </Link>
          <a href="https://wa.me/919213699873" target="_blank" rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FFFBEB] text-[#451a03] font-bold px-8 py-3.5 rounded-xl transition-colors text-sm border border-[#FDE68A] shadow-sm">
            WhatsApp Us Now
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Category Browse ───────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "Apartments", icon: <Building2 className="w-6 h-6" />, cat: "apartment" },
  { label: "Villas", icon: <HomeIcon className="w-6 h-6" />, cat: "villa" },
  { label: "Plots", icon: <Landmark className="w-6 h-6" />, cat: "plot" },
  { label: "Commercial", icon: <Store className="w-6 h-6" />, cat: "office" },
  { label: "Luxury", icon: <Star className="w-6 h-6" />, cat: "luxury" },
  { label: "Farmhouses", icon: <TreePine className="w-6 h-6" />, cat: "farmhouse" },
  { label: "Warehouses", icon: <Warehouse className="w-6 h-6" />, cat: "warehouse" },
  { label: "Offices", icon: <Building2 className="w-6 h-6" />, cat: "office" },
];

function CategoryBrowse() {
  const [, navigate] = useLocation();
  return (
    <section className="py-8 sm:py-12 bg-[#FFFBEB] border-b border-[#FDE68A]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg sm:text-xl font-bold text-[#451a03] mb-6 text-center">Browse by Category</h2>
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide justify-start sm:justify-center">
          {CATEGORIES.map((c) => (
            <button
              key={c.label + c.cat}
              onClick={() => navigate(`/properties?category=${c.cat}`)}
              className="flex-shrink-0 flex flex-col items-center gap-2 px-5 py-4 bg-white hover:bg-[#FEF3C7] rounded-2xl border border-[#FDE68A] hover:border-[#D97706] transition-all group min-w-[80px] shadow-sm"
            >
              <div className="text-[#D97706] transition-colors">{c.icon}</div>
              <span className="text-[#78350f] text-xs font-medium whitespace-nowrap">{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────────

const HERO_FALLBACKS = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80",
];

function Hero() {
  const { data: listData } = useListProperties({ limit: 12 });
  const properties: any[] = Array.isArray(listData) ? listData : (listData as any)?.properties ?? [];
  const [current, setCurrent] = useState(0);
  const [, navigate] = useLocation();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides = properties.length > 0 ? properties : [];
  const total = slides.length || HERO_FALLBACKS.length;

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % total), 6000);
  }, [total]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  const goTo = useCallback((idx: number) => {
    setCurrent((idx + total) % total);
    startTimer();
  }, [total, startTimer]);

  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  const getImg = (idx: number) => {
    const p = slides[idx];
    if (p && Array.isArray(p.images) && p.images.length > 0) return p.images[0];
    return HERO_FALLBACKS[idx % HERO_FALLBACKS.length];
  };

  const currentSlide = slides[current];

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden pt-24 pb-16">
      {/* ── Background slideshow ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={getImg(current)}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = HERO_FALLBACKS[0]; }}
          />
          <div className="absolute inset-0 bg-[#0A0F1E]/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1E]/60 via-transparent to-[#0A0F1E]/90" />
        </motion.div>
      </AnimatePresence>

      {/* ── Prev / Next arrows ── */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#0B0F19]/10 hover:bg-[#0B0F19]/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg hidden sm:flex"
            aria-label="Previous property"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#0B0F19]/10 hover:bg-[#0B0F19]/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg hidden sm:flex"
            aria-label="Next property"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* ── Overlaid content ── */}
      <div className="relative z-20 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between h-full gap-12 mt-10">
        
        {/* Left Side: Headline and Search */}
        <div className="flex-1 w-full flex flex-col items-center lg:items-start pt-10 lg:pt-0">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left max-w-2xl"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight drop-shadow-xl mb-4 leading-tight">
              Find Your <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Dream Home</span>
            </h1>
            <p className="text-white/80 text-lg sm:text-xl font-medium drop-shadow-md">
              The most exclusive properties in Ahmedabad, curated for you.
            </p>
          </motion.div>

          <HeroSearch />
        </div>

        {/* Right Side: Current property info as a Glass Card */}
        <div className="w-full lg:w-[400px] flex justify-center lg:justify-end min-h-[160px]">
          <AnimatePresence mode="wait">
            {currentSlide && (
              <motion.div
                key={`info-${current}`}
                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-black/40 backdrop-blur-xl border border-white/20 p-5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] max-w-sm w-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                    {currentSlide.category || currentSlide.type}
                  </span>
                  {currentSlide.featured && (
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <h2 className="text-white text-lg font-bold mb-1 leading-tight line-clamp-1">
                  {currentSlide.title}
                </h2>
                <p className="text-white/70 text-xs flex items-center gap-1.5 mb-4 line-clamp-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {currentSlide.location}
                </p>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-white font-bold text-xl">
                    {formatPrice(currentSlide.price, currentSlide.priceUnit ?? "Lac")}
                  </span>
                  <button
                    onClick={() => navigate(`/properties/${currentSlide.id}`)}
                    className="text-xs bg-[#0B0F19] text-slate-900 hover:bg-amber-400 font-bold px-4 py-2 rounded-xl transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Slide checkpoint dots ── */}
        {total > 1 && (
          <div className="flex justify-center items-center gap-3 absolute bottom-8 left-0 right-0">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="group relative flex items-center justify-center p-2"
              >
                <span
                  className={cn(
                    "block rounded-full transition-all duration-500",
                    i === current
                      ? "bg-[#0B0F19] w-10 h-1.5 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      : "bg-[#0B0F19]/30 hover:bg-[#0B0F19]/60 w-3 h-1.5"
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


// ─── Property Sliders by Category ─────────────────────────────────────────────

const SLIDER_CATEGORIES = [
  { label: "Apartments", cat: "apartment", icon: <Building2 className="w-4 h-4" /> },
  { label: "Villas", cat: "villa", icon: <HomeIcon className="w-4 h-4" /> },
  { label: "Luxury Homes", cat: "luxury", icon: <Star className="w-4 h-4" /> },
  { label: "Commercial Spaces", cat: "office", icon: <Store className="w-4 h-4" /> },
  { label: "Farmhouses", cat: "farmhouse", icon: <TreePine className="w-4 h-4" /> },
];

const FALLBACK_PROPERTIES = [
  { id: '1', title: 'Luxury Villa in Bodakdev', type: 'Villa', price: 4.5, priceUnit: 'Cr', location: 'Bodakdev, Ahmedabad', bedrooms: 4, bathrooms: 5, area: 4500, areaUnit: 'sq.ft', featured: true, images: ['/property-1.png'] },
  { id: '2', title: 'Premium Apartment', type: 'Apartment', price: 1.2, priceUnit: 'Cr', location: 'SG Highway', bedrooms: 3, bathrooms: 3, area: 1800, areaUnit: 'sq.ft', featured: true, images: ['/property-2.png'] },
  { id: '3', title: 'Commercial Office Space', type: 'Office', price: 2.8, priceUnit: 'Cr', location: 'Sindhu Bhavan Road', area: 2200, areaUnit: 'sq.ft', featured: true, images: ['/property-3.png'] },
  { id: '4', title: 'Modern Farmhouse', type: 'Farmhouse', price: 3.5, priceUnit: 'Cr', location: 'Sanand', bedrooms: 3, bathrooms: 4, area: 8500, areaUnit: 'sq.ft', featured: true, images: ['/property-4.png'] }
];

function PropertySliders() {
  const { data: listData } = useListProperties({ limit: 100 });
  const fetchedProperties: any[] = Array.isArray(listData) ? listData : (listData as any)?.properties ?? [];
  
  let allProperties = [...fetchedProperties];
  try {
    const stored = localStorage.getItem("mocked_properties");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        allProperties = [...parsed, ...allProperties];
      }
    }
  } catch {}

  const properties = allProperties.length > 0 ? allProperties : FALLBACK_PROPERTIES;

  if (properties.length === 0) return null;

  return (
    <div className="bg-[#FFFBEB]">
      <CategorySlider
        title="Exclusive Properties"
        icon={<Star className="w-4 h-4" />}
        properties={properties}
        viewAllHref="/properties"
      />
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <CategoryBrowse />
      <PropertySliders />
      <Stats />
      <ProjectsSlider />
      <WhyChooseUs />
      <Testimonials />
      <CTABanner />
    </div>
  );
}
