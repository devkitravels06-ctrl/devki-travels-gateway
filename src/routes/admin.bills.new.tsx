import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2, Save, Printer } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/admin/bills/new")({
  component: NewBillPage,
});

interface Item { particulars: string; rate: number; amount: number; }

function numberToWords(num: number): string {
  if (num === 0) return "Zero";
  const a = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const b = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const inWords = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n/10)] + (n%10 ? " " + a[n%10] : "");
    if (n < 1000) return a[Math.floor(n/100)] + " Hundred" + (n%100 ? " " + inWords(n%100) : "");
    if (n < 100000) return inWords(Math.floor(n/1000)) + " Thousand" + (n%1000 ? " " + inWords(n%1000) : "");
    if (n < 10000000) return inWords(Math.floor(n/100000)) + " Lakh" + (n%100000 ? " " + inWords(n%100000) : "");
    return inWords(Math.floor(n/10000000)) + " Crore" + (n%10000000 ? " " + inWords(n%10000000) : "");
  };
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  return `${inWords(rupees)} Rupees${paise ? " and " + inWords(paise) + " Paise" : ""} Only`;
}

function NewBillPage() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({ name: "", address: "" });
  const [billDate, setBillDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<Item[]>([{ particulars: "", rate: 0, amount: 0 }]);
  const [tax, setTax] = useState({ cgst: 0, sgst: 0, igst: 0 });
  const [advance, setAdvance] = useState(0);
  const [bank, setBank] = useState("");
  const [saving, setSaving] = useState(false);

  const subtotal = useMemo(() => items.reduce((s, i) => s + (Number(i.amount) || 0), 0), [items]);
  const cgstAmt = (subtotal * tax.cgst) / 100;
  const sgstAmt = (subtotal * tax.sgst) / 100;
  const igstAmt = (subtotal * tax.igst) / 100;
  const grandTotal = subtotal - advance + cgstAmt + sgstAmt + igstAmt;

  function updateItem(i: number, patch: Partial<Item>) {
    setItems((arr) => arr.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  }
  function addRow() { setItems((a) => [...a, { particulars: "", rate: 0, amount: 0 }]); }
  function removeRow(i: number) { setItems((a) => a.filter((_, idx) => idx !== i)); }

  async function save() {
    if (!customer.name.trim()) { toast.error("Customer name required"); return; }
    if (subtotal <= 0) { toast.error("Add at least one item with amount"); return; }
    setSaving(true);
    const { data, error } = await supabase.from("bills").insert([{
      bill_date: billDate,
      customer_name: customer.name,
      customer_address: customer.address,
      gstin: SITE.gstin,
      particulars: items,
      subtotal,
      less_advance: advance,
      cgst_percent: tax.cgst, sgst_percent: tax.sgst, igst_percent: tax.igst,
      cgst_amount: cgstAmt, sgst_amount: sgstAmt, igst_amount: igstAmt,
      grand_total: grandTotal,
      amount_in_words: numberToWords(grandTotal),
      bank_name: bank,
    }]).select().single();
    setSaving(false);
    if (error) { toast.error("Failed to save bill"); return; }
    toast.success(`Bill #${data.bill_number} saved`);
    navigate({ to: "/admin/bills/$id", params: { id: data.id } });
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Generate Bill</h1>
          <p className="text-muted-foreground text-sm mt-1">GST Tax Invoice · matches your physical book format</p>
        </div>
        <Link to="/admin/bills" className="text-sm text-primary hover:underline">← All bills</Link>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-soft">
        {/* Header preview */}
        <div className="border-b-2 border-foreground pb-4 mb-6">
          <div className="flex justify-between text-xs">
            <span>GSTIN-{SITE.gstin}</span>
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

        {/* Customer + Date */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <Label>M/s.</Label>
            <input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} className="input" placeholder="Customer / Department name" />
            <textarea value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} rows={2} className="input mt-2" placeholder="Address (optional)" />
          </div>
          <div>
            <Label>Date</Label>
            <input type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} className="input" />
            <Label className="mt-3 block">Bill No.</Label>
            <div className="px-3 py-2.5 bg-secondary rounded-lg text-sm text-muted-foreground">Auto-assigned on save</div>
          </div>
        </div>

        {/* Particulars */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 bg-secondary text-xs font-semibold uppercase tracking-wider">
            <div className="col-span-1 p-3 border-r border-border">S.No.</div>
            <div className="col-span-7 p-3 border-r border-border">Particulars</div>
            <div className="col-span-2 p-3 border-r border-border">Rate</div>
            <div className="col-span-2 p-3">Amount</div>
          </div>
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-12 border-t border-border items-center">
              <div className="col-span-1 p-2 text-center text-sm">{i + 1}</div>
              <div className="col-span-7 p-2 border-l border-border">
                <input value={it.particulars} onChange={(e) => updateItem(i, { particulars: e.target.value })} className="w-full bg-transparent outline-none px-2 py-1.5 text-sm" placeholder="e.g., Innova Crysta hire — Dehradun to Mussoorie" />
              </div>
              <div className="col-span-2 p-2 border-l border-border">
                <input type="number" value={it.rate || ""} onChange={(e) => updateItem(i, { rate: Number(e.target.value) })} className="w-full bg-transparent outline-none px-2 py-1.5 text-sm" placeholder="0" />
              </div>
              <div className="col-span-2 p-2 border-l border-border flex items-center gap-1">
                <input type="number" value={it.amount || ""} onChange={(e) => updateItem(i, { amount: Number(e.target.value) })} className="w-full bg-transparent outline-none px-2 py-1.5 text-sm" placeholder="0" />
                {items.length > 1 && (
                  <button onClick={() => removeRow(i)} className="text-destructive p-1 hover:bg-destructive/10 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                )}
              </div>
            </div>
          ))}
          <button onClick={addRow} className="w-full p-3 text-sm text-primary hover:bg-primary/5 transition flex items-center justify-center gap-1 border-t border-border">
            <Plus className="w-4 h-4" /> Add Row
          </button>
        </div>

        {/* Totals + Tax */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-3">
            <div>
              <Label>Bank Name</Label>
              <input value={bank} onChange={(e) => setBank(e.target.value)} className="input" placeholder="e.g., SBI Doiwala — A/c xxxx" />
            </div>
            <div>
              <Label>Less Advance (₹)</Label>
              <input type="number" value={advance || ""} onChange={(e) => setAdvance(Number(e.target.value))} className="input" placeholder="0" />
            </div>
          </div>
          <div className="bg-secondary rounded-xl p-4 space-y-2 text-sm">
            <Row label="Total" value={subtotal} />
            <Row label="Less Adv." value={advance} negative />
            <Row label={`Bal. Rs.`} value={subtotal - advance} bold />
            <div className="grid grid-cols-3 gap-2 pt-3">
              <TaxInput label="CGST %" v={tax.cgst} on={(v) => setTax({ ...tax, cgst: v })} />
              <TaxInput label="SGST %" v={tax.sgst} on={(v) => setTax({ ...tax, sgst: v })} />
              <TaxInput label="IGST %" v={tax.igst} on={(v) => setTax({ ...tax, igst: v })} />
            </div>
            <Row label={`CGST @ ${tax.cgst}%`} value={cgstAmt} small />
            <Row label={`SGST @ ${tax.sgst}%`} value={sgstAmt} small />
            <Row label={`IGST @ ${tax.igst}%`} value={igstAmt} small />
            <div className="border-t border-border pt-2 mt-2">
              <Row label="Grand Total" value={grandTotal} bold large />
            </div>
            <div className="text-xs italic pt-2">Rupees: {numberToWords(grandTotal)}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-border">
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-hero text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-smooth disabled:opacity-60">
            <Save className="w-4 h-4" />{saving ? "Saving…" : "Save & View Bill"}
          </button>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card hover:bg-secondary transition">
            <Printer className="w-4 h-4" />Preview Print
          </button>
        </div>

        <div className="mt-6 flex justify-between text-xs text-muted-foreground">
          <div>E. & O.E.<br/>All Disputes subject to Dehradun Jurisdiction only.</div>
          <div className="text-right">For DEVKI TRAVELS<br/><span className="font-semibold mt-4 inline-block">Auth. Signatory</span></div>
        </div>
      </div>
    </div>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1 ${className}`}>{children}</label>;
}
function Row({ label, value, bold, negative, small, large }: { label: string; value: number; bold?: boolean; negative?: boolean; small?: boolean; large?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-bold" : ""} ${small ? "text-xs" : ""} ${large ? "text-base" : ""}`}>
      <span>{label}</span>
      <span>{negative ? "-" : ""}₹ {value.toFixed(2)}</span>
    </div>
  );
}
function TaxInput({ label, v, on }: { label: string; v: number; on: (v: number) => void }) {
  return (
    <div>
      <label className="text-[10px] uppercase block">{label}</label>
      <input type="number" value={v || ""} onChange={(e) => on(Number(e.target.value))} className="w-full px-2 py-1.5 rounded border border-border bg-background text-xs" placeholder="0" />
    </div>
  );
}
