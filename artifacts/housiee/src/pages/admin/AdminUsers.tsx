import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Users, Search, Shield, ShieldOff, Trash2, Eye, ChevronLeft, Building2, Calendar, Phone } from "lucide-react";
import { AdminLayout } from "./AdminLayout";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function adminFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, { credentials: "include", headers: { "Content-Type": "application/json" }, ...opts });
  if (!res.ok) throw new Error("Request failed");
  if (res.status === 204) return null;
  return res.json();
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  priceUnit: string;
  type: string;
  status: string;
  featured: boolean;
  createdAt: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function UserDrawer({ user, onClose, onUpdate, onDelete }: { user: User; onClose: () => void; onUpdate: (u: User) => void; onDelete: (id: number) => void }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch(`/api/admin/users/${user.id}/properties`)
      .then(setProperties)
      .catch(console.error)
      .finally(() => setLoadingProps(false));
  }, [user.id]);

  const toggleRole = async () => {
    setSaving(true);
    try {
      const newRole = user.role === "admin" ? "user" : "admin";
      const updated = await adminFetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });
      onUpdate(updated);
    } finally {
      setSaving(false);
    }
  };

  const toggleVerified = async () => {
    setSaving(true);
    try {
      const updated = await adminFetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isVerified: !user.isVerified }),
      });
      onUpdate(updated);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
    await adminFetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    onDelete(user.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-md bg-white h-full flex flex-col shadow-2xl overflow-y-auto">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <div className="font-semibold text-slate-800">{user.name}</div>
            <div className="text-xs text-slate-400">{user.email}</div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-4 h-4 text-slate-400" />
              {user.phone ?? "—"}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400" />
              Joined {formatDate(user.createdAt)}
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-blue-50 text-blue-600"}`}>
                {user.role}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user.isVerified ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {user.isVerified ? "Verified" : "Unverified"}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleRole}
              disabled={saving}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-sm font-medium transition-all
                ${user.role === "admin" ? "border-slate-200 text-slate-600 hover:bg-slate-50" : "border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100"}`}
            >
              {user.role === "admin" ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
              {user.role === "admin" ? "Remove Admin" : "Make Admin"}
            </button>
            <button
              onClick={toggleVerified}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-sm font-medium transition-all"
            >
              {user.isVerified ? "Unverify" : "Verify User"}
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">Uploaded Properties ({properties.length})</span>
            </div>
            {loadingProps ? (
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-sm text-slate-400 text-center py-6 bg-slate-50 rounded-xl">No properties uploaded yet</div>
            ) : (
              <div className="space-y-2">
                {properties.map((p) => (
                  <Link key={p.id} href={`/properties/${p.id}`}>
                    <a className="block p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-700 truncate">{p.title}</div>
                          <div className="text-xs text-slate-400">{p.location}</div>
                        </div>
                        <div className="text-xs font-semibold text-amber-700 whitespace-nowrap">
                          ₹{p.price} {p.priceUnit}
                        </div>
                      </div>
                      <div className="flex gap-1.5 mt-1.5">
                        <span className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded-full text-slate-500">{p.type}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${p.featured ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-400"}`}>
                          {p.featured ? "Featured" : "Normal"}
                        </span>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-sm font-medium transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<User | null>(null);

  useEffect(() => {
    adminFetch("/api/admin/users")
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdate = (updated: User) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    setSelected(updated);
  };
  const handleDelete = (id: number) => setUsers(prev => prev.filter(u => u.id !== id));

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" /> Users
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">{users.length} registered users</p>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white rounded-xl border border-slate-100 animate-pulse" />)}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">No users found</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">User</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Joined</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Role</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={u.id} className={`border-b border-slate-50 hover:bg-amber-50/30 transition-colors ${i === filtered.length - 1 ? "border-0" : ""}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{u.name}</div>
                            <div className="text-xs text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{formatDate(u.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-blue-50 text-blue-600"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelected(u)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {selected && (
        <UserDrawer
          user={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </AdminLayout>
  );
}
