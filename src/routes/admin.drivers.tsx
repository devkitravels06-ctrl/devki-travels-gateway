import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, FileDown, Check, X, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/drivers")({
  component: AdminDrivers,
});

interface Driver {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  experience_years: number;
  license_number: string;
  license_expiry: string | null;
  aadhaar_number: string | null;
  aadhaar_url: string | null;
  license_url: string | null;
  photo_url: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  vehicle_types: string | null;
  address: string | null;
  date_of_birth: string | null;
}

function AdminDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selected, setSelected] = useState<Driver | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("drivers").select("*").order("created_at", { ascending: false });
    setDrivers((data || []) as any);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("drivers").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(`Marked ${status}`);
    load();
    if (selected?.id === id) setSelected({ ...selected, status });
  }

  async function remove(id: string) {
    if (!confirm("Delete this driver application?")) return;
    const { error } = await supabase.from("drivers").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Deleted");
    setSelected(null);
    load();
  }

  async function viewDoc(path: string | null) {
    if (!path) return toast.error("No document uploaded");
    const { data, error } = await supabase.storage.from("driver-docs").createSignedUrl(path, 60 * 5);
    if (error || !data) { toast.error("Could not load document"); return; }
    window.open(data.signedUrl, "_blank");
  }

  const filtered = filter === "all" ? drivers : drivers.filter((d) => d.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Driver Applications</h1>
          <p className="text-muted-foreground text-sm mt-1">{drivers.length} total · {drivers.filter(d => d.status === "pending").length} pending</p>
        </div>
        <div className="flex gap-2 bg-card border border-border rounded-full p-1">
          {(["all", "pending", "approved", "rejected"] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-1.5 rounded-full text-sm capitalize transition ${filter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? <div className="text-muted-foreground">Loading…</div> : (
        <div className="grid lg:grid-cols-2 gap-4">
          {filtered.map((d) => (
            <div key={d.id} className="bg-card border border-border rounded-2xl p-5 hover-lift">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold text-lg shrink-0">
                  {d.full_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-display font-semibold text-lg">{d.full_name}</div>
                      <div className="text-xs text-muted-foreground">{d.experience_years} yrs · {d.vehicle_types || "—"}</div>
                    </div>
                    <StatusBadge status={d.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{d.phone}</div>
                    {d.email && <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{d.email}</div>}
                    {d.city && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{d.city}</div>}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => setSelected(d)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-xs transition"><Eye className="w-3.5 h-3.5" />View</button>
                {d.status !== "approved" && <button onClick={() => setStatus(d.id, "approved")} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white text-xs transition"><Check className="w-3.5 h-3.5" />Approve</button>}
                {d.status !== "rejected" && <button onClick={() => setStatus(d.id, "rejected")} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs transition"><X className="w-3.5 h-3.5" />Reject</button>}
                <button onClick={() => remove(d.id)} className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-muted-foreground hover:text-destructive text-xs transition"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-muted-foreground col-span-2 text-center py-10">No applications.</div>}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-auto p-8 shadow-elegant" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold">{selected.full_name}</h2>
                <StatusBadge status={selected.status} />
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-secondary rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
              <Info label="Phone" value={selected.phone} />
              <Info label="Email" value={selected.email} />
              <Info label="DOB" value={selected.date_of_birth} />
              <Info label="City" value={selected.city} />
              <Info label="Experience" value={`${selected.experience_years} years`} />
              <Info label="Vehicle Types" value={selected.vehicle_types} />
              <Info label="Licence #" value={selected.license_number} />
              <Info label="Licence Expiry" value={selected.license_expiry} />
              <Info label="Aadhaar #" value={selected.aadhaar_number} />
            </div>
            {selected.address && <div className="mt-3 text-sm"><span className="text-xs text-muted-foreground uppercase tracking-wider">Address</span><div>{selected.address}</div></div>}
            {selected.notes && <div className="mt-3 text-sm"><span className="text-xs text-muted-foreground uppercase tracking-wider">Notes</span><div>{selected.notes}</div></div>}
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => viewDoc(selected.aadhaar_url)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-sm transition"><FileDown className="w-4 h-4" />Aadhaar</button>
              <button onClick={() => viewDoc(selected.license_url)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-sm transition"><FileDown className="w-4 h-4" />Licence</button>
              {selected.photo_url && <button onClick={() => viewDoc(selected.photo_url)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-sm transition"><FileDown className="w-4 h-4" />Photo</button>}
            </div>
            <div className="mt-6 flex gap-2 pt-4 border-t border-border">
              <button onClick={() => setStatus(selected.id, "approved")} className="flex-1 px-4 py-2.5 rounded-full bg-green-500 text-white font-medium hover:scale-105 transition">Approve</button>
              <button onClick={() => setStatus(selected.id, "rejected")} className="flex-1 px-4 py-2.5 rounded-full bg-destructive text-destructive-foreground font-medium hover:scale-105 transition">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
    approved: "bg-green-500/15 text-green-700 dark:text-green-400",
    rejected: "bg-destructive/15 text-destructive",
  };
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${map[status] || "bg-secondary"}`}>{status}</span>;
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="font-medium">{value || "—"}</div>
    </div>
  );
}
