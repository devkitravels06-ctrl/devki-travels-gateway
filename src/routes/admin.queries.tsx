import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Phone, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/queries")({
  component: QueriesPage,
});

function QueriesPage() {
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    const { data } = await supabase.from("contact_queries").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function markRead(id: string) { await supabase.from("contact_queries").update({ is_read: true }).eq("id", id); load(); }
  async function remove(id: string) { if (!confirm("Delete this query?")) return; await supabase.from("contact_queries").delete().eq("id", id); toast.success("Deleted"); load(); }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Contact Queries</h1>
        <p className="text-sm text-muted-foreground mt-1">Messages submitted from the website contact form.</p>
      </div>
      <div className="space-y-4">
        {items.map((q) => (
          <div key={q.id} className={`bg-card border rounded-2xl p-5 ${q.is_read ? "border-border" : "border-primary shadow-soft"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-semibold text-lg">{q.name}</h3>
                  {!q.is_read && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground uppercase tracking-wider">New</span>}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                  <a href={`mailto:${q.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="w-3 h-3" />{q.email}</a>
                  {q.phone && <a href={`tel:${q.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="w-3 h-3" />{q.phone}</a>}
                  <span>{new Date(q.created_at).toLocaleString("en-IN")}</span>
                </div>
                {q.subject && <div className="text-sm font-medium mt-2">{q.subject}</div>}
                <p className="text-sm text-foreground/85 mt-2 leading-relaxed whitespace-pre-line">{q.message}</p>
              </div>
              <div className="flex gap-2">
                {!q.is_read && <button onClick={() => markRead(q.id)} className="p-2 rounded-lg hover:bg-primary/10 text-primary" title="Mark read"><CheckCircle2 className="w-4 h-4" /></button>}
                <button onClick={() => remove(q.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-center py-16 text-muted-foreground">No queries yet.</div>}
      </div>
    </div>
  );
}
