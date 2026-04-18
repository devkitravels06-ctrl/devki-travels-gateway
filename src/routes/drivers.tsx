import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Send, Upload, IdCard, FileText, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageBackground } from "@/components/PageBackground";
import bg from "@/assets/hero-mountain.jpg";

export const Route = createFileRoute("/drivers")({
  head: () => ({
    meta: [
      { title: "Drive With Us — Devki Travels Driver Registration" },
      { name: "description", content: "Join the Devki Travels driver family. Register online, upload your Aadhaar and Driving Licence, and start earning across Uttarakhand." },
      { property: "og:title", content: "Drive With Devki Travels" },
      { property: "og:description", content: "Register as a driver in Uttarakhand's most trusted travel company." },
    ],
  }),
  component: DriversPage,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Full name required").max(200),
  phone: z.string().trim().min(7, "Phone required").max(20),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  date_of_birth: z.string().optional(),
  address: z.string().trim().max(500).optional(),
  city: z.string().trim().max(100).optional(),
  experience_years: z.number().min(0).max(60),
  vehicle_types: z.string().trim().max(300).optional(),
  license_number: z.string().trim().min(3, "Licence number required").max(50),
  license_expiry: z.string().optional(),
  aadhaar_number: z.string().trim().max(20).optional(),
  notes: z.string().max(1000).optional(),
});

async function uploadDoc(file: File | null, prefix: string): Promise<string | null> {
  if (!file) return null;
  const ext = file.name.split(".").pop() || "bin";
  const path = `${prefix}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("driver-docs").upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}

function DriversPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aadhaar, setAadhaar] = useState<File | null>(null);
  const [license, setLicense] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      full_name: (fd.get("full_name") as string) || "",
      phone: (fd.get("phone") as string) || "",
      email: (fd.get("email") as string) || "",
      date_of_birth: (fd.get("date_of_birth") as string) || undefined,
      address: (fd.get("address") as string) || undefined,
      city: (fd.get("city") as string) || undefined,
      experience_years: Number(fd.get("experience_years") || 0),
      vehicle_types: (fd.get("vehicle_types") as string) || undefined,
      license_number: (fd.get("license_number") as string) || "",
      license_expiry: (fd.get("license_expiry") as string) || undefined,
      aadhaar_number: (fd.get("aadhaar_number") as string) || undefined,
      notes: (fd.get("notes") as string) || undefined,
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Invalid input"); return; }
    if (!aadhaar) { toast.error("Please upload your Aadhaar card"); return; }
    if (!license) { toast.error("Please upload your Driving Licence"); return; }

    setLoading(true);
    try {
      const [aadhaar_url, license_url, photo_url] = await Promise.all([
        uploadDoc(aadhaar, "aadhaar"),
        uploadDoc(license, "license"),
        uploadDoc(photo, "photo"),
      ]);
      const payload = {
        ...parsed.data,
        email: parsed.data.email || null,
        aadhaar_url, license_url, photo_url,
      };
      const { error } = await supabase.from("drivers").insert(payload as any);
      if (error) throw error;
      setSubmitted(true);
      toast.success("Application received! We'll be in touch soon.");
    } catch (err: any) {
      toast.error(err?.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageBackground image={bg} overlay="dark">
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10 text-white animate-fade-up">
              <span className="text-xs font-semibold tracking-widest uppercase text-primary-glow">Drive With Us</span>
              <h1 className="text-5xl md:text-6xl font-display font-bold mt-3">Join the Devki family.</h1>
              <p className="mt-4 text-white/85 max-w-xl mx-auto">Be part of Uttarakhand's most trusted travel company. Steady earnings, premium vehicles, and a team that respects you.</p>
            </div>

            {/* Perks strip */}
            <div className="grid sm:grid-cols-3 gap-3 mb-8">
              {[
                { icon: User, t: "Stable Income", d: "Govt. & corporate routes" },
                { icon: IdCard, t: "Verified & Insured", d: "Full coverage on every trip" },
                { icon: FileText, t: "Easy Onboarding", d: "Apply online in minutes" },
              ].map((p, i) => (
                <div key={i} className="glass-light rounded-2xl p-4 hover-lift">
                  <p.icon className="w-5 h-5 text-primary mb-2" />
                  <div className="font-semibold text-sm">{p.t}</div>
                  <div className="text-xs text-muted-foreground">{p.d}</div>
                </div>
              ))}
            </div>

            {submitted ? (
              <div className="glass-light rounded-3xl p-10 text-center shadow-elegant">
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
                <h2 className="font-display text-3xl font-bold mt-4">Application Received!</h2>
                <p className="text-muted-foreground mt-2">Our team will verify your documents and call you within 2 business days.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="glass-light rounded-3xl p-8 md:p-10 shadow-elegant space-y-6">
                <SectionTitle icon={User} title="Personal Details" />
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Full Name *" name="full_name" placeholder="Rajesh Singh Negi" />
                  <Field label="Phone *" name="phone" placeholder="+91 98xxxxxxxx" />
                  <Field label="Email" name="email" type="email" placeholder="optional" />
                  <Field label="Date of Birth" name="date_of_birth" type="date" />
                  <Field label="City" name="city" placeholder="Dehradun" />
                  <Field label="Years of Driving Experience *" name="experience_years" type="number" defaultValue="2" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Full Address</label>
                  <textarea name="address" rows={2} className="w-full rounded-xl border border-input bg-background px-4 py-3 focus:ring-2 focus:ring-ring outline-none" />
                </div>

                <SectionTitle icon={IdCard} title="Licence & Vehicles" />
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Driving Licence Number *" name="license_number" placeholder="UK0720200012345" />
                  <Field label="Licence Expiry" name="license_expiry" type="date" />
                  <Field label="Aadhaar Number" name="aadhaar_number" placeholder="XXXX XXXX XXXX" />
                  <Field label="Vehicle Types You Can Drive" name="vehicle_types" placeholder="Sedan, SUV, Tempo Traveller" />
                </div>

                <SectionTitle icon={Upload} title="Upload Documents" />
                <div className="grid md:grid-cols-3 gap-4">
                  <FileBox label="Aadhaar Card *" file={aadhaar} onFile={setAadhaar} accept="image/*,.pdf" />
                  <FileBox label="Driving Licence *" file={license} onFile={setLicense} accept="image/*,.pdf" />
                  <FileBox label="Your Photo" file={photo} onFile={setPhoto} accept="image/*" />
                </div>
                <p className="text-xs text-muted-foreground">Max 5MB per file. Documents are stored privately and visible only to our verification team.</p>

                <div>
                  <label className="text-sm font-medium block mb-1.5">Anything else we should know?</label>
                  <textarea name="notes" rows={3} className="w-full rounded-xl border border-input bg-background px-4 py-3 focus:ring-2 focus:ring-ring outline-none" />
                </div>

                <button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-gradient-hero text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-smooth disabled:opacity-60">
                  {loading ? "Submitting…" : <>Submit Application <Send className="w-4 h-4" /></>}
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

function SectionTitle({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-2 pt-2 border-t border-border first:border-0 first:pt-0">
      <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="font-display font-semibold">{title}</h3>
    </div>
  );
}

function FileBox({ label, file, onFile, accept }: { label: string; file: File | null; onFile: (f: File | null) => void; accept?: string }) {
  return (
    <label className="block cursor-pointer group">
      <div className="text-sm font-medium mb-1.5">{label}</div>
      <div className={`rounded-xl border-2 border-dashed p-5 text-center transition ${file ? "border-primary bg-primary/5" : "border-input bg-background hover:border-primary hover:bg-primary/5"}`}>
        <Upload className="w-5 h-5 mx-auto text-primary" />
        <div className="text-xs mt-2 truncate">{file ? file.name : "Click to upload"}</div>
        <input type="file" accept={accept} className="hidden" onChange={(e) => {
          const f = e.target.files?.[0] || null;
          if (f && f.size > 5 * 1024 * 1024) { toast.error("File too large (max 5MB)"); return; }
          onFile(f);
        }} />
      </div>
    </label>
  );
}
