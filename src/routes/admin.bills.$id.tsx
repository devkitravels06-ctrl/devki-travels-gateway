import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Printer, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/admin/bills/$id")({
  component: BillView,
});

function BillView() {
  const { id } = Route.useParams();
  const [bill, setBill] = useState<any>(null);
  useEffect(() => { (async () => {
    const { data } = await supabase.from("bills").select("*").eq("id", id).single();
    setBill(data);
  })(); }, [id]);

  if (!bill) return <div className="text-muted-foreground">Loading…</div>;
  const items = (bill.particulars as any[]) || [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link to="/admin/bills" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />Back to bills
        </Link>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-hero text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-smooth">
          <Printer className="w-4 h-4" />Print
        </button>
      </div>

      <div className="bg-white text-black border-2 border-black p-6 md:p-10 shadow-elegant" id="print-area">
        <div className="border-b-2 border-black pb-3">
          <div className="flex justify-between text-xs font-semibold">
            <span>GSTIN-{bill.gstin}</span>
            <span className="text-right">MOB.- {SITE.phone1.replace(/\s/g,'')}<br/>{SITE.phone2.replace(/\s/g,'')}</span>
          </div>
          <div className="text-center mt-1">
            <div className="uppercase text-xs underline">Tax Invoice</div>
            <div className="font-display font-bold text-3xl tracking-wider">DEVKI TRAVELS</div>
            <div className="text-xs font-semibold">Deals In : (AC/Non AC)</div>
            <div className="text-xs">Innova, Tavera, Qualis, Scorpio, Sumo, Tempo Traveller, Car, Tata-Indigo/Indica etc.</div>
            <div className="text-sm font-semibold mt-1">{SITE.address}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-3 border-b-2 border-black pb-3">
          <div className="col-span-2">
            <span className="font-semibold text-sm">M/s. </span>
            <span className="text-sm">{bill.customer_name}</span>
            {bill.customer_address && <div className="text-xs mt-1">{bill.customer_address}</div>}
          </div>
          <div className="text-sm">
            <div><span className="font-semibold">No. </span>{bill.bill_number}</div>
            <div><span className="font-semibold">Date </span>{new Date(bill.bill_date).toLocaleDateString("en-IN")}</div>
          </div>
        </div>

        <table className="w-full border border-black border-collapse mt-3 text-sm">
          <thead>
            <tr>
              <th className="border border-black p-2 w-12">S.No.</th>
              <th className="border border-black p-2 text-center">PARTICULARS</th>
              <th className="border border-black p-2 w-20">Rate</th>
              <th className="border border-black p-2 w-24">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td className="border border-black p-2 text-center">{i + 1}</td>
                <td className="border border-black p-2">{it.particulars}</td>
                <td className="border border-black p-2 text-right">{it.rate ? Number(it.rate).toFixed(2) : ""}</td>
                <td className="border border-black p-2 text-right">{it.amount ? Number(it.amount).toFixed(2) : ""}</td>
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 8 - items.length) }).map((_, i) => (
              <tr key={`e${i}`}><td className="border border-black p-2">&nbsp;</td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td></tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-2 border-x border-b border-black text-sm">
          <div className="p-2 border-r border-black">
            <div>Total..........Less Adv. {Number(bill.less_advance).toFixed(2)}........Bal. Rs. {(Number(bill.subtotal) - Number(bill.less_advance)).toFixed(2)}</div>
            <div className="mt-2"><span className="font-semibold">Bank Name :- </span>{bill.bank_name || ""}</div>
          </div>
          <div className="border-l border-black">
            <RowP label="Total" value={bill.subtotal} />
            <RowP label={`CGST @ ${bill.cgst_percent}%`} value={bill.cgst_amount} />
            <RowP label={`SGST @ ${bill.sgst_percent}%`} value={bill.sgst_amount} />
            <RowP label={`IGST @ ${bill.igst_percent}%`} value={bill.igst_amount} />
            <RowP label="Grand Total" value={bill.grand_total} bold />
          </div>
        </div>

        <div className="border-x border-b border-black p-2 text-sm">
          <span className="font-semibold">Rupees </span>{bill.amount_in_words}
        </div>

        <div className="flex justify-between mt-4 text-xs">
          <div>E. & O.E.<br/>All Disputes subject to Dehradun Jurisdiction only.</div>
          <div className="text-right">For DEVKI TRAVELS<br/><span className="font-semibold mt-6 inline-block">Auth. Signatory</span></div>
        </div>
      </div>

      <style>{`@media print { body * { visibility: hidden; } #print-area, #print-area * { visibility: visible; } #print-area { position: absolute; inset: 0; box-shadow: none; border: 1px solid black; } }`}</style>
    </div>
  );
}

function RowP({ label, value, bold }: { label: string; value: any; bold?: boolean }) {
  return (
    <div className={`flex justify-between border-b border-black p-2 ${bold ? "font-bold" : ""}`}>
      <span>{label}</span>
      <span>{Number(value || 0).toFixed(2)}</span>
    </div>
  );
}
