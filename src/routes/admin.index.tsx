import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, MessageSquare, Calendar, FileSignature, TrendingUp, IdCard, ArrowUpRight, Sparkles, Activity, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({ bills: 0, queries: 0, unread: 0, bookings: 0, pending: 0, drivers: 0, driversPending: 0 });
  const [recentBills, setRecentBills] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [b, q, qu, bk, bkp, dr, drp, rb, rbk] = await Promise.all([
        supabase.from("bills").select("id", { count: "exact", head: true }),
        supabase.from("contact_queries").select("id", { count: "exact", head: true }),
        supabase.from("contact_queries").select("id", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("drivers").select("id", { count: "exact", head: true }),
        supabase.from("drivers").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("bills").select("id,bill_number,customer_name,grand_total,bill_date").order("created_at", { ascending: false }).limit(5),
        supabase.from("bookings").select("id,name,vehicle,pickup_date,status").order("created_at", { ascending: false }).limit(5),
      ]);
      setStats({
        bills: b.count ?? 0,
        queries: q.count ?? 0,
        unread: qu.count ?? 0,
        bookings: bk.count ?? 0,
        pending: bkp.count ?? 0,
        drivers: dr.count ?? 0,
        driversPending: drp.count ?? 0,
      });
      setRecentBills(rb.data ?? []);
      setRecentBookings(rbk.data ?? []);
    })();
  }, []);

  const cards = [
    { label: "Total Bills", value: stats.bills, sub: "All-time invoices", icon: FileText, gradient: "from-blue-500 via-blue-600 to-indigo-700", glow: "shadow-[0_10px_40px_-10px_rgba(59,130,246,0.6)]" },
    { label: "Bookings", value: stats.bookings, sub: `${stats.pending} pending review`, icon: Calendar, gradient: "from-cyan-500 via-teal-500 to-emerald-600", glow: "shadow-[0_10px_40px_-10px_rgba(20,184,166,0.6)]" },
    { label: "Contact Queries", value: stats.queries, sub: `${stats.unread} unread`, icon: MessageSquare, gradient: "from-violet-500 via-purple-600 to-fuchsia-600", glow: "shadow-[0_10px_40px_-10px_rgba(139,92,246,0.6)]" },
    { label: "Driver Applications", value: stats.drivers, sub: `${stats.driversPending} awaiting`, icon: IdCard, gradient: "from-amber-500 via-orange-500 to-rose-600", glow: "shadow-[0_10px_40px_-10px_rgba(249,115,22,0.6)]" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.22_0.08_250)] via-primary to-[oklch(0.72_0.16_235)] p-8 lg:p-10 text-white shadow-elegant">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-[oklch(0.78_0.15_80)]/20 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Welcome Back
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">Good to see you again 👋</h1>
            <p className="text-white/80 max-w-xl">Here's a snapshot of your business today. Manage bills, bookings, drivers and customer queries — all from one place.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/bills/new" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary font-semibold shadow-soft hover:scale-105 transition-smooth">
              <FileSignature className="w-4 h-4" />Generate Bill
            </Link>
            <Link to="/admin/bookings" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/15 backdrop-blur border border-white/30 hover:bg-white/25 transition font-medium">
              <Calendar className="w-4 h-4" />View Bookings
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((c, i) => (
          <div key={i} className={`group relative overflow-hidden bg-card border border-border rounded-2xl p-6 hover-lift ${c.glow}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />
            <div className="relative">
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white shadow-soft group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <c.icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-semibold">
                  <TrendingUp className="w-3 h-3" /> Live
                </div>
              </div>
              <div className="text-4xl font-display font-bold tracking-tight">{c.value}</div>
              <div className="text-sm font-semibold mt-1">{c.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{c.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-2xl p-6 lg:p-7">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-xl font-bold">Quick Actions</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Frequently used shortcuts</p>
          </div>
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { to: "/admin/bills/new", label: "New Bill", icon: FileSignature, color: "from-blue-500 to-indigo-600" },
            { to: "/admin/content", label: "Edit About / Mission / Founders", icon: Users, color: "from-pink-500 to-rose-600" },
            { to: "/admin/queries", label: "View Queries", icon: MessageSquare, color: "from-purple-500 to-fuchsia-600" },
            { to: "/admin/bookings", label: "Manage Bookings", icon: Calendar, color: "from-teal-500 to-emerald-600" },
            { to: "/admin/drivers", label: "Driver Apps", icon: IdCard, color: "from-amber-500 to-rose-600" },
          ].map((a) => (
            <Link key={a.to} to={a.to} className="group relative overflow-hidden p-4 rounded-xl bg-secondary hover:bg-foreground hover:text-background transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center text-white shadow-soft`}>
                  <a.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{a.label}</span>
                <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div>
              <h3 className="font-display font-bold">Recent Bills</h3>
              <p className="text-xs text-muted-foreground">Latest 5 invoices</p>
            </div>
            <Link to="/admin/bills" className="text-xs text-primary font-medium hover:underline">View all →</Link>
          </div>
          <div className="divide-y divide-border">
            {recentBills.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No bills yet</div>}
            {recentBills.map((b) => (
              <Link key={b.id} to="/admin/bills/$id" params={{ id: b.id }} className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-mono text-xs font-bold">#{b.bill_number}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{b.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{new Date(b.bill_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">₹{Number(b.grand_total).toLocaleString("en-IN")}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div>
              <h3 className="font-display font-bold">Recent Bookings</h3>
              <p className="text-xs text-muted-foreground">Latest 5 trip requests</p>
            </div>
            <Link to="/admin/bookings" className="text-xs text-primary font-medium hover:underline">View all →</Link>
          </div>
          <div className="divide-y divide-border">
            {recentBookings.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No bookings yet</div>}
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center"><Calendar className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.vehicle} · {new Date(b.pickup_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                </div>
                <span className={`text-[10px] uppercase font-semibold px-2.5 py-1 rounded-full ${b.status === "pending" ? "bg-amber-100 text-amber-700" : b.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-secondary text-muted-foreground"}`}>{b.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
