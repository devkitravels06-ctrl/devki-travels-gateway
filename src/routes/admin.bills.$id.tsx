import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Printer, ArrowLeft, FileText, Download, Sparkles, CheckCircle2 } from "lucide-react";
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

  if (!bill) return <div className="text-muted-foreground p-8 text-center">Loading…</div>;
  const items = (bill.particulars as any[]) || [];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Toolbar — hidden on print */}
      <div className="no-print mb-6 relative overflow-hidden bg-gradient-to-br from-[oklch(0.22_0.08_250)] via-primary to-[oklch(0.72_0.16_235)] rounded-3xl p-6 text-white shadow-elegant">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[oklch(0.78_0.15_80)]/20 blur-3xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-glow">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[10px] uppercase tracking-widest mb-1">
                <Sparkles className="w-3 h-3" /> Tax Invoice
              </div>
              <div className="font-display text-2xl lg:text-3xl font-bold">Bill #{bill.bill_number}</div>
              <div className="text-sm opacity-90 flex items-center gap-2 mt-0.5">
                <span>{bill.customer_name}</span>
                <span className="opacity-50">·</span>
                <span>{new Date(bill.bill_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/bills" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 transition text-sm backdrop-blur">
              <ArrowLeft className="w-4 h-4" />Back
            </Link>
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-primary font-semibold shadow-soft hover:scale-105 transition-smooth">
              <Printer className="w-4 h-4" />Print Bill
            </button>
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[oklch(0.78_0.15_80)] text-[oklch(0.22_0.08_250)] font-semibold shadow-soft hover:scale-105 transition-smooth">
              <Download className="w-4 h-4" />PDF
            </button>
          </div>
        </div>
      </div>

      {/* Status banner */}
      <div className="no-print mb-6 flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <div className="text-sm">
          <span className="font-semibold text-emerald-800">Invoice saved successfully.</span>
          <span className="text-emerald-700"> Click Print Bill to generate a clean A4 print — only the invoice will print.</span>
        </div>
      </div>

      {/* PRINT AREA — beautifully styled colourful invoice */}
      <div id="print-area" className="bg-white text-black shadow-elegant rounded-2xl overflow-hidden print:rounded-none print:shadow-none border border-border print:border-0">
        {/* Coloured top band */}
        <div className="relative bg-gradient-to-r from-[#1e3a8a] via-[#1d4ed8] to-[#0891b2] text-white px-8 py-6 print:px-6 print:py-5">
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] uppercase tracking-[0.2em] font-semibold mb-2">Tax Invoice</div>
              <div className="font-display font-bold text-3xl tracking-wider">DEVKI TRAVELS</div>
              <div className="text-xs opacity-90 mt-1">Deals In : (AC / Non AC) Innova · Tavera · Scorpio · Tempo Traveller · Tata Indica/Indigo</div>
            </div>
            <div className="text-right text-xs">
              <div className="font-semibold tracking-wider">GSTIN</div>
              <div className="opacity-90">{bill.gstin}</div>
              <div className="font-semibold tracking-wider mt-2">MOBILE</div>
              <div className="opacity-90">{SITE.phone1.replace(/\s/g,'')}</div>
              <div className="opacity-90">{SITE.phone2.replace(/\s/g,'')}</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/20 text-xs opacity-95">{SITE.address}</div>
          {/* Decorative wave */}
          <svg className="absolute bottom-0 left-0 right-0 w-full" height="6" viewBox="0 0 1200 6" preserveAspectRatio="none">
            <path d="M0,3 Q300,6 600,3 T1200,3 L1200,6 L0,6 Z" fill="white" />
          </svg>
        </div>

        {/* Bill meta */}
        <div className="grid grid-cols-3 gap-4 px-8 py-5 print:px-6 print:py-4 bg-gradient-to-r from-[#f0f9ff] to-[#fef3c7] border-b border-gray-200">
          <div className="col-span-2">
            <div className="text-[10px] uppercase tracking-widest text-[#1e3a8a] font-bold mb-1">Billed To</div>
            <div className="font-bold text-base">{bill.customer_name}</div>
            {bill.customer_address && <div className="text-xs text-gray-700 mt-0.5">{bill.customer_address}</div>}
          </div>
          <div className="text-right text-sm space-y-1">
            <div><span className="text-[10px] uppercase tracking-widest text-[#1e3a8a] font-bold">Invoice No. </span><span className="font-mono font-bold">#{bill.bill_number}</span></div>
            <div><span className="text-[10px] uppercase tracking-widest text-[#1e3a8a] font-bold">Date </span><span className="font-semibold">{new Date(bill.bill_date).toLocaleDateString("en-IN")}</span></div>
          </div>
        </div>

        {/* Particulars table */}
        <div className="px-8 py-5 print:px-6 print:py-4">
          <table className="w-full text-sm border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-[#1e3a8a] to-[#0891b2] text-white">
                <th className="p-3 text-left text-[11px] uppercase tracking-wider w-12">#</th>
                <th className="p-3 text-left text-[11px] uppercase tracking-wider">Particulars</th>
                <th className="p-3 text-right text-[11px] uppercase tracking-wider w-24">Rate</th>
                <th className="p-3 text-right text-[11px] uppercase tracking-wider w-28">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"}>
                  <td className="p-3 text-center text-gray-600 border-b border-gray-100">{i + 1}</td>
                  <td className="p-3 border-b border-gray-100 font-medium">{it.particulars}</td>
                  <td className="p-3 text-right font-mono border-b border-gray-100">{it.rate ? Number(it.rate).toFixed(2) : "—"}</td>
                  <td className="p-3 text-right font-mono font-semibold border-b border-gray-100">{it.amount ? Number(it.amount).toFixed(2) : "—"}</td>
                </tr>
              ))}
              {Array.from({ length: Math.max(0, 5 - items.length) }).map((_, i) => (
                <tr key={`e${i}`} className={(items.length + i) % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"}>
                  <td className="p-3 border-b border-gray-100">&nbsp;</td>
                  <td className="p-3 border-b border-gray-100"></td>
                  <td className="p-3 border-b border-gray-100"></td>
                  <td className="p-3 border-b border-gray-100"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals + Bank */}
        <div className="grid grid-cols-2 gap-0 px-8 print:px-6 pb-5">
          <div className="pr-4 text-sm">
            <div className="bg-[#fef3c7] border border-[#fbbf24]/40 rounded-lg p-4">
              <div className="text-[10px] uppercase tracking-widest text-[#92400e] font-bold mb-2">Bank Details</div>
              <div className="font-semibold">{bill.bank_name || "—"}</div>
              <div className="mt-3 text-xs text-gray-700">
                Less Adv: ₹ {Number(bill.less_advance).toFixed(2)} · Bal: ₹ {(Number(bill.subtotal) - Number(bill.less_advance)).toFixed(2)}
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] rounded-lg p-4 text-sm border border-[#0891b2]/20">
            <RowP label="Subtotal" value={bill.subtotal} />
            {Number(bill.cgst_percent) > 0 && <RowP label={`CGST @ ${bill.cgst_percent}%`} value={bill.cgst_amount} />}
            {Number(bill.sgst_percent) > 0 && <RowP label={`SGST @ ${bill.sgst_percent}%`} value={bill.sgst_amount} />}
            {Number(bill.igst_percent) > 0 && <RowP label={`IGST @ ${bill.igst_percent}%`} value={bill.igst_amount} />}
            <div className="mt-2 pt-2 border-t-2 border-[#1e3a8a]/20">
              <div className="flex justify-between items-center bg-gradient-to-r from-[#1e3a8a] to-[#0891b2] text-white px-3 py-2.5 rounded-lg font-bold">
                <span>GRAND TOTAL</span>
                <span className="text-lg">₹ {Number(bill.grand_total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount in words */}
        <div className="px-8 print:px-6 pb-4">
          <div className="bg-[#fef3c7] border-l-4 border-[#fbbf24] rounded-r-lg p-3 text-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#92400e] font-bold">Amount in Words: </span>
            <span className="font-semibold italic">{bill.amount_in_words}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#f8fafc] border-t border-gray-200 px-8 print:px-6 py-4 flex justify-between items-end text-xs text-gray-700">
          <div>
            <div className="font-semibold text-gray-800">E. & O.E.</div>
            <div>All disputes subject to Dehradun jurisdiction only.</div>
            <div className="mt-2 text-[10px] text-gray-500">Thank you for choosing Devki Travels. Safe Journey!</div>
          </div>
          <div className="text-right">
            <div className="text-gray-600">For DEVKI TRAVELS</div>
            <div className="mt-8 pt-1 border-t border-gray-400 px-6 font-semibold text-gray-800">Auth. Signatory</div>
          </div>
        </div>
      </div>

      {/* Print-only stylesheet — isolates the bill */}
      <style>{`
        @media print {
          @page { size: A4; margin: 10mm; }
          html, body { background: white !important; margin: 0 !important; padding: 0 !important; }
          body * { visibility: hidden !important; }
          #print-area, #print-area * { visibility: visible !important; }
          #print-area {
            position: absolute !important;
            left: 0 !important; top: 0 !important; right: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          #print-area * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print { display: none !important; }
          /* Hide site nav/footer if rendered */
          header, footer, nav, aside { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function RowP({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between py-1.5 text-gray-700">
      <span>{label}</span>
      <span className="font-mono font-semibold">₹ {Number(value || 0).toFixed(2)}</span>
    </div>
  );
}
