import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion, useInView, animate } from "framer-motion";
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
      whileHover={{ y: -4, boxShadow: "0 24px 48px rgba(15,23,42,0.14)" }}
      transition={{ duration: 0.25 }}
      onClick={() => navigate(`/properties/${property.id}`)}
      className="cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0 w-72 sm:w-80 select-none"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={img}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
        />
        {property.featured && (
          <span className="absolute top-3 left-3 bg-[#F59E0B] text-[#0F172A] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
            Featured
          </span>
        )}
        <span className="absolute top-3 right-3 bg-[#0F172A]/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
          {formatPrice(property.price, property.priceUnit ?? "Lac")}
        </span>
      </div>
      <div className="p-4">
        <p className="text-[#2563EB] text-xs font-semibold uppercase tracking-wider mb-1">{property.category}</p>
        <h3 className="font-semibold text-[#0F172A] text-sm leading-snug mb-2 line-clamp-2">{property.title}</h3>
        <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-500 text-xs border-t border-slate-100 pt-3">
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
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
              {icon}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#2563EB] hover:text-[#2563EB] disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#2563EB] hover:text-[#2563EB] disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              href={viewAllHref}
              className="hidden sm:flex items-center gap-1 text-[#2563EB] text-sm font-semibold hover:gap-2 transition-all ml-2"
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
          className="sm:hidden mt-4 flex items-center gap-1 text-[#2563EB] text-sm font-semibold"
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
      className="cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0 w-72 sm:w-80 shadow-sm hover:shadow-xl transition-shadow"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={img} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }} />
        <span className={cn("absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded", statusColor[project.status] ?? "bg-slate-100 text-slate-700")}>
          {statusLabel[project.status] ?? project.status}
        </span>
      </div>
      <div className="p-4">
        <p className="text-[#2563EB] text-xs font-semibold uppercase tracking-wider mb-1">{project.type}</p>
        <h3 className="font-bold text-[#0F172A] text-sm leading-snug mb-1">{project.name}</h3>
        <p className="text-slate-500 text-xs mb-2">{project.builderName}</p>
        <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
          <MapPin className="w-3 h-3" /><span className="truncate">{project.location}</span>
        </div>
        {project.minPrice && (
          <p className="text-[#0F172A] font-bold text-sm">
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
    <div className="w-full max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {(["Buy", "Rent", "Commercial"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-5 py-2 rounded-t-xl text-sm font-semibold transition-all",
              tab === t
                ? "bg-white text-[#0F172A] shadow-sm"
                : "bg-white/20 text-white/80 hover:bg-white/30"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Search box */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl rounded-tl-none p-3 sm:p-4 shadow-2xl flex flex-col sm:flex-row gap-3"
      >
        {/* Location */}
        <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-[#2563EB] transition-colors">
          <MapPin className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
          <input
            list="locations-list"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location, Project or Society"
            className="flex-1 text-sm text-[#0F172A] outline-none placeholder:text-slate-400 bg-transparent min-w-0"
          />
          <datalist id="locations-list">
            {LOCATIONS.map((l) => <option key={l} value={l} />)}
          </datalist>
        </div>

        {/* Budget */}
        <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-[#2563EB] transition-colors min-w-[140px]">
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="flex-1 text-sm text-[#0F172A] outline-none bg-transparent cursor-pointer"
          >
            <option value="">Budget</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Property Type */}
        {tab !== "Commercial" && (
          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-[#2563EB] transition-colors min-w-[140px]">
            <select
              value={propType}
              onChange={(e) => setPropType(e.target.value)}
              className="flex-1 text-sm text-[#0F172A] outline-none bg-transparent cursor-pointer"
            >
              <option value="">Property Type</option>
              {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}

        {/* Search CTA */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors flex-shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </form>
    </div>
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
    <section className="bg-[#0F172A] py-12 sm:py-16" ref={ref}>
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
              <p className="text-white/60 text-sm sm:text-base">{item.label}</p>
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
    <section className="py-12 sm:py-16 bg-[#F8FAFC]" ref={ref}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <p className="text-[#2563EB] text-sm font-semibold uppercase tracking-wider mb-2">Why HOUSIEE.IN</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A]">
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
              className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-[#2563EB]/30 hover:shadow-lg transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] mb-4 group-hover:bg-[#2563EB] group-hover:text-white transition-all">
                {item.icon}
              </div>
              <h3 className="font-semibold text-[#0F172A] text-sm mb-1">{item.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────────────────────────

function Testimonials() {
  const { data: testimonials = [] } = useListTestimonials();
  const [emblaRef] = useEmblaCarousel({ dragFree: true, containScroll: "trimSnaps", align: "start" });

  if (!testimonials.length) return null;

  return (
    <section className="py-12 sm:py-16 bg-[#0F172A]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider mb-2">Client Stories</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">What Our Clients Say</h2>
        </div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex-shrink-0 w-72 sm:w-80">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("w-4 h-4", i < (t.rating ?? 5) ? "fill-[#F59E0B] text-[#F59E0B]" : "text-white/20")} />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-5 line-clamp-4">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.clientName?.[0] ?? "C"}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.clientName}</p>
                    {t.location && <p className="text-white/50 text-xs">{t.location}</p>}
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
  const { data: projects = [] } = useListProjects();
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
    <section className="py-12 sm:py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[#2563EB] text-sm font-semibold uppercase tracking-wider mb-1">New Projects</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Latest Projects</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => emblaApi?.scrollPrev()} disabled={!canScrollPrev}
              className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#2563EB] hover:text-[#2563EB] disabled:opacity-30 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => emblaApi?.scrollNext()} disabled={!canScrollNext}
              className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#2563EB] hover:text-[#2563EB] disabled:opacity-30 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link href="/projects" className="hidden sm:flex items-center gap-1 text-[#2563EB] text-sm font-semibold hover:gap-2 transition-all ml-2">
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
    <section className="py-12 sm:py-16 bg-gradient-to-r from-[#0F172A] via-[#1e3a8a] to-[#0F172A]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[#06B6D4] text-sm font-semibold uppercase tracking-wider mb-3">Ready to Begin?</p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
          Find Your Dream Property Today
        </h2>
        <p className="text-white/70 mb-8 max-w-xl mx-auto text-sm sm:text-base">
          Talk to our expert consultants and get personalised property recommendations tailored to your needs and budget.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#d97706] text-[#0F172A] font-bold px-8 py-3.5 rounded-xl transition-colors text-sm">
            Schedule Free Consultation <ChevronRightIcon className="w-4 h-4" />
          </Link>
          <a href="https://wa.me/919213699873" target="_blank" rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-sm border border-white/20">
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
    <section className="py-8 sm:py-12 bg-white border-b border-slate-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-6 text-center">Browse by Category</h2>
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide justify-start sm:justify-center">
          {CATEGORIES.map((c) => (
            <button
              key={c.label + c.cat}
              onClick={() => navigate(`/properties?category=${c.cat}`)}
              className="flex-shrink-0 flex flex-col items-center gap-2 px-5 py-4 bg-[#F8FAFC] hover:bg-[#EFF6FF] rounded-2xl border border-slate-100 hover:border-[#2563EB]/30 transition-all group min-w-[80px]"
            >
              <div className="text-slate-500 group-hover:text-[#2563EB] transition-colors">{c.icon}</div>
              <span className="text-[#0F172A] text-xs font-medium whitespace-nowrap">{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[#0F172A]">
        <div className="absolute inset-0 opacity-40"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 40%, #1e3a8a 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 80%, #0e7490 0%, transparent 60%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#2563EB]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-[#06B6D4]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pt-24 pb-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-white/80 text-xs font-medium mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse" />
          Ahmedabad's Trusted Real Estate Platform
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl mb-4"
        >
          Find Your Dream Property
          <span className="block text-[#F59E0B]">With HOUSIEE.IN</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white/70 text-sm sm:text-lg max-w-xl mb-10"
        >
          1000+ verified properties across Ahmedabad. Apartments, Villas, Plots, Commercial — all in one place.
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full"
        >
          <HeroSearch />
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-6 sm:gap-10 mt-10 flex-wrap justify-center"
        >
          {[["1000+", "Properties"], ["500+", "Happy Clients"], ["50+", "Builders"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <p className="text-white font-bold text-xl sm:text-2xl">{num}</p>
              <p className="text-white/50 text-xs">{label}</p>
            </div>
          ))}
        </motion.div>
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

function PropertySliders() {
  const { data: listData } = useListProperties({ limit: 100 });
  const properties = listData?.properties ?? [];

  return (
    <div className="bg-white">
      {SLIDER_CATEGORIES.map((sc) => {
        const filtered = properties.filter(
          (p) => p.category?.toLowerCase() === sc.cat.toLowerCase()
        );
        if (filtered.length === 0) return null;
        return (
          <CategorySlider
            key={sc.cat}
            title={sc.label}
            icon={sc.icon}
            properties={filtered}
            viewAllHref={`/properties?category=${sc.cat}`}
          />
        );
      })}

      {/* Featured section as fallback if no categories matched */}
      {properties.length > 0 && !SLIDER_CATEGORIES.some((sc) => properties.some((p) => p.category?.toLowerCase() === sc.cat)) && (
        <CategorySlider
          title="Featured Properties"
          icon={<Star className="w-4 h-4" />}
          properties={properties.filter((p) => p.featured)}
          viewAllHref="/properties"
        />
      )}
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
