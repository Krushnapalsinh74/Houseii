import { useEffect, useState } from "react";
import { FolderKanban, Plus, Star, StarOff, Trash2, Edit2, X, Check } from "lucide-react";
import { AdminLayout } from "./AdminLayout";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function adminFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, { credentials: "include", headers: { "Content-Type": "application/json" }, ...opts });
  if (!res.ok) throw new Error("Request failed");
  if (res.status === 204) return null;
  return res.json();
}

interface Project {
  id: number;
  name: string;
  builderName: string;
  location: string;
  status: string;
  type: string;
  minPrice: number | null;
  maxPrice: number | null;
  totalUnits: number | null;
  images: string[];
  rera: string | null;
  possession: string | null;
  featured: boolean;
  createdAt: string;
}

const EMPTY_FORM = {
  name: "", builderName: "", location: "", status: "ongoing", type: "Residential",
  minPrice: "", maxPrice: "", totalUnits: "", rera: "", possession: "", featured: false,
  images: "",
};

function ProjectFormModal({ project, onClose, onSave }: {
  project?: Project;
  onClose: () => void;
  onSave: (p: Project) => void;
}) {
  const [form, setForm] = useState(project ? {
    name: project.name,
    builderName: project.builderName,
    location: project.location,
    status: project.status,
    type: project.type,
    minPrice: project.minPrice?.toString() ?? "",
    maxPrice: project.maxPrice?.toString() ?? "",
    totalUnits: project.totalUnits?.toString() ?? "",
    rera: project.rera ?? "",
    possession: project.possession ?? "",
    featured: project.featured,
    images: project.images.join("\n"),
  } : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        builderName: form.builderName,
        location: form.location,
        status: form.status,
        type: form.type,
        minPrice: form.minPrice ? Number(form.minPrice) : null,
        maxPrice: form.maxPrice ? Number(form.maxPrice) : null,
        totalUnits: form.totalUnits ? Number(form.totalUnits) : null,
        rera: form.rera || null,
        possession: form.possession || null,
        featured: form.featured,
        images: form.images.split("\n").map(s => s.trim()).filter(Boolean),
      };
      const saved = project
        ? await adminFetch(`/api/admin/projects/${project.id}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await adminFetch(`/api/admin/projects`, { method: "POST", body: JSON.stringify(payload) });
      onSave(saved);
      onClose();
    } catch {
      setError("Failed to save project. Please check all required fields.");
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof typeof form, type = "text", placeholder = "") => (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        value={form[key] as string}
        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-200"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">{project ? "Edit Project" : "Add New Project"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          {field("Project Name *", "name", "text", "e.g. Shivalay Heights")}
          {field("Builder Name *", "builderName", "text", "e.g. Shivalay Group")}
          {field("Location *", "location", "text", "e.g. Bopal, Ahmedabad")}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status *</label>
              <select
                value={form.status}
                onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-200"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Type *</label>
              <select
                value={form.type}
                onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-200"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Mixed">Mixed</option>
                <option value="Plotted">Plotted</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {field("Min Price (Lac)", "minPrice", "number", "e.g. 45")}
            {field("Max Price (Lac)", "maxPrice", "number", "e.g. 120")}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {field("Total Units", "totalUnits", "number", "e.g. 200")}
            {field("Possession", "possession", "text", "e.g. Dec 2026")}
          </div>

          {field("RERA Number", "rera", "text", "e.g. PR/GJ/...")}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Image URLs (one per line)</label>
            <textarea
              value={form.images}
              onChange={e => setForm(prev => ({ ...prev, images: e.target.value }))}
              placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-200 resize-none"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-100 hover:bg-amber-50/50 transition-colors">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
            <div>
              <div className="text-sm font-medium text-slate-700">Featured Project</div>
              <div className="text-xs text-slate-400">Show in homepage projects slider</div>
            </div>
            <Star className={`w-4 h-4 ml-auto ${form.featured ? "text-amber-500 fill-amber-500" : "text-slate-300"}`} />
          </label>

          {error && <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : project ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | undefined>(undefined);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    adminFetch("/api/admin/projects")
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleFeatured = async (project: Project) => {
    setUpdating(project.id);
    try {
      const updated = await adminFetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        body: JSON.stringify({ featured: !project.featured }),
      });
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    } finally {
      setUpdating(null);
    }
  };

  const deleteProject = async (project: Project) => {
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    await adminFetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
    setProjects(prev => prev.filter(p => p.id !== project.id));
  };

  const handleSave = (saved: Project) => {
    setProjects(prev => {
      const idx = prev.findIndex(p => p.id === saved.id);
      if (idx >= 0) { const n = [...prev]; n[idx] = saved; return n; }
      return [saved, ...prev];
    });
  };

  const featuredCount = projects.filter(p => p.featured).length;

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FolderKanban className="w-6 h-6 text-purple-500" /> Projects
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {projects.length} total · <span className="text-amber-600 font-medium">{featuredCount} featured</span> in homepage slider
            </p>
          </div>
          <button
            onClick={() => { setEditing(undefined); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-sm text-amber-800">
          <strong>Homepage Projects Slider:</strong> Toggle the ⭐ star to show/hide a project in the featured slider on the homepage.
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-36 bg-white rounded-xl border border-slate-100 animate-pulse" />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FolderKanban className="w-12 h-12 mx-auto mb-3 text-slate-200" />
            <p className="font-medium">No projects yet</p>
            <p className="text-sm">Click "Add Project" to create your first project</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-all">
                <div className="relative h-32 bg-slate-100">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderKanban className="w-10 h-10 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full
                      ${p.status === "ongoing" ? "bg-emerald-500 text-white" : p.status === "upcoming" ? "bg-blue-500 text-white" : "bg-slate-500 text-white"}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 truncate">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.builderName} · {p.location}</div>
                    </div>
                  </div>
                  {(p.minPrice || p.maxPrice) && (
                    <div className="text-xs text-amber-700 font-semibold mt-1">
                      ₹{p.minPrice ?? "—"} {p.maxPrice ? `– ₹${p.maxPrice}` : ""} Lac
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => toggleFeatured(p)}
                      disabled={updating === p.id}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all
                        ${p.featured ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-slate-50 text-slate-500 border border-slate-200 hover:border-amber-200 hover:text-amber-600"}`}
                      title={p.featured ? "Remove from slider" : "Add to slider"}
                    >
                      {p.featured ? <Star className="w-3.5 h-3.5 fill-amber-500" /> : <StarOff className="w-3.5 h-3.5" />}
                      {p.featured ? "Featured" : "Feature"}
                    </button>
                    <button
                      onClick={() => { setEditing(p); setShowForm(true); }}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProject(p)}
                      className="p-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ProjectFormModal
          project={editing}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </AdminLayout>
  );
}
