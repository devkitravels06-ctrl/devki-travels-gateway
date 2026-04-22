import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Printer, ArrowLeft, FileText, Download, CheckCircle2, XCircle, Ban } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";
import logo from "@/assets/devki-logo.png";

export const Route = createFileRoute("/admin/bills/$id")({
  component: BillView,
});

function BillView() {
  const { id } = Route.useParams();
  const [bill, setBill] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await supabase.from("bills").select("*").eq("id", id).single();
    setBill(data);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  async function toggleCancel() {
    if (!bill) return;
    const cancelling = bill.status !== "cancelled";
    if (cancelling && !confirm("Cancel this bill? It will be excluded from monthly & yearly revenue.")) return;
    if (!cancelling && !confirm("Reactivate this bill? It will be counted again in revenue.")) return;
    setBusy(true);
    const { error } = await supabase.from("bills").update({ status: cancelling ? "cancelled" : "active" } as any).eq("id", id);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(cancelling ? "Bill cancelled" : "Bill reactivated");
    load();
  }

  if (!bill) return <div className="text-muted-foreground p-8 text-center">Loading…</div>;
  const items = (bill.particulars as any[]) || [];
  const totalQty = items.length;
  const cancelled = bill.status === "cancelled";

  return (
    <div className="max-w-5xl mx-auto">
      {/* Toolbar — hidden on print */}
      <div className="no-print mb-6 flex items-center justify-between flex-wrap gap-4 p-5 rounded-2xl bg-card border border-border shadow-soft">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="font-display text-xl font-bold flex items-center gap-2">
              Tax Invoice #{bill.bill_number}
              {cancelled && <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-semibold">Cancelled</span>}
            </div>
            <div className="text-sm text-muted-foreground">{bill.customer_name} · {new Date(bill.bill_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/bills" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/70 transition text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />Back
          </Link>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold shadow-soft hover:opacity-90 transition">
            <Printer className="w-4 h-4" />Print Invoice
          </button>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background font-semibold hover:opacity-90 transition">
            <Download className="w-4 h-4" />Save as PDF
          </button>
          <button onClick={toggleCancel} disabled={busy} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition text-sm ${cancelled ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-destructive/10 text-destructive hover:bg-destructive hover:text-white"}`}>
            {cancelled ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
            {cancelled ? "Reactivate" : "Cancel Bill"}
          </button>
        </div>
      </div>

      <div className="no-print mb-6 flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span className="text-emerald-800">A4-optimised, government-grade format. Use <b>Save as PDF</b> from the print dialog and select <b>A4</b>.</span>
      </div>

      {/* PRINT AREA — fills full A4 */}
      <div id="print-area" className="bg-white text-black shadow-elegant border border-gray-300 print:shadow-none print:border-0 relative">
        {cancelled && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20" aria-hidden>
            <div className="rotate-[-22deg] border-[6px] border-red-600 text-red-600 px-12 py-3 text-5xl font-extrabold tracking-[0.4em] opacity-25">CANCELLED</div>
          </div>
        )}

        {/* Title strip */}
        <div className="text-center border-b-2 border-black py-2">
          <div className="text-[11px] tracking-[0.4em] font-bold text-gray-700">TAX INVOICE</div>
          <div className="text-[9px] text-gray-500 tracking-widest">(ORIGINAL FOR RECIPIENT)</div>
        </div>

        {/* Letterhead */}
        <div className="px-8 py-5 print:px-6 print:py-4 border-b-2 border-black">
          <div className="flex justify-between items-start gap-6">
            <div className="flex items-start gap-4 flex-1">
              <img src={logo} alt="Devki Travels" className="w-24 h-24 object-contain shrink-0" />
              <div className="flex-1">
                <div className="font-display font-extrabold text-[26px] leading-tight tracking-wide text-[#0b2545]">DEVKI TRAVELS</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-amber-600 font-semibold mt-0.5">Travel Uttarakhand · Travel Comfortably</div>
                <div className="text-[11px] text-gray-700 mt-1 italic">Deals In : (AC / Non AC) Innova · Tavera · Scorpio · Tempo Traveller · Tata Indica / Indigo</div>
                <div className="text-[11px] text-gray-800 mt-2 leading-relaxed">
                  <div><span className="font-semibold">Address:</span> {SITE.address}</div>
                  <div className="mt-0.5"><span className="font-semibold">Mobile:</span> {SITE.phone1}, {SITE.phone2} &nbsp;·&nbsp; <span className="font-semibold">Email:</span> {SITE.email}</div>
                </div>
              </div>
            </div>
            <div className="text-right text-[11px] border border-gray-400 rounded p-2 min-w-[180px]">
              <div className="font-bold text-[#0b2545] tracking-wider">GSTIN</div>
              <div className="font-mono font-semibold text-[12px]">{bill.gstin || "—"}</div>
              <div className="font-bold text-[#0b2545] tracking-wider mt-2">STATE</div>
              <div className="font-mono">Uttarakhand (05)</div>
            </div>
          </div>
        </div>

        {/* Invoice meta strip */}
        <div className="grid grid-cols-2 border-b border-black text-[12px]">
          <div className="p-3 border-r border-black">
            <div className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Billed To</div>
            <div className="font-bold text-[14px] mt-0.5 text-[#0b2545]">{bill.customer_name}</div>
            {bill.customer_address && <div className="text-[11px] text-gray-700 mt-0.5 leading-snug">{bill.customer_address}</div>}
          </div>
          <div className="grid grid-cols-2 text-[11px]">
            <Meta label="Invoice No." value={`#${bill.bill_number}`} />
            <Meta label="Invoice Date" value={new Date(bill.bill_date).toLocaleDateString("en-IN")} />
            <Meta label="Place of Supply" value="Uttarakhand (05)" />
            <Meta label="Reverse Charge" value="No" last />
          </div>
        </div>

        {/* Particulars */}
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="bg-[#0b2545] text-white">
              <th className="p-2 text-left border border-black w-10 font-semibold">S.No</th>
              <th className="p-2 text-left border border-black font-semibold">Particulars / Description of Service</th>
              <th className="p-2 text-center border border-black w-20 font-semibold">SAC</th>
              <th className="p-2 text-right border border-black w-24 font-semibold">Rate (₹)</th>
              <th className="p-2 text-right border border-black w-28 font-semibold">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="bg-white">
                <td className="p-2 text-center border border-gray-400">{i + 1}</td>
                <td className="p-2 border border-gray-400 font-medium">{it.particulars}</td>
                <td className="p-2 text-center border border-gray-400 font-mono">9964</td>
                <td className="p-2 text-right border border-gray-400 font-mono">{it.rate ? Math.round(Number(it.rate)).toLocaleString("en-IN") : "—"}</td>
                <td className="p-2 text-right border border-gray-400 font-mono font-semibold">{it.amount ? Math.round(Number(it.amount)).toLocaleString("en-IN") : "—"}</td>
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 8 - items.length) }).map((_, i) => (
              <tr key={`e${i}`}>
                <td className="p-2 border border-gray-400">&nbsp;</td>
                <td className="p-2 border border-gray-400"></td>
                <td className="p-2 border border-gray-400"></td>
                <td className="p-2 border border-gray-400"></td>
                <td className="p-2 border border-gray-400"></td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-semibold">
              <td className="p-2 text-center border border-black" colSpan={4}>Subtotal ({totalQty} item{totalQty !== 1 ? "s" : ""})</td>
              <td className="p-2 text-right border border-black font-mono">{Math.round(Number(bill.subtotal)).toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
        </table>

        {/* Bank + Tax breakup */}
        <div className="grid grid-cols-2 border-b border-black">
          <div className="p-4 border-r border-black text-[11px] space-y-2">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">Bank Details</div>
              <div className="font-semibold text-[12px] leading-relaxed">{bill.bank_name || "—"}</div>
            </div>
            <div className="pt-2 border-t border-gray-300">
              <div className="flex justify-between"><span>Less: Advance Received</span><span className="font-mono font-semibold">₹ {Math.round(Number(bill.less_advance)).toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between mt-1"><span className="font-semibold">Balance Due</span><span className="font-mono font-bold">₹ {Math.round(Number(bill.subtotal) - Number(bill.less_advance)).toLocaleString("en-IN")}</span></div>
            </div>
            {bill.notes && (
              <div className="pt-2 border-t border-gray-300">
                <div className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">Notes</div>
                <div className="text-[11px] text-gray-700 leading-snug">{bill.notes}</div>
              </div>
            )}
          </div>
          <div className="p-4 text-[12px]">
            <RowP label="Taxable Value" value={bill.subtotal} />
            {Number(bill.cgst_percent) > 0 && <RowP label={`CGST @ ${bill.cgst_percent}%`} value={bill.cgst_amount} />}
            {Number(bill.sgst_percent) > 0 && <RowP label={`SGST @ ${bill.sgst_percent}%`} value={bill.sgst_amount} />}
            {Number(bill.igst_percent) > 0 && <RowP label={`IGST @ ${bill.igst_percent}%`} value={bill.igst_amount} />}
            <div className="mt-3 pt-2 border-t-2 border-black">
              <div className="flex justify-between items-center bg-[#0b2545] text-white px-3 py-2 rounded-sm">
                <span className="font-bold tracking-wider text-[12px]">GRAND TOTAL</span>
                <span className="font-mono font-extrabold text-[15px]">₹ {Math.round(Number(bill.grand_total)).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount in words */}
        <div className="px-6 py-3 border-b border-black text-[12px]">
          <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Amount Chargeable (in words): </span>
          <span className="font-semibold italic">{bill.amount_in_words || "—"}</span>
        </div>

        {/* Declaration + signature */}
        <div className="grid grid-cols-2 text-[11px]">
          <div className="p-4 border-r border-black">
            <div className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">Declaration</div>
            <div className="text-gray-800 leading-snug">
              We declare that this invoice shows the actual price of the services described and that all particulars are true and correct. All disputes subject to <span className="font-semibold">Dehradun</span> jurisdiction only.
            </div>
            <div className="text-[10px] text-gray-600 mt-2 font-semibold">E. &amp; O.E.</div>
          </div>
          <div className="p-4 text-right relative">
            <div className="font-bold text-[#0b2545] text-[13px] tracking-wide">For DEVKI TRAVELS Propritor</div>
            {/* Empty space reserved for physical signature */}
            <div className="h-20" />
            <div className="border-t border-black inline-block px-8 pt-1 font-semibold mt-2">Authorised Signatory</div>
          </div>
        </div>

        {/* Footer band */}
        <div className="bg-[#0b2545] text-white text-center text-[10px] tracking-widest py-1.5">
          THIS IS A COMPUTER-GENERATED INVOICE · THANK YOU FOR YOUR BUSINESS
        </div>
      </div>

      {/* Print-only stylesheet — fills full A4 */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 8mm; }
          html, body { background: white !important; margin: 0 !important; padding: 0 !important; }
          body * { visibility: hidden !important; }
          #print-area, #print-area * { visibility: visible !important; }
          #print-area {
            position: absolute !important;
            left: 0 !important; top: 0 !important; right: 0 !important;
            width: 100% !important;
            min-height: calc(297mm - 16mm) !important;
            margin: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            border: none !important;
            display: flex !important;
            flex-direction: column !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          #print-area > table { flex: 1 1 auto !important; }
          #print-area * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print { display: none !important; }
          header, footer, nav, aside { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function RowP({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between py-1 text-gray-800">
      <span>{label}</span>
      <span className="font-mono font-semibold">₹ {Math.round(Number(value || 0)).toLocaleString("en-IN")}</span>
    </div>
  );
}

function Meta({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`p-3 border-b border-gray-300 ${!last ? "border-r" : ""} border-gray-300`}>
      <div className="text-[9px] uppercase tracking-widest text-gray-600 font-bold">{label}</div>
      <div className="font-semibold mt-0.5">{value}</div>
    </div>
  );
}
