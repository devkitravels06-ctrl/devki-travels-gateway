import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Save, Upload, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/content")({
  component: ContentPage,
});

type Founder = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  display_order: number;
};

function ContentPage() {
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [about, setAbout] = useState("");
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loadingFounders, setLoadingFounders] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data: c } = await supabase.from("site_content").select("*").in("key", ["mission","vision","about"]);
    c?.forEach((x: any) => {
      if (x.key === "mission") setMission(x.value?.text ?? "");
      if (x.key === "vision") setVision(x.value?.text ?? "");
      if (x.key === "about") setAbout(x.value?.text ?? "");
    });
    setLoadingFounders(true);
    const { data: f, error } = await supabase.from("founders").select("*").order("display_order");
    if (error) toast.error("Could not load founders: " + error.message);
    setFounders((f as any) ?? []);
    setLoadingFounders(false);
  }
  useEffect(() => { load(); }, []);

  async function saveContent() {
    setSaving(true);
    const { error } = await supabase.from("site_content").upsert([
      { key: "mission", value: { text: mission }, updated_at: new Date().toISOString() },
      { key: "vision", value: { text: vision }, updated_at: new Date().toISOString() },
      { key: "about", value: { text: about }, updated_at: new Date().toISOString() },
    ]);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Site content saved");
  }

  async function saveFounder(f: Founder) {
    const { error } = await supabase.from("founders").update({
      name: f.name,
      role: f.role,
      bio: f.bio,
      display_order: f.display_order,
    }).eq("id", f.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Founder saved");
  }

  async function addFounder() {
    const { data, error } = await supabase.from("founders").insert({
      name: "New Founder",
      role: "Role / Title",
      bio: "",
      display_order: founders.length + 1,
    } as any).select().single();
    if (error) { toast.error(error.message); return; }
    setFounders((arr) => [...arr, data as any]);
    toast.success("Founder added");
  }

  async function deleteFounder(id: string) {
    if (!confirm("Delete this founder?")) return;
    const { error } = await supabase.from("founders").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setFounders((arr) => arr.filter((x) => x.id !== id));
    toast.success("Deleted");
  }

  async function uploadPhoto(id: string, file: File) {
    const path = `${id}-${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const { error } = await supabase.storage.from("founders").upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed: " + error.message); return; }
    const { data: pub } = supabase.storage.from("founders").getPublicUrl(path);
    const { error: updErr } = await supabase.from("founders").update({ photo_url: pub.publicUrl }).eq("id", id);
    if (updErr) { toast.error(updErr.message); return; }
    setFounders((arr) => arr.map((x) => x.id === id ? { ...x, photo_url: pub.publicUrl } : x));
    toast.success("Photo updated");
  }

  function updateFounder(id: string, patch: Partial<Founder>) {
    setFounders((arr) => arr.map((x) => x.id === id ? { ...x, ...patch } : x));
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="rounded-3xl bg-gradient-to-r from-[oklch(0.22_0.08_250)] to-primary text-white p-6 lg:p-8 shadow-elegant">
        <h1 className="text-2xl lg:text-3xl font-display font-bold">Site Content</h1>
        <p className="text-sm text-white/80 mt-1.5">Edit About / Mission / Vision text and manage founder profiles shown on the About page.</p>
        <div className="flex flex-wrap gap-2 mt-4 text-[11px]">
          <a href="#mission-block" className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 transition">↓ About / Mission / Vision</a>
          <a href="#founders-block" className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 transition">↓ Founders & Co-Founders</a>
        </div>
      </div>

      <div id="mission-block" className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-soft scroll-mt-24">
        <div className="flex items-center gap-3 pb-2 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">📝</div>
          <div>
            <h2 className="font-display text-xl font-semibold">About / Mission / Vision</h2>
            <p className="text-xs text-muted-foreground">Shown on the public About page</p>
          </div>
        </div>
        <Field label="About text" value={about} onChange={setAbout} rows={3} />
        <Field label="Our Mission" value={mission} onChange={setMission} rows={3} />
        <Field label="Our Vision" value={vision} onChange={setVision} rows={3} />
        <button onClick={saveContent} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-hero text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-smooth">
          <Save className="w-4 h-4" />{saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div id="founders-block" className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-soft scroll-mt-24">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">Founders & Co-Founders</h2>
              <p className="text-xs text-muted-foreground">Edit names, roles, bios and photos. Changes appear instantly on the About page.</p>
            </div>
          </div>
          <button onClick={addFounder} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-hero text-primary-foreground font-semibold text-sm shadow-soft hover:shadow-glow transition">
            <Plus className="w-4 h-4" /> Add Founder
          </button>
        </div>

        {loadingFounders ? (
          <div className="text-center py-10 text-muted-foreground">Loading founders…</div>
        ) : founders.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border rounded-xl">
            <Users className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <div className="text-sm text-muted-foreground">No founders yet — click "Add Founder" to create one.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {founders.map((f) => (
              <FounderEditor
                key={f.id}
                f={f}
                onChange={(patch) => updateFounder(f.id, patch)}
                onSave={() => saveFounder(f)}
                onDelete={() => deleteFounder(f.id)}
                onUpload={(file) => uploadPhoto(f.id, file)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, rows = 1 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-ring outline-none" />
    </div>
  );
}

function FounderEditor({ f, onChange, onSave, onDelete, onUpload }: {
  f: Founder;
  onChange: (patch: Partial<Founder>) => void;
  onSave: () => void;
  onDelete: () => void;
  onUpload: (file: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="border border-border rounded-xl p-4 grid md:grid-cols-[140px_1fr] gap-4 bg-background/50 hover:shadow-soft transition">
      <div>
        <div className="aspect-square rounded-xl overflow-hidden bg-secondary border border-border">
          {f.photo_url ? (
            <img src={f.photo_url} alt={f.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest text-muted-foreground">No photo</div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
        <button onClick={() => fileRef.current?.click()} className="mt-2 w-full inline-flex items-center justify-center gap-1 text-xs px-3 py-2 rounded-lg border border-border hover:bg-secondary font-medium">
          <Upload className="w-3 h-3" />Change Photo
        </button>
      </div>
      <div className="space-y-3">
        <div className="grid sm:grid-cols-[1fr_120px] gap-3">
          <input value={f.name} onChange={(e) => onChange({ name: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold" placeholder="Name" />
          <input type="number" value={f.display_order} onChange={(e) => onChange({ display_order: Number(e.target.value) })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Order" />
        </div>
        <input value={f.role} onChange={(e) => onChange({ role: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Role" />
        <textarea value={f.bio || ""} onChange={(e) => onChange({ bio: e.target.value })} rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Bio" />
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <button onClick={onSave} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition">
            <Save className="w-3.5 h-3.5" />Save
          </button>
          <button onClick={onDelete} className="ml-auto inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-semibold hover:bg-destructive/20 transition">
            <Trash2 className="w-3.5 h-3.5" />Delete
          </button>
        </div>
      </div>
    </div>
  );
}
