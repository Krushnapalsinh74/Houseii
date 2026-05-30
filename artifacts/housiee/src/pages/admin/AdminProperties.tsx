import { useEffect, useState } from "react";
import { Building2, Search, Star, StarOff, Trash2, Eye, Filter } from "lucide-react";
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

  useEffect(() => {
    adminFetch("/api/admin/properties")
      .then(setProperties)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleFeatured = async (property: Property) => {
    setUpdating(property.id);
    try {
      const updated = await adminFetch(`/api/admin/properties/${property.id}`, {
        method: "PATCH",
        body: JSON.stringify({ featured: !property.featured }),
      });
      setProperties(prev => prev.map(p => p.id === updated.id ? updated : p));
    } catch {
      alert("Failed to update property");
    } finally {
      setUpdating(null);
    }
  };

  const toggleStatus = async (property: Property) => {
    const nextStatus = property.status === "available" ? "sold" : "available";
    setUpdating(property.id);
    try {
      const updated = await adminFetch(`/api/admin/properties/${property.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      setProperties(prev => prev.map(p => p.id === updated.id ? updated : p));
    } finally {
      setUpdating(null);
    }
  };

  const deleteProperty = async (property: Property) => {
    if (!confirm(`Delete "${property.title}"? This cannot be undone.`)) return;
    await adminFetch(`/api/admin/properties/${property.id}`, { method: "DELETE" });
    setProperties(prev => prev.filter(p => p.id !== property.id));
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
                            <Link href={`/properties/${p.id}`}>
                              <a className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors" target="_blank">
                                <Eye className="w-4 h-4" />
                              </a>
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
      </div>
    </AdminLayout>
  );
}
