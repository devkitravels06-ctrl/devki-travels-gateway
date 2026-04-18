import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";
import { PageBackground } from "@/components/PageBackground";
import bg from "@/assets/bg-dehradun.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Devki Travels" },
      { name: "description", content: "Reach Devki Travels for bookings, government tenders, and corporate enquiries. Doiwala, Dehradun, Uttarakhand." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(5).max(4000),
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: (fd.get("phone") as string) || undefined,
      subject: (fd.get("subject") as string) || undefined,
      message: fd.get("message") as string,
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_queries").insert(parsed.data);
    setLoading(false);
    if (error) { toast.error("Failed to send."); return; }
    setSent(true);
    toast.success("Message sent! We'll respond shortly.");
  }

  return (
    <PageBackground image={bg} overlay="medium">
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">Contact</span>
            <h1 className="text-5xl md:text-6xl font-display font-bold mt-3">Get in touch.</h1>
            <p className="mt-4 text-muted-foreground">For bookings, tenders, partnerships or anything else — we'd love to hear from you.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-5">
              {[
                { icon: MapPin, title: "Office", value: SITE.address },
                { icon: Phone, title: "Call us", value: `${SITE.phone1}\n${SITE.phone2}` },
                { icon: Mail, title: "Email", value: SITE.email },
              ].map((c, i) => (
                <div key={i} className="bg-gradient-card border border-border rounded-2xl p-6 hover-lift">
                  <div className="w-11 h-11 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground mb-3">
                    <c.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{c.value}</p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2">
              {sent ? (
                <div className="bg-gradient-card border border-border rounded-3xl p-12 text-center shadow-soft">
                  <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
                  <h2 className="font-display text-3xl font-bold mt-4">Message Sent!</h2>
                  <p className="text-muted-foreground mt-2">We'll be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="bg-gradient-card border border-border rounded-3xl p-8 md:p-10 space-y-5 shadow-soft">
                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="Name *" name="name" />
                    <Field label="Email *" name="email" type="email" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="Phone" name="phone" />
                    <Field label="Subject" name="subject" />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Message *</label>
                    <textarea name="message" rows={5} required className="w-full rounded-xl border border-input bg-background px-4 py-3 focus:ring-2 focus:ring-ring outline-none" />
                  </div>
                  <button disabled={loading} className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-hero text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-smooth disabled:opacity-60">
                    {loading ? "Sending..." : <>Send Message <Send className="w-4 h-4" /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageBackground>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1.5">{label}</label>
      <input name={name} type={type} required={label.includes("*")} className="w-full rounded-xl border border-input bg-background px-4 py-3 focus:ring-2 focus:ring-ring outline-none" />
    </div>
  );
}
