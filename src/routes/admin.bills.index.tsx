import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Eye, FileSignature, Search, FileText, IndianRupee, Calendar, Ban, CheckCircle2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/bills/")({
  component: BillsList,
});

function BillsList() {
  const [bills, setBills] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from("bills").select("*").order("created_at", { ascending: false });
    setBills(data ?? []);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return bills;
    return bills.filter((b) => b.customer_name?.toLowerCase().includes(s) || String(b.bill_number).includes(s));
  }, [bills, q]);

  const now = new Date();
  const monthlyRevenue = bills
    .filter((b) => b.status !== "cancelled" && new Date(b.bill_date).getMonth() === now.getMonth() && new Date(b.bill_date).getFullYear() === now.getFullYear())
    .reduce((s, b) => s + Number(b.grand_total || 0), 0);
  const yearlyRevenue = bills
    .filter((b) => b.status !== "cancelled" && new Date(b.bill_date).getFullYear() === now.getFullYear())
    .reduce((s, b) => s + Number(b.grand_total || 0), 0);
  const cancelledCount = bills.filter((b) => b.status === "cancelled").length;

  async function toggleCancel(b: any) {
    const cancelling = b.status !== "cancelled";
    if (cancelling && !confirm(`Cancel bill #${b.bill_number}? It will be removed from monthly & yearly revenue.`)) return;
    if (!cancelling && !confirm(`Reactivate bill #${b.bill_number}? It will count again in revenue.`)) return;
    setBusyId(b.id);
    const { error } = await supabase.from("bills").update({ status: cancelling ? "cancelled" : "active" } as any).eq("id", b.id);
    setBusyId(null);
    if (error) { toast.error(error.message); return; }
    toast.success(cancelling ? `Bill #${b.bill_number} cancelled` : `Bill #${b.bill_number} reactivated`);
    load();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">All Bills</h1>
          <p className="text-muted-foreground text-sm mt-1">Browse, search, view & cancel invoices · Cancelled bills are excluded from revenue</p>
        </div>
        <Link to="/admin/bills/new" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-hero text-primary-foreground font-semibold shadow-soft hover:shadow-glow hover:scale-105 transition-smooth">
          <FileSignature className="w-4 h-4" />Generate New Bill
        </Link>
      </div>

      {/* Stat strip */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={FileText} label="Total Bills" value={String(bills.length)} sub={`${cancelledCount} cancelled`} gradient="from-blue-500 to-indigo-600" />
        <StatTile icon={Calendar} label={`This Month — ${now.toLocaleString("en-IN", { month: "long" })}`} value={`₹ ${monthlyRevenue.toLocaleString("en-IN")}`} sub="Resets monthly" gradient="from-fuchsia-500 to-purple-600" />
        <StatTile icon={TrendingUp} label={`Yearly Revenue — ${now.getFullYear()}`} value={`₹ ${yearlyRevenue.toLocaleString("en-IN")}`} sub="For CA / GST filing" gradient="from-emerald-500 to-teal-600" />
        <StatTile icon={IndianRupee} label="All-time Revenue" value={`₹ ${bills.filter((b) => b.status !== "cancelled").reduce((s, b) => s + Number(b.grand_total || 0), 0).toLocaleString("en-IN")}`} sub="Excluding cancelled" gradient="from-amber-500 to-rose-600" />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by customer name or bill number…" className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition text-sm" />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-secondary to-[oklch(0.96_0.04_225)] text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left p-4 font-semibold">Bill #</th>
              <th className="text-left p-4 font-semibold">Date</th>
              <th className="text-left p-4 font-semibold">Customer</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-right p-4 font-semibold">Total</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => {
              const cancelled = b.status === "cancelled";
              return (
                <tr key={b.id} className={`border-t border-border hover:bg-secondary/40 transition group ${cancelled ? "opacity-60" : ""}`}>
                  <td className="p-4">
                    <span className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-mono text-xs font-bold shadow-sm">#{b.bill_number}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">{new Date(b.bill_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className={`p-4 font-semibold ${cancelled ? "line-through" : ""}`}>{b.customer_name}</td>
                  <td className="p-4">
                    {cancelled ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-destructive/10 text-destructive">Cancelled</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Active</span>
                    )}
                  </td>
                  <td className={`p-4 text-right font-bold text-lg ${cancelled ? "line-through text-muted-foreground" : ""}`}>₹ {Number(b.grand_total).toLocaleString("en-IN")}</td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-1.5">
                      <Link to="/admin/bills/$id" params={{ id: b.id }} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition font-medium text-xs">
                        <Eye className="w-3.5 h-3.5" />View
                      </Link>
                      <button
                        onClick={() => toggleCancel(b)}
                        disabled={busyId === b.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition font-medium text-xs ${cancelled ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-destructive/10 text-destructive hover:bg-destructive hover:text-white"}`}
                      >
                        {cancelled ? <><CheckCircle2 className="w-3.5 h-3.5" />Reactivate</> : <><Ban className="w-3.5 h-3.5" />Cancel</>}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-16 text-center text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                {q ? "No bills match your search." : <>No bills yet. <Link to="/admin/bills/new" className="text-primary font-medium">Generate your first bill →</Link></>}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, sub, gradient }: { icon: any; label: string; value: string; sub?: string; gradient: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover-lift">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-soft shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold truncate">{label}</div>
          <div className="text-lg font-display font-bold mt-0.5 truncate">{value}</div>
          {sub && <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>}
        </div>
      </div>
    </div>
  );
}
