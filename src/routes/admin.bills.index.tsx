import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Eye, FileSignature, Search, FileText, IndianRupee, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/bills/")({
  component: BillsList,
});

function BillsList() {
  const [bills, setBills] = useState<any[]>([]);
  const [q, setQ] = useState("");
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("bills").select("*").order("created_at", { ascending: false });
      setBills(data ?? []);
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return bills;
    return bills.filter((b) => b.customer_name?.toLowerCase().includes(s) || String(b.bill_number).includes(s));
  }, [bills, q]);

  const totalRevenue = bills.reduce((s, b) => s + Number(b.grand_total || 0), 0);
  const thisMonth = bills.filter((b) => new Date(b.bill_date).getMonth() === new Date().getMonth()).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">All Bills</h1>
          <p className="text-muted-foreground text-sm mt-1">Browse, search and view all generated invoices</p>
        </div>
        <Link to="/admin/bills/new" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-hero text-primary-foreground font-semibold shadow-soft hover:shadow-glow hover:scale-105 transition-smooth">
          <FileSignature className="w-4 h-4" />Generate New Bill
        </Link>
      </div>

      {/* Stat strip */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatTile icon={FileText} label="Total Bills" value={String(bills.length)} gradient="from-blue-500 to-indigo-600" />
        <StatTile icon={IndianRupee} label="Total Revenue" value={`₹ ${totalRevenue.toLocaleString("en-IN")}`} gradient="from-emerald-500 to-teal-600" />
        <StatTile icon={Calendar} label="This Month" value={String(thisMonth)} gradient="from-fuchsia-500 to-purple-600" />
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
              <th className="text-right p-4 font-semibold">Total</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-t border-border hover:bg-secondary/40 transition group">
                <td className="p-4">
                  <span className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-mono text-xs font-bold shadow-sm">#{b.bill_number}</span>
                </td>
                <td className="p-4 text-muted-foreground">{new Date(b.bill_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                <td className="p-4 font-semibold">{b.customer_name}</td>
                <td className="p-4 text-right font-bold text-lg">₹ {Number(b.grand_total).toLocaleString("en-IN")}</td>
                <td className="p-4 text-right">
                  <Link to="/admin/bills/$id" params={{ id: b.id }} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition font-medium text-xs">
                    <Eye className="w-3.5 h-3.5" />View
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-16 text-center text-muted-foreground">
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

function StatTile({ icon: Icon, label, value, gradient }: { icon: any; label: string; value: string; gradient: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover-lift">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-soft`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{label}</div>
          <div className="text-xl font-display font-bold mt-0.5">{value}</div>
        </div>
      </div>
    </div>
  );
}
