import { useEffect, useState } from "react";
import { MessageSquare, Phone, Mail, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import { AdminLayout } from "./AdminLayout";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function adminFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, { credentials: "include", headers: { "Content-Type": "application/json" }, ...opts });
  if (!res.ok) throw new Error("Request failed");
  if (res.status === 204) return null;
  return res.json();
}

interface Inquiry {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  message: string;
  propertyId: number | null;
  inquiryType: string;
  status: string;
  createdAt: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    adminFetch("/api/admin/inquiries")
      .then(setInquiries)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (inquiry: Inquiry, status: string) => {
    setUpdating(inquiry.id);
    try {
      const updated = await adminFetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setInquiries(prev => prev.map(i => i.id === updated.id ? updated : i));
    } finally {
      setUpdating(null);
    }
  };

  const filtered = inquiries.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.phone.includes(search) ||
      (i.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      i.message.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const newCount = inquiries.filter(i => i.status === "new").length;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-orange-500" /> Inquiries
              {newCount > 0 && (
                <span className="text-xs bg-blue-500 text-white font-bold px-2 py-0.5 rounded-full">{newCount} new</span>
              )}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">{inquiries.length} total inquiries</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or message..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-32 bg-white rounded-xl border border-slate-100 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-200" />
            <p className="font-medium">No inquiries found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(inq => (
              <div key={inq.id} className={`bg-white rounded-2xl border p-4 transition-all ${inq.status === "new" ? "border-blue-200 shadow-sm shadow-blue-50" : "border-slate-100"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800">{inq.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${STATUS_COLORS[inq.status] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {inq.status}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        {inq.inquiryType}
                      </span>
                      {inq.propertyId && (
                        <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                          Property #{inq.propertyId}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{inq.phone}</span>
                      {inq.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{inq.email}</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(inq.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">{inq.message}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {["new", "contacted", "resolved", "closed"].map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(inq, s)}
                      disabled={updating === inq.id || inq.status === s}
                      className={`flex-1 py-1.5 text-xs rounded-lg border font-medium transition-all
                        ${inq.status === s
                          ? (STATUS_COLORS[s] ?? "bg-slate-100 text-slate-500 border-slate-200") + " opacity-100"
                          : "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 disabled:opacity-40"
                        }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
