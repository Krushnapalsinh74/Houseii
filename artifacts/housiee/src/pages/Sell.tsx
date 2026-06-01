import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCreateProperty } from "@workspace/api-client-react";
import { Lock, Upload, CheckCircle2, TrendingUp, Eye, Shield, Loader2 } from "lucide-react";

function LoginGate({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-slate-100">
          <div className="w-20 h-20 bg-gradient-to-br from-[#0F172A] to-[#D97706] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-3">
            Login to Post Your Property
          </h1>
          <p className="text-slate-500 mb-6 text-sm leading-relaxed">
            Create a free account to list your property on Ahmedabad's premium real estate platform and reach thousands of genuine buyers.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: <Eye className="w-4 h-4" />, label: "10K+ Monthly Views" },
              { icon: <TrendingUp className="w-4 h-4" />, label: "Fast Closures" },
              { icon: <Shield className="w-4 h-4" />, label: "Safe & Secure" },
            ].map((item) => (
              <div key={item.label} className="bg-[#F8FAFC] rounded-xl p-3 flex flex-col items-center gap-1.5 text-[#D97706]">
                {item.icon}
                <span className="text-[10px] font-medium text-[#0F172A] text-center leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
          <button
            onClick={onLogin}
            className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-bold py-4 rounded-xl transition-colors text-sm mb-3"
          >
            Sign In / Register Free
          </button>
          <p className="text-xs text-slate-400">Free listing · No brokerage · Maximum exposure</p>
        </div>
      </div>
    </div>
  );
}

const PROPERTY_TYPES = ["Apartment", "Villa", "Plot", "Office", "Shop", "Farmhouse", "Warehouse", "Luxury Home"];
const CATEGORIES = ["apartment", "villa", "plot", "office", "shop", "farmhouse", "warehouse", "luxury"];
const LOCATIONS = ["South Bopal", "Gota", "Chandkheda", "SG Highway", "Shilaj", "Makarba", "Adalaj", "Bopal", "Prahlad Nagar", "Bodakdev", "Thaltej", "Ambli"];

export default function Sell() {
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const { mutate: createProperty, isPending, isSuccess } = useCreateProperty();

  const [form, setForm] = useState({
    title: "", description: "", price: "", priceUnit: "Lac",
    location: "", area: "", areaUnit: "sq.ft",
    bedrooms: "", bathrooms: "", type: "Apartment", category: "apartment",
    builderName: "", possession: "", rera: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProperty({
      data: {
        title: form.title,
        description: form.description || undefined,
        price: parseFloat(form.price),
        priceUnit: form.priceUnit,
        location: form.location,
        area: form.area ? parseFloat(form.area) : undefined,
        areaUnit: form.areaUnit,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : undefined,
        type: form.type.toLowerCase(),
        category: form.category,
        builderName: form.builderName || undefined,
        possession: form.possession || undefined,
        rera: form.rera || undefined,
      },
    });
  };

  if (authLoading) {
    return <div className="pt-24 min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D97706]" /></div>;
  }

  if (!user) return <LoginGate onLogin={() => openAuthModal("login")} />;

  if (isSuccess) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 shadow-xl text-center max-w-md border border-slate-100">
          <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Property Listed!</h2>
          <p className="text-slate-500 text-sm mb-6">Your property has been submitted successfully. Our team will review and publish it within 24 hours.</p>
          <button onClick={() => window.location.reload()} className="bg-[#D97706] text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-[#B45309] transition-colors">
            List Another Property
          </button>
        </div>
      </div>
    );
  }

  const labelClass = "text-sm font-semibold text-[#0F172A] block mb-1.5";
  const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/10 transition-all bg-white placeholder:text-slate-400";
  const selectClass = inputClass + " cursor-pointer";

  return (
    <div className="pt-20 pb-20 min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="bg-[#FFFBEB] border border-[#D97706]/20 rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#D97706] rounded-2xl flex items-center justify-center flex-shrink-0">
              <Upload className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Post Your Property</h1>
              <p className="text-slate-500 text-sm mt-1">Hi {user.name}, reach thousands of genuine buyers on HOUSIEE.IN</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="font-bold text-[#0F172A] text-lg mb-4 pb-3 border-b border-slate-100">Property Information</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Property Title <span className="text-red-500">*</span></label>
                <input required value={form.title} onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Luxurious 3 BHK Apartment in South Bopal" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe your property — location advantages, key features, nearby amenities..."
                  rows={3} className={inputClass + " resize-none"} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Property Type <span className="text-red-500">*</span></label>
                  <select required value={form.type} onChange={(e) => {
                    const idx = PROPERTY_TYPES.indexOf(e.target.value);
                    set("type", e.target.value);
                    set("category", CATEGORIES[idx] ?? "apartment");
                  }} className={selectClass}>
                    {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Location <span className="text-red-500">*</span></label>
                  <input required list="sell-locations" value={form.location} onChange={(e) => set("location", e.target.value)}
                    placeholder="e.g. South Bopal, Ahmedabad" className={inputClass} />
                  <datalist id="sell-locations">{LOCATIONS.map((l) => <option key={l} value={`${l}, Ahmedabad`} />)}</datalist>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h2 className="font-bold text-[#0F172A] text-lg mb-4 pb-3 border-b border-slate-100">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Expected Price <span className="text-red-500">*</span></label>
                <input required type="number" value={form.price} onChange={(e) => set("price", e.target.value)}
                  placeholder="e.g. 85" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Price Unit</label>
                <select value={form.priceUnit} onChange={(e) => set("priceUnit", e.target.value)} className={selectClass}>
                  <option value="Lac">Lac (₹)</option>
                  <option value="Cr">Crore (₹)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <h2 className="font-bold text-[#0F172A] text-lg mb-4 pb-3 border-b border-slate-100">Property Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Area</label>
                <input type="number" value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="e.g. 1450" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Area Unit</label>
                <select value={form.areaUnit} onChange={(e) => set("areaUnit", e.target.value)} className={selectClass}>
                  <option value="sq.ft">sq.ft</option>
                  <option value="sq.m">sq.m</option>
                  <option value="acre">acre</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Bedrooms</label>
                <select value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} className={selectClass}>
                  <option value="">Any</option>
                  {[1,2,3,4,5,6].map((n) => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Bathrooms</label>
                <select value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} className={selectClass}>
                  <option value="">Any</option>
                  {[1,2,3,4,5].map((n) => <option key={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Builder / RERA */}
          <div>
            <h2 className="font-bold text-[#0F172A] text-lg mb-4 pb-3 border-b border-slate-100">Additional Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Builder Name</label>
                <input value={form.builderName} onChange={(e) => set("builderName", e.target.value)} placeholder="e.g. Patel Group" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Possession</label>
                <input value={form.possession} onChange={(e) => set("possession", e.target.value)} placeholder="e.g. Ready to Move" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>RERA No.</label>
                <input value={form.rera} onChange={(e) => set("rera", e.target.value)} placeholder="e.g. GJ/RERA/123" className={inputClass} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#D97706] hover:bg-[#B45309] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? "Submitting..." : "Post Property for Free"}
          </button>
        </form>
      </div>
    </div>
  );
}
