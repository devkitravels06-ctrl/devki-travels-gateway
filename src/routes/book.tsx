import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageBackground } from "@/components/PageBackground";
import bg from "@/assets/hero-mountain.jpg";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a Ride — Devki Travels" },
      { name: "description", content: "Book your travel or vehicle hire across Uttarakhand. Innova, Fortuner, Scorpio, Tempo Traveller and more." },
    ],
  }),
  component: BookPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name required").max(200),
  email: z.string().trim().email("Invalid email").max(200),
  phone: z.string().trim().min(7, "Phone required").max(20),
  vehicle: z.string().min(1, "Choose a vehicle"),
  pickup_location: z.string().trim().min(2).max(300),
  drop_location: z.string().trim().min(2).max(300),
  pickup_date: z.string().min(1, "Date required"),
  pickup_time: z.string().optional(),
  passengers: z.number().min(1).max(50),
  notes: z.string().max(2000).optional(),
});

const vehicles = ["Toyota Innova Crysta", "Toyota Fortuner", "Mahindra Scorpio", "Honda Amaze", "Toyota Etios", "Tempo Traveller", "Other"];

function BookPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      vehicle: fd.get("vehicle") as string,
      pickup_location: fd.get("pickup_location") as string,
      drop_location: fd.get("drop_location") as string,
      pickup_date: fd.get("pickup_date") as string,
      pickup_time: (fd.get("pickup_time") as string) || undefined,
      passengers: Number(fd.get("passengers") || 1),
      notes: (fd.get("notes") as string) || undefined,
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("bookings").insert(parsed.data);
    setLoading(false);
    if (error) {
      toast.error("Could not submit. Please call us.");
      return;
    }
    setSubmitted(true);
    toast.success("Booking received! We'll call you within 30 minutes.");
  }

  return (
    <PageBackground image={bg} overlay="dark">
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10 text-white">
              <span className="text-xs font-semibold tracking-widest uppercase text-primary-glow">Book Now</span>
              <h1 className="text-5xl md:text-6xl font-display font-bold mt-3">Reserve your ride.</h1>
              <p className="mt-4 text-white/85">Confirmation within 30 minutes. Driver allotted within an hour.</p>
            </div>

            {submitted ? (
              <div className="glass-light rounded-3xl p-10 text-center shadow-elegant">
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
                <h2 className="font-display text-3xl font-bold mt-4">Booking Received!</h2>
                <p className="text-muted-foreground mt-2">Our team will call you shortly to confirm your ride.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 px-6 py-2.5 rounded-full bg-gradient-hero text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-smooth">
                  Make another booking
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="glass-light rounded-3xl p-8 md:p-10 shadow-elegant space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Full Name *" name="name" placeholder="Rajesh Kumar" />
                  <Field label="Phone *" name="phone" placeholder="+91 98xxxxxxxx" />
                </div>
                <Field label="Email *" name="email" type="email" placeholder="you@example.com" />
                <div>
                  <label className="text-sm font-medium block mb-1.5">Vehicle *</label>
                  <select name="vehicle" required className="w-full rounded-xl border border-input bg-background px-4 py-3 focus:ring-2 focus:ring-ring outline-none transition">
                    {vehicles.map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Pickup Location *" name="pickup_location" placeholder="Doiwala, Dehradun" />
                  <Field label="Drop Location *" name="drop_location" placeholder="Mussoorie" />
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                  <Field label="Pickup Date *" name="pickup_date" type="date" />
                  <Field label="Pickup Time" name="pickup_time" type="time" />
                  <Field label="Passengers *" name="passengers" type="number" defaultValue="2" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Notes</label>
                  <textarea name="notes" rows={3} placeholder="Special requests, multi-day itinerary, etc." className="w-full rounded-xl border border-input bg-background px-4 py-3 focus:ring-2 focus:ring-ring outline-none transition" />
                </div>
                <button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-gradient-hero text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-smooth disabled:opacity-60">
                  {loading ? "Submitting..." : <>Submit Booking <Send className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageBackground>
  );
}

function Field({ label, name, type = "text", placeholder, defaultValue }: { label: string; name: string; type?: string; placeholder?: string; defaultValue?: string; }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1.5">{label}</label>
      <input name={name} type={type} placeholder={placeholder} defaultValue={defaultValue} required={label.includes("*")} className="w-full rounded-xl border border-input bg-background px-4 py-3 focus:ring-2 focus:ring-ring outline-none transition" />
    </div>
  );
}
