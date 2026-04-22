import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2, Save, Printer, Car, Fuel, Route as RouteIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/admin/bills/new")({
  component: NewBillPage,
});

interface Item { particulars: string; rate: number; amount: number; }

const BANK_OPTIONS = [
  {
    id: "utgb",
    label: "UTGB — Uttarakhand Gramin Bank",
    name: "UTGB (Uttarakhand Gramin Bank)",
    account: "76020834813",
    ifsc: "SBIN0RRUTGB",
  },
  {
    id: "union",
    label: "Union Bank of India",
    name: "Union Bank of India",
    account: "602501010050357",
    ifsc: "UBIN0560251",
  },
];

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
  return `${inWords(Math.round(num))} Rupees Only`;
}

function NewBillPage() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({ name: "", address: "" });
  const [billDate, setBillDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<Item[]>([
    { particulars: "Vehicle Hire — ", rate: 0, amount: 0 },
  ]);
  const [kmAmount, setKmAmount] = useState(0);
  const [fuelAmount, setFuelAmount] = useState(0);
  const [gstMode, setGstMode] = useState<"none" | "exclusive" | "inclusive">("none");
  const [gstType, setGstType] = useState<"cgst_sgst" | "igst">("cgst_sgst");
  const [gstRate, setGstRate] = useState(5);
  const [advance, setAdvance] = useState(0);
  const [bankId, setBankId] = useState(BANK_OPTIONS[0].id);
  const [saving, setSaving] = useState(false);

  const selectedBank = BANK_OPTIONS.find((b) => b.id === bankId)!;

  // vehicle subtotal = particulars only
  const vehicleSubtotal = useMemo(
    () => items.reduce((s, i) => s + (Number(i.amount) || 0), 0),
    [items]
  );

  // GST applies to vehicle subtotal only (KM/Fuel are reimbursements)
  const { taxableValue, totalGst, cgstAmt, sgstAmt, igstAmt } = useMemo(() => {
    let taxable = vehicleSubtotal;
    let total = 0;
    if (gstMode === "exclusive") {
      total = Math.round((vehicleSubtotal * gstRate) / 100);
    } else if (gstMode === "inclusive") {
      // reverse-calc: vehicleSubtotal includes GST
      taxable = Math.round(vehicleSubtotal / (1 + gstRate / 100));
      total = vehicleSubtotal - taxable;
    }
    const cgst = gstType === "cgst_sgst" ? Math.round(total / 2) : 0;
    const sgst = gstType === "cgst_sgst" ? total - cgst : 0;
    const igst = gstType === "igst" ? total : 0;
    return { taxableValue: taxable, totalGst: total, cgstAmt: cgst, sgstAmt: sgst, igstAmt: igst };
  }, [vehicleSubtotal, gstMode, gstRate, gstType]);

  // Final layout per spec:
  // (vehicle taxable + GST) + KM amount + Fuel amount − advance
  const vehicleWithGst = gstMode === "inclusive" ? vehicleSubtotal : taxableValue + totalGst;
  const grandTotal = Math.round(vehicleWithGst + Number(kmAmount || 0) + Number(fuelAmount || 0) - Number(advance || 0));

  function updateItem(i: number, patch: Partial<Item>) {
    setItems((arr) => arr.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  }
  function addRow() { setItems((a) => [...a, { particulars: "", rate: 0, amount: 0 }]); }
  function removeRow(i: number) { setItems((a) => a.filter((_, idx) => idx !== i)); }

  async function save() {
    if (!customer.name.trim()) { toast.error("Customer name required"); return; }
    if (vehicleSubtotal <= 0) { toast.error("Add at least one vehicle/particular item"); return; }
    setSaving(true);

    // Pack KM/fuel as additional particulars rows so the printable bill renders them too
    const allParticulars = [
      ...items,
      ...(kmAmount > 0 ? [{ particulars: "Kilometre Travel Charges", rate: 0, amount: Math.round(kmAmount) }] : []),
      ...(fuelAmount > 0 ? [{ particulars: "Fuel Charges", rate: 0, amount: Math.round(fuelAmount) }] : []),
    ];

    const bankString = `${selectedBank.name}  •  A/C No: ${selectedBank.account}  •  IFSC: ${selectedBank.ifsc}`;

    const { data, error } = await supabase.from("bills").insert([{
      bill_date: billDate,
      customer_name: customer.name,
      customer_address: customer.address,
      gstin: SITE.gstin,
      particulars: allParticulars as any,
      subtotal: Math.round(vehicleSubtotal + Number(kmAmount || 0) + Number(fuelAmount || 0)),
      less_advance: Math.round(advance),
      cgst_percent: gstType === "cgst_sgst" ? gstRate / 2 : 0,
      sgst_percent: gstType === "cgst_sgst" ? gstRate / 2 : 0,
      igst_percent: gstType === "igst" ? gstRate : 0,
      cgst_amount: cgstAmt,
      sgst_amount: sgstAmt,
      igst_amount: igstAmt,
      grand_total: grandTotal,
      amount_in_words: numberToWords(grandTotal),
      bank_name: bankString,
      notes: gstMode === "inclusive" ? "Amounts shown are inclusive of GST." : null,
    }]).select().single();
    setSaving(false);
    if (error) { toast.error("Failed to save bill: " + error.message); return; }
    toast.success(`Bill #${data.bill_number} saved`);
    navigate({ to: "/admin/bills/$id", params: { id: data.id } });
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Generate Bill</h1>
          <p className="text-muted-foreground text-sm mt-1">GST Tax Invoice · Government-grade format</p>
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

        {/* Particulars (Vehicle Hire) */}
        <div className="flex items-center gap-2 mb-2">
          <Car className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm uppercase tracking-wider">Vehicle / Service Particulars</h3>
        </div>
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 bg-secondary text-xs font-semibold uppercase tracking-wider">
            <div className="col-span-1 p-3 border-r border-border">S.No.</div>
            <div className="col-span-7 p-3 border-r border-border">Particulars</div>
            <div className="col-span-2 p-3 border-r border-border">Rate (₹)</div>
            <div className="col-span-2 p-3">Amount (₹)</div>
          </div>
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-12 border-t border-border items-center">
              <div className="col-span-1 p-2 text-center text-sm">{i + 1}</div>
              <div className="col-span-7 p-2 border-l border-border">
                <input value={it.particulars} onChange={(e) => updateItem(i, { particulars: e.target.value })} className="w-full bg-transparent outline-none px-2 py-1.5 text-sm" placeholder="e.g., Innova Crysta hire — Dehradun to Mussoorie" />
              </div>
              <div className="col-span-2 p-2 border-l border-border">
                <input type="number" value={it.rate || ""} onChange={(e) => updateItem(i, { rate: Math.round(Number(e.target.value)) })} className="w-full bg-transparent outline-none px-2 py-1.5 text-sm" placeholder="0" />
              </div>
              <div className="col-span-2 p-2 border-l border-border flex items-center gap-1">
                <input type="number" value={it.amount || ""} onChange={(e) => updateItem(i, { amount: Math.round(Number(e.target.value)) })} className="w-full bg-transparent outline-none px-2 py-1.5 text-sm" placeholder="0" />
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

        {/* KM + Fuel block */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="border border-border rounded-xl p-4 bg-gradient-to-br from-blue-50/40 to-transparent">
            <Label className="flex items-center gap-1.5"><RouteIcon className="w-3.5 h-3.5 text-blue-600" />Kilometre Travel Amount (₹)</Label>
            <input type="number" value={kmAmount || ""} onChange={(e) => setKmAmount(Math.round(Number(e.target.value)))} className="input" placeholder="e.g., 4500" />
            <p className="text-[10px] text-muted-foreground mt-1.5">Optional — distance / per-km charges. Added on top of vehicle total.</p>
          </div>
          <div className="border border-border rounded-xl p-4 bg-gradient-to-br from-amber-50/40 to-transparent">
            <Label className="flex items-center gap-1.5"><Fuel className="w-3.5 h-3.5 text-amber-600" />Fuel Charges (₹)</Label>
            <input type="number" value={fuelAmount || ""} onChange={(e) => setFuelAmount(Math.round(Number(e.target.value)))} className="input" placeholder="e.g., 2300" />
            <p className="text-[10px] text-muted-foreground mt-1.5">Optional — fuel reimbursement. Added on top of vehicle total.</p>
          </div>
        </div>

        {/* Bank + GST + Totals */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div>
              <Label>Bank Account</Label>
              <select value={bankId} onChange={(e) => setBankId(e.target.value)} className="input">
                {BANK_OPTIONS.map((b) => (
                  <option key={b.id} value={b.id}>{b.label}</option>
                ))}
              </select>
              <div className="mt-2 text-[11px] text-muted-foreground bg-secondary rounded-lg p-2.5 leading-relaxed">
                <div><span className="font-semibold text-foreground">A/C No.:</span> {selectedBank.account}</div>
                <div><span className="font-semibold text-foreground">IFSC:</span> {selectedBank.ifsc}</div>
              </div>
            </div>
            <div>
              <Label>Less Advance (₹)</Label>
              <input type="number" value={advance || ""} onChange={(e) => setAdvance(Math.round(Number(e.target.value)))} className="input" placeholder="0" />
            </div>
            <div>
              <Label>GST Mode</Label>
              <select value={gstMode} onChange={(e) => setGstMode(e.target.value as any)} className="input">
                <option value="none">No GST</option>
                <option value="exclusive">Exclusive of GST (add on top)</option>
                <option value="inclusive">Inclusive of GST (already in price)</option>
              </select>
            </div>
            {gstMode !== "none" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>GST Type</Label>
                  <select value={gstType} onChange={(e) => setGstType(e.target.value as any)} className="input">
                    <option value="cgst_sgst">CGST + SGST (intra-state)</option>
                    <option value="igst">IGST (inter-state)</option>
                  </select>
                </div>
                <div>
                  <Label>GST Rate (%)</Label>
                  <select value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))} className="input">
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-secondary to-secondary/40 rounded-xl p-5 space-y-2 text-sm border border-border">
            <Row label="Vehicle Subtotal" value={gstMode === "inclusive" ? taxableValue : vehicleSubtotal} />
            {gstMode !== "none" && totalGst > 0 && (
              <>
                {gstType === "cgst_sgst" ? (
                  <>
                    <Row label={`CGST @ ${gstRate / 2}%`} value={cgstAmt} small />
                    <Row label={`SGST @ ${gstRate / 2}%`} value={sgstAmt} small />
                  </>
                ) : (
                  <Row label={`IGST @ ${gstRate}%`} value={igstAmt} small />
                )}
                <Row label="Vehicle (incl. GST)" value={vehicleWithGst} bold />
              </>
            )}
            {kmAmount > 0 && <Row label="+ Kilometre Travel" value={Math.round(kmAmount)} />}
            {fuelAmount > 0 && <Row label="+ Fuel Charges" value={Math.round(fuelAmount)} />}
            {advance > 0 && <Row label="− Less Advance" value={Math.round(advance)} negative />}
            <div className="border-t-2 border-foreground pt-2 mt-2">
              <Row label="GRAND TOTAL" value={grandTotal} bold large />
            </div>
            <div className="text-xs italic pt-2 text-muted-foreground border-t border-border mt-2">
              <span className="font-semibold not-italic">In Words: </span>
              {numberToWords(grandTotal)}
            </div>
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
      </div>
    </div>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1 ${className}`}>{children}</label>;
}
function Row({ label, value, bold, negative, small, large }: { label: string; value: number; bold?: boolean; negative?: boolean; small?: boolean; large?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-bold" : ""} ${small ? "text-xs" : ""} ${large ? "text-lg" : ""}`}>
      <span>{label}</span>
      <span className="font-mono">{negative ? "− " : ""}₹ {Math.round(value).toLocaleString("en-IN")}</span>
    </div>
  );
}
