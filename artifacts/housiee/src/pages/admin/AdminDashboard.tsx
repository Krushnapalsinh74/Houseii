import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Users, Building2, FolderKanban, MessageSquare, Star, TrendingUp, ArrowRight } from "lucide-react";
import { AdminLayout } from "./AdminLayout";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function adminFetch(path: string) {
  const res = await fetch(`${BASE}${path}`, { credentials: "include" });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

interface Stats {
  totalUsers: number;
  totalProperties: number;
  totalProjects: number;
  totalInquiries: number;
  featuredProperties: number;
}

function StatCard({ icon: Icon, label, value, color, href }: { icon: React.ElementType; label: string; value: number | string; color: string; href: string }) {
  return (
    <Link href={href}>
      <a className="block bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="flex items-start justify-between">
          <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300" />
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-slate-800">{value}</div>
          <div className="text-sm text-slate-500 mt-0.5">{label}</div>
        </div>
      </a>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/admin/stats")
      .then((data) => {
        if (!data || Object.keys(data).length === 0) throw new Error("Empty mock data");
        setStats(data);
      })
      .catch(() => {
        setStats({
          totalUsers: 0,
          totalProperties: 0,
          totalProjects: 0,
          totalInquiries: 0,
          featuredProperties: 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Overview of your platform data</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard icon={Users} label="Total Users" value={stats?.totalUsers ?? 0} color="bg-blue-500" href="/admin/users" />
            <StatCard icon={Building2} label="Total Properties" value={stats?.totalProperties ?? 0} color="bg-emerald-500" href="/admin/properties" />
            <StatCard icon={FolderKanban} label="Total Projects" value={stats?.totalProjects ?? 0} color="bg-purple-500" href="/admin/projects" />
            <StatCard icon={MessageSquare} label="Inquiries" value={stats?.totalInquiries ?? 0} color="bg-orange-500" href="/admin/inquiries" />
            <StatCard icon={Star} label="Featured Properties" value={stats?.featuredProperties ?? 0} color="bg-amber-500" href="/admin/properties" />
            <StatCard icon={TrendingUp} label="Platform Active" value="Live" color="bg-slate-700" href="/admin" />
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">Quick Actions</h2>
            </div>
            <div className="space-y-2">
              {[
                { label: "Manage Featured Properties (Slider)", href: "/admin/properties", desc: "Toggle which properties appear on homepage" },
                { label: "Add / Edit Projects", href: "/admin/projects", desc: "Manage real estate projects" },
                { label: "View All Users", href: "/admin/users", desc: "See user accounts and their listings" },
                { label: "Review Inquiries", href: "/admin/inquiries", desc: "Check and respond to customer inquiries" },
              ].map(({ label, href, desc }) => (
                <Link key={href} href={href}>
                  <a className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-all group">
                    <div>
                      <div className="text-sm font-medium text-slate-700">{label}</div>
                      <div className="text-xs text-slate-400">{desc}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
                  </a>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Homepage Slider Control</h2>
            <p className="text-sm text-slate-500 mb-3">
              The main property slider on the homepage shows all properties marked as <strong>Featured</strong>. 
              Go to <strong>Properties</strong> to toggle featured status on any property.
            </p>
            <p className="text-sm text-slate-500 mb-4">
              The projects slider shows all projects marked as <strong>Featured</strong>. 
              Go to <strong>Projects</strong> to manage featured projects.
            </p>
            <div className="flex gap-2">
              <Link href="/admin/properties">
                <a className="flex-1 text-center bg-amber-50 text-amber-700 border border-amber-200 text-sm font-medium py-2 px-3 rounded-lg hover:bg-amber-100 transition-colors">
                  Properties Slider
                </a>
              </Link>
              <Link href="/admin/projects">
                <a className="flex-1 text-center bg-purple-50 text-purple-700 border border-purple-200 text-sm font-medium py-2 px-3 rounded-lg hover:bg-purple-100 transition-colors">
                  Projects Slider
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
