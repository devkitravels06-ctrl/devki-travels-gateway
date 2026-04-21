import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/content")({
  component: ContentPage,
});

function ContentPage() {
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [about, setAbout] = useState("");
  const [founders, setFounders] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data: c } = await supabase.from("site_content").select("*").in("key", ["mission","vision","about"]);
    c?.forEach((x: any) => { if (x.key === "mission") setMission(x.value.text); if (x.key === "vision") setVision(x.value.text); if (x.key === "about") setAbout(x.value.text); });
    const { data: f } = await supabase.from("founders").select("*").order("display_order");
    setFounders(f ?? []);
  }
  useEffect(() => { load(); }, []);

  async function saveContent() {
    setSaving(true);
    await supabase.from("site_content").upsert([
      { key: "mission", value: { text: mission }, updated_at: new Date().toISOString() },
      { key: "vision", value: { text: vision }, updated_at: new Date().toISOString() },
      { key: "about", value: { text: about }, updated_at: new Date().toISOString() },
    ]);
    setSaving(false);
    toast.success("Site content saved");
  }

  async function saveFounder(f: any) {
    await supabase.from("founders").update({ name: f.name, role: f.role, bio: f.bio }).eq("id", f.id);
    toast.success("Founder saved");
  }

  async function uploadPhoto(id: string, file: File) {
    const path = `${id}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("founders").upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed"); return; }
    const { data: pub } = supabase.storage.from("founders").getPublicUrl(path);
    await supabase.from("founders").update({ photo_url: pub.publicUrl }).eq("id", id);
    toast.success("Photo updated");
    load();
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Site Content</h1>
        <p className="text-sm text-muted-foreground mt-1">Edit your About, Mission, Vision text and founder profiles.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-soft">
        <h2 className="font-display text-xl font-semibold">About / Mission / Vision</h2>
        <Field label="About text" value={about} onChange={setAbout} rows={3} />
        <Field label="Our Mission" value={mission} onChange={setMission} rows={3} />
        <Field label="Our Vision" value={vision} onChange={setVision} rows={3} />
        <button onClick={saveContent} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-hero text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-smooth">
          <Save className="w-4 h-4" />{saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mt-6 space-y-6">
        <h2 className="font-display text-xl font-semibold">Founders</h2>
        {founders.map((f) => (
          <FounderEditor key={f.id} f={f} onSave={saveFounder} onUpload={uploadPhoto} setF={(nf: any) => setFounders((arr) => arr.map((x) => x.id === f.id ? nf : x))} />
        ))}
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

function FounderEditor({ f, setF, onSave, onUpload }: any) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="border border-border rounded-xl p-4 grid md:grid-cols-[120px_1fr] gap-4">
      <div>
        <div className="aspect-square rounded-xl overflow-hidden bg-secondary">
          {f.photo_url && <img src={f.photo_url} alt={f.name} className="w-full h-full object-cover" />}
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onUpload(f.id, e.target.files[0])} />
        <button onClick={() => fileRef.current?.click()} className="mt-2 w-full inline-flex items-center justify-center gap-1 text-xs px-3 py-2 rounded-lg border border-border hover:bg-secondary">
          <Upload className="w-3 h-3" />Change Photo
        </button>
      </div>
      <div className="space-y-3">
        <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Name" />
        <input value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Role" />
        <textarea value={f.bio || ""} onChange={(e) => setF({ ...f, bio: e.target.value })} rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Bio" />
        <button onClick={() => onSave(f)} className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:shadow-soft transition">
          <Save className="w-3 h-3" />Save
        </button>
      </div>
    </div>
  );
}
