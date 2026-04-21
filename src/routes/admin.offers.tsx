import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Plus, Save, Trash2, Upload, MessageCircle, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/offers")({
  component: OffersAdminPage,
});

type Offer = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  discount_label: string | null;
  price_label: string | null;
  whatsapp_message: string;
  whatsapp_number: string;
  display_order: number;
  is_active: boolean;
};

function OffersAdminPage() {
  const [items, setItems] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("service_offers").select("*").order("display_order");
    setItems((data as any) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    const { data, error } = await supabase.from("service_offers").insert({
      title: "New Offer",
      subtitle: "One Way Pick/Drop",
      discount_label: "10% OFF",
      price_label: "From ₹999/-",
      whatsapp_message: "Hi, I want to Book a CAB",
      whatsapp_number: "917895049876",
      display_order: items.length + 1,
      is_active: true,
    } as any).select().single();
    if (error) { toast.error(error.message); return; }
    setItems((arr) => [...arr, data as any]);
    toast.success("Offer added");
  }

  async function save(o: Offer) {
    const { error } = await supabase.from("service_offers").update({
      title: o.title,
      subtitle: o.subtitle,
      discount_label: o.discount_label,
      price_label: o.price_label,
      whatsapp_message: o.whatsapp_message,
      whatsapp_number: o.whatsapp_number,
      display_order: o.display_order,
      is_active: o.is_active,
    }).eq("id", o.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
  }

  async function remove(id: string) {
    if (!confirm("Delete this offer?")) return;
    await supabase.from("service_offers").delete().eq("id", id);
    setItems((arr) => arr.filter((x) => x.id !== id));
    toast.success("Deleted");
  }

  async function uploadImage(o: Offer, file: File) {
    const path = `${o.id}-${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const { error } = await supabase.storage.from("service-offers").upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed: " + error.message); return; }
    const { data: pub } = supabase.storage.from("service-offers").getPublicUrl(path);
    await supabase.from("service_offers").update({ image_url: pub.publicUrl }).eq("id", o.id);
    setItems((arr) => arr.map((x) => x.id === o.id ? { ...x, image_url: pub.publicUrl } : x));
    toast.success("Image updated");
  }

  function update(id: string, patch: Partial<Offer>) {
    setItems((arr) => arr.map((x) => x.id === id ? { ...x, ...patch } : x));
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Service Offers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage offer cards shown on the Services page. Contact button opens WhatsApp.</p>
        </div>
        <button onClick={add} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-hero text-primary-foreground font-semibold shadow-soft hover:shadow-glow transition">
          <Plus className="w-4 h-4" /> Add Offer
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <div className="text-muted-foreground">No offers yet — click "Add Offer" to create one.</div>
        </div>
      ) : (
        <div className="grid gap-5">
          {items.map((o) => (
            <OfferEditor key={o.id} o={o} onChange={(p) => update(o.id, p)} onSave={() => save(o)} onDelete={() => remove(o.id)} onUpload={(f) => uploadImage(o, f)} />
          ))}
        </div>
      )}
    </div>
  );
}

function OfferEditor({ o, onChange, onSave, onDelete, onUpload }: {
  o: Offer; onChange: (p: Partial<Offer>) => void; onSave: () => void; onDelete: () => void; onUpload: (f: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const num = o.whatsapp_number.replace(/\D/g, "");
  const msg = encodeURIComponent(o.whatsapp_message || "Hi, I want to Book a CAB");
  return (
    <div className="bg-card border border-border rounded-2xl p-5 grid md:grid-cols-[200px_1fr] gap-5 shadow-soft">
      <div>
        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-secondary border border-border relative group">
          {o.image_url ? (
            <img src={o.image_url} alt={o.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
          )}
          {o.discount_label && (
            <div className="absolute top-2 left-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 shadow">{o.discount_label}</div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
        <button onClick={() => fileRef.current?.click()} className="mt-2 w-full inline-flex items-center justify-center gap-1 text-xs px-3 py-2 rounded-lg border border-border hover:bg-secondary font-medium">
          <Upload className="w-3 h-3" /> Change Image
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Title" value={o.title} onChange={(v) => onChange({ title: v })} />
        <Field label="Subtitle" value={o.subtitle ?? ""} onChange={(v) => onChange({ subtitle: v })} />
        <Field label="Discount Label" value={o.discount_label ?? ""} onChange={(v) => onChange({ discount_label: v })} placeholder="e.g. 18% OFF" />
        <Field label="Price Label" value={o.price_label ?? ""} onChange={(v) => onChange({ price_label: v })} placeholder="e.g. From ₹5,299/-" />
        <Field label="WhatsApp Number (with country code)" value={o.whatsapp_number} onChange={(v) => onChange({ whatsapp_number: v })} placeholder="917895049876" />
        <Field label="WhatsApp Message" value={o.whatsapp_message} onChange={(v) => onChange({ whatsapp_message: v })} />
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order</label>
          <input type="number" value={o.display_order} onChange={(e) => onChange({ display_order: Number(e.target.value) })} className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <label className="ml-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={o.is_active} onChange={(e) => onChange({ is_active: e.target.checked })} className="w-4 h-4" />
            Active
          </label>
        </div>
        <div className="sm:col-span-2 flex flex-wrap gap-2 pt-2 border-t border-border">
          <a href={`https://wa.me/${num}?text=${msg}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition">
            <MessageCircle className="w-4 h-4" /> Test WhatsApp
          </a>
          <button onClick={onSave} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition">
            <Save className="w-4 h-4" /> Save
          </button>
          <button onClick={onDelete} className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-semibold hover:bg-destructive/20 transition">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring outline-none" />
    </div>
  );
}
