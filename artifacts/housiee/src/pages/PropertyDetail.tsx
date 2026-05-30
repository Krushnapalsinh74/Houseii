import { useRoute } from "wouter";
import { useGetProperty, getGetPropertyQueryKey } from "@workspace/api-client-react";
import { MapPin, BedDouble, Bath, Maximize2, CheckCircle2, Phone, MessageCircle, Lock, Shield, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";

function formatPrice(price: number, unit: string) {
  if (unit === "Cr") return `₹${price} Cr`;
  if (price >= 100) return `₹${(price / 100).toFixed(2)} Cr`;
  return `₹${price} Lac`;
}

function LoginGate({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-slate-100">
          <div className="w-20 h-20 bg-gradient-to-br from-[#0F172A] to-[#2563EB] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-3">
            Login to View Full Details
          </h1>
          <p className="text-slate-500 mb-6 text-sm leading-relaxed">
            Create a free account or sign in to view complete property details — gallery, amenities, floor plans, contact info, and more.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: <Shield className="w-4 h-4" />, label: "Verified Listings" },
              { icon: <Star className="w-4 h-4" />, label: "Premium Access" },
              { icon: <CheckCircle2 className="w-4 h-4" />, label: "Free Account" },
            ].map((item) => (
              <div key={item.label} className="bg-[#F8FAFC] rounded-xl p-3 flex flex-col items-center gap-1.5 text-[#2563EB]">
                {item.icon}
                <span className="text-[10px] font-medium text-[#0F172A] text-center leading-tight">{item.label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onLogin}
            className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold py-4 rounded-xl transition-colors text-sm mb-3"
          >
            Sign In / Register Free
          </button>
          <p className="text-xs text-slate-400">
            Join 500+ buyers who found their property on HOUSIEE.IN
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PropertyDetail() {
  const [, params] = useRoute("/properties/:id");
  const propertyId = params?.id ? parseInt(params.id, 10) : 0;
  const { user, loading: authLoading, openAuthModal } = useAuth();

  const { data: property, isLoading } = useGetProperty(propertyId, {
    query: {
      enabled: !!propertyId && !!user,
      queryKey: getGetPropertyQueryKey(propertyId),
    },
  });

  if (authLoading) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginGate onLogin={() => openAuthModal("login")} />;
  }

  if (isLoading) {
    return (
      <div className="pt-24 pb-20 container mx-auto px-4 max-w-6xl">
        <Skeleton className="h-[55vh] w-full rounded-2xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Property not found.</p>
      </div>
    );
  }

  const FALLBACK = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80";
  const imgs = Array.isArray(property.images) && property.images.length > 0 ? property.images : [FALLBACK];

  return (
    <div className="pt-20 pb-20 min-h-screen bg-[#F8FAFC]">
      {/* Hero image */}
      <div className="w-full h-[55vh] sm:h-[65vh] relative overflow-hidden bg-slate-200">
        <img src={imgs[0]} alt={property.title} className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="inline-block bg-[#F59E0B] text-[#0F172A] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
            {property.category}
          </span>
          <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug drop-shadow-lg">
            {property.title}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-[#2563EB] text-sm font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5 inline mr-1" />{property.location}
                  </p>
                  <div className="text-3xl font-bold text-[#0F172A]">
                    {formatPrice(property.price, property.priceUnit ?? "Lac")}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${property.status === "available" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                  {property.status === "available" ? "Available" : property.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-slate-100">
                {property.bedrooms != null && (
                  <div className="text-center">
                    <BedDouble className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                    <p className="font-bold text-[#0F172A]">{property.bedrooms}</p>
                    <p className="text-slate-500 text-xs">Bedrooms</p>
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="text-center">
                    <Bath className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                    <p className="font-bold text-[#0F172A]">{property.bathrooms}</p>
                    <p className="text-slate-500 text-xs">Bathrooms</p>
                  </div>
                )}
                {property.area != null && (
                  <div className="text-center">
                    <Maximize2 className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                    <p className="font-bold text-[#0F172A]">{property.area}</p>
                    <p className="text-slate-500 text-xs">{property.areaUnit ?? "sq.ft"}</p>
                  </div>
                )}
                {property.possession && (
                  <div className="text-center">
                    <CheckCircle2 className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                    <p className="font-bold text-[#0F172A] text-xs">{property.possession}</p>
                    <p className="text-slate-500 text-xs">Possession</p>
                  </div>
                )}
              </div>

              {property.description && (
                <div className="mt-5">
                  <h3 className="font-semibold text-[#0F172A] mb-2">About This Property</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{property.description}</p>
                </div>
              )}
            </div>

            {/* Amenities */}
            {Array.isArray(property.amenities) && property.amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-[#0F172A] text-lg mb-4">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RERA / Builder */}
            {(property.rera || property.builderName) && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-[#0F172A] text-lg mb-4">Project Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {property.builderName && (
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Builder</p>
                      <p className="font-semibold text-[#0F172A]">{property.builderName}</p>
                    </div>
                  )}
                  {property.rera && (
                    <div>
                      <p className="text-slate-400 text-xs mb-1">RERA No.</p>
                      <p className="font-semibold text-[#0F172A] font-mono text-xs">{property.rera}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Contact card */}
            <div className="bg-[#0F172A] rounded-2xl p-6 text-white shadow-xl sticky top-24">
              <h3 className="font-bold text-lg mb-1">Interested in this property?</h3>
              <p className="text-white/60 text-sm mb-5">Get in touch with our expert today</p>
              <a
                href="tel:+919213699873"
                className="flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#d97706] text-[#0F172A] font-bold w-full py-3.5 rounded-xl mb-3 transition-colors text-sm"
              >
                <Phone className="w-4 h-4" /> Call Now
              </a>
              <a
                href={`https://wa.me/919213699873?text=Hi, I'm interested in: ${encodeURIComponent(property.title)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold w-full py-3.5 rounded-xl transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Inquiry
              </a>
              <div className="mt-5 pt-5 border-t border-white/10 text-center text-xs text-white/50">
                HOUSIEE.IN · B-329, Moneyplant Highstreet, Gota, Ahmedabad
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
