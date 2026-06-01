import { useEffect, useState } from "react";
import { Building2, Search, Star, StarOff, Trash2, Eye, Plus, X } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { Link } from "wouter";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function adminFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, { credentials: "include", headers: { "Content-Type": "application/json" }, ...opts });
  if (!res.ok) throw new Error("Request failed");
  if (res.status === 204) return null;
  return res.json();
}

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  priceUnit: string;
  type: string;
  category: string;
  status: string;
  featured: boolean;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  areaUnit: string;
  images: string[];
  createdAt: string;
  userId: number | null;
  reelUrl?: string;
}

function formatPrice(price: number, unit: string) {
  if (unit === "Cr") return `₹${price} Cr`;
  if (price >= 100) return `₹${(price / 100).toFixed(1)} Cr`;
  return `₹${price} Lac`;
}

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterFeatured, setFilterFeatured] = useState<"all" | "featured" | "normal">("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [updating, setUpdating] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Property Form State
  const [newProp, setNewProp] = useState<Partial<Property> & { imageUrl?: string }>({
    title: "", location: "", price: 0, priceUnit: "Lac", category: "Apartment", type: "buy", status: "available", featured: false, reelUrl: "", imageUrl: ""
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mocked_properties");
      if (stored) {
        setProperties(JSON.parse(stored));
        setLoading(false);
        return;
      }
    } catch {}

    adminFetch("/api/admin/properties")
      .then(setProperties)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleFeatured = async (property: Property) => {
    setUpdating(property.id);
    const updated = { ...property, featured: !property.featured };
    setProperties(prev => {
      const newList = prev.map(p => p.id === updated.id ? updated : p);
      try { localStorage.setItem("mocked_properties", JSON.stringify(newList)); } catch {}
      return newList;
    });
    setUpdating(null);
  };

  const toggleStatus = async (property: Property) => {
    setUpdating(property.id);
    const nextStatus = property.status === "available" ? "sold" : "available";
    const updated = { ...property, status: nextStatus as "available" | "sold" };
    setProperties(prev => {
      const newList = prev.map(p => p.id === updated.id ? updated : p);
      try { localStorage.setItem("mocked_properties", JSON.stringify(newList)); } catch {}
      return newList;
    });
    setUpdating(null);
  };

  const deleteProperty = async (property: Property) => {
    if (!confirm(`Delete "${property.title}"? This cannot be undone.`)) return;
    setProperties(prev => {
      const newList = prev.filter(p => p.id !== property.id);
      try { localStorage.setItem("mocked_properties", JSON.stringify(newList)); } catch {}
      return newList;
    });
  };

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const propertyToSave: Property = {
      ...(newProp as Property),
      id: Math.floor(Math.random() * 10000) + 100,
      createdAt: new Date().toISOString(),
      images: newProp.imageUrl ? [newProp.imageUrl] : ["/project-1.png"],
      bedrooms: 3, bathrooms: 3, area: 1500, areaUnit: "sq.ft"
    };
    
    // Mock saving the property to state since there's no backend
    setProperties(prev => {
      const updated = [propertyToSave, ...prev];
      try {
        localStorage.setItem("mocked_properties", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    
    setShowAddModal(false);
    setNewProp({ title: "", location: "", price: 0, priceUnit: "Lac", category: "Apartment", type: "buy", status: "available", featured: false, reelUrl: "", imageUrl: "" });
  };

  const categories = ["all", ...Array.from(new Set(properties.map(p => p.category)))];

  const filtered = properties.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchFeatured = filterFeatured === "all" || (filterFeatured === "featured" ? p.featured : !p.featured);
    const matchCategory = filterCategory === "all" || p.category === filterCategory;
    return matchSearch && matchFeatured && matchCategory;
  });

  const featuredCount = properties.filter(p => p.featured).length;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-emerald-500" /> Properties
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {properties.length} total · <span className="text-amber-600 font-medium">{featuredCount} featured</span> (shown in homepage slider)
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Property
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-800">
          <strong>Homepage Slider:</strong> Toggle the ⭐ star on any property to add/remove it from the featured slider on the homepage.
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterFeatured}
              onChange={e => setFilterFeatured(e.target.value as "all" | "featured" | "normal")}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm outline-none cursor-pointer"
            >
              <option value="all">All</option>
              <option value="featured">Featured Only</option>
              <option value="normal">Normal Only</option>
            </select>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm outline-none cursor-pointer"
            >
              {categories.map(c => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => <div key={i} className="h-20 bg-white rounded-xl border border-slate-100 animate-pulse" />)}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">No properties found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left px-4 py-3 font-semibold text-slate-600">Property</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-600">Category</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-600">Price</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-600">Featured</th>
                      <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p, i) => (
                      <tr key={p.id} className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${i === filtered.length - 1 ? "border-0" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-4 h-4 text-slate-400" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-slate-800 line-clamp-1">{p.title}</div>
                              <div className="text-xs text-slate-400">{p.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{p.category}</span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-700">{formatPrice(p.price, p.priceUnit)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleStatus(p)}
                            disabled={updating === p.id}
                            className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all cursor-pointer
                              ${p.status === "available" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
                          >
                            {p.status}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleFeatured(p)}
                            disabled={updating === p.id}
                            className={`p-1.5 rounded-lg transition-all ${updating === p.id ? "opacity-50" : ""}`}
                            title={p.featured ? "Remove from homepage slider" : "Add to homepage slider"}
                          >
                            {p.featured ? (
                              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                            ) : (
                              <StarOff className="w-5 h-5 text-slate-300 hover:text-amber-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link 
                              href={`/properties/${p.id}`}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors inline-block"
                              target="_blank"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => deleteProperty(p)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Add Property Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-500" /> Post New Property
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <form id="add-prop-form" onSubmit={handleAddProperty} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Property Title</label>
                    <input required value={newProp.title} onChange={e => setNewProp({...newProp, title: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Luxury Villa in Gota" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
                    <input required value={newProp.location} onChange={e => setNewProp({...newProp, location: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. SG Highway, Ahmedabad" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Price</label>
                      <input required type="number" min="1" value={newProp.price || ""} onChange={e => setNewProp({...newProp, price: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. 75" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Unit</label>
                      <select value={newProp.priceUnit} onChange={e => setNewProp({...newProp, priceUnit: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="Lac">Lacs</option>
                        <option value="Cr">Crores</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                    <select value={newProp.category} onChange={e => setNewProp({...newProp, category: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Bungalow">Bungalow</option>
                      <option value="Office">Office</option>
                      <option value="Plot">Plot</option>
                    </select>
                  </div>
                  
                  {/* IMAGE UPLOAD FIELD */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Upload Cover Image (Optional)</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewProp({...newProp, imageUrl: reader.result as string});
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" 
                    />
                    {newProp.imageUrl && newProp.imageUrl.startsWith("data:image") && (
                      <div className="mt-2">
                        <img src={newProp.imageUrl} alt="Preview" className="h-16 w-24 rounded-lg object-cover border border-slate-200" />
                      </div>
                    )}
                  </div>
                  
                  {/* REEL URL FIELD */}
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <label className="block text-xs font-semibold text-amber-800 mb-1">Property Reel / Video URL (Optional)</label>
                    <p className="text-[10px] text-amber-600 mb-2 leading-tight">Add a link to an Instagram Reel, YouTube Shorts, or any video. This will be embedded on the property detail page.</p>
                    <input 
                      value={newProp.reelUrl || ""} 
                      onChange={e => setNewProp({...newProp, reelUrl: e.target.value})} 
                      className="w-full px-3 py-2 border border-amber-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500 bg-white" 
                      placeholder="https://www.instagram.com/reel/..." 
                    />
                  </div>
                </form>
              </div>
              
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" form="add-prop-form" className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors shadow-sm">
                  Post Property
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
