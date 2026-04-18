import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, FileSignature } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/bills/")({
  component: BillsList,
});

function BillsList() {
  const [bills, setBills] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("bills").select("*").order("created_at", { ascending: false });
      setBills(data ?? []);
    })();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display font-bold">All Bills</h1>
        <Link to="/admin/bills/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-hero text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-smooth">
          <FileSignature className="w-4 h-4" />New Bill
        </Link>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left p-4">Bill #</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-right p-4">Total</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {bills.map((b) => (
              <tr key={b.id} className="border-t border-border hover:bg-secondary/40 transition">
                <td className="p-4 font-mono">#{b.bill_number}</td>
                <td className="p-4">{new Date(b.bill_date).toLocaleDateString("en-IN")}</td>
                <td className="p-4 font-medium">{b.customer_name}</td>
                <td className="p-4 text-right font-semibold">₹ {Number(b.grand_total).toFixed(2)}</td>
                <td className="p-4 text-right">
                  <Link to="/admin/bills/$id" params={{ id: b.id }} className="inline-flex items-center gap-1 text-primary hover:underline">
                    <Eye className="w-4 h-4" />View
                  </Link>
                </td>
              </tr>
            ))}
            {bills.length === 0 && (
              <tr><td colSpan={5} className="p-12 text-center text-muted-foreground">No bills yet. <Link to="/admin/bills/new" className="text-primary">Generate your first bill →</Link></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
