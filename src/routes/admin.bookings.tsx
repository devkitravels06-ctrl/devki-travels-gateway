import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Phone, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/bookings")({
  component: BookingsPage,
});

const statuses = ["pending", "confirmed", "completed", "cancelled"] as const;

function BookingsPage() {
  const [items, setItems] = useState<any[]>([]);
  async function load() {
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: string) {
    await supabase.from("bookings").update({ status }).eq("id", id);
    toast.success("Updated");
    load();
  }

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-6">Bookings</h1>
      <div className="space-y-4">
        {items.map((b) => (
          <div key={b.id} className="bg-card border border-border rounded-2xl p-5 hover-lift">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-display font-semibold text-lg">{b.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                    b.status === "pending" ? "bg-gold/20 text-amber-700" :
                    b.status === "confirmed" ? "bg-primary/20 text-primary" :
                    b.status === "completed" ? "bg-green-100 text-green-700" :
                    "bg-destructive/20 text-destructive"
                  }`}>{b.status}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <a href={`tel:${b.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="w-3 h-3" />{b.phone}</a>
                  <a href={`mailto:${b.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="w-3 h-3" />{b.email}</a>
                </div>
                <div className="text-sm mt-2"><strong>{b.vehicle}</strong> · {b.passengers} passenger{b.passengers > 1 ? "s" : ""}</div>
                <div className="flex flex-wrap gap-3 text-sm text-foreground/85">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary" />{b.pickup_location} → {b.drop_location}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-primary" />{new Date(b.pickup_date).toLocaleDateString("en-IN")} {b.pickup_time || ""}</span>
                </div>
                {b.notes && <p className="text-xs text-muted-foreground mt-2 italic">"{b.notes}"</p>}
              </div>
              <select value={b.status} onChange={(e) => setStatus(b.id, e.target.value)} className="text-xs px-3 py-2 rounded-lg border border-border bg-background">
                {statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-center py-16 text-muted-foreground">No bookings yet.</div>}
      </div>
    </div>
  );
}
