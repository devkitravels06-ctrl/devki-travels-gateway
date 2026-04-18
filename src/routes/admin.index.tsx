import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, MessageSquare, Calendar, FileSignature, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({ bills: 0, queries: 0, unread: 0, bookings: 0, pending: 0 });

  useEffect(() => {
    (async () => {
      const [b, q, qu, bk, bkp] = await Promise.all([
        supabase.from("bills").select("id", { count: "exact", head: true }),
        supabase.from("contact_queries").select("id", { count: "exact", head: true }),
        supabase.from("contact_queries").select("id", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      setStats({ bills: b.count ?? 0, queries: q.count ?? 0, unread: qu.count ?? 0, bookings: bk.count ?? 0, pending: bkp.count ?? 0 });
    })();
  }, []);

  const cards = [
    { label: "Total Bills", value: stats.bills, icon: FileText, color: "from-blue-500 to-blue-700" },
    { label: "Bookings", value: stats.bookings, sub: `${stats.pending} pending`, icon: Calendar, color: "from-cyan-500 to-cyan-700" },
    { label: "Contact Queries", value: stats.queries, sub: `${stats.unread} unread`, icon: MessageSquare, color: "from-indigo-500 to-indigo-700" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back. Here's your business at a glance.</p>
        </div>
        <Link to="/admin/bills/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-hero text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-smooth">
          <FileSignature className="w-4 h-4" />Generate Bill
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {cards.map((c, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 hover-lift">
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white shadow-soft`}>
                <c.icon className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div className="mt-4 text-3xl font-display font-bold">{c.value}</div>
            <div className="text-sm text-muted-foreground">{c.label}</div>
            {c.sub && <div className="text-xs text-primary mt-1">{c.sub}</div>}
          </div>
        ))}
      </div>

      <div className="mt-10 bg-card border border-border rounded-2xl p-6">
        <h2 className="font-display text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/admin/bills/new" className="px-4 py-3 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-smooth text-sm font-medium">+ New Bill</Link>
          <Link to="/admin/queries" className="px-4 py-3 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-smooth text-sm font-medium">View Queries</Link>
          <Link to="/admin/bookings" className="px-4 py-3 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-smooth text-sm font-medium">Manage Bookings</Link>
          <Link to="/admin/content" className="px-4 py-3 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-smooth text-sm font-medium">Edit Site Content</Link>
        </div>
      </div>
    </div>
  );
}
