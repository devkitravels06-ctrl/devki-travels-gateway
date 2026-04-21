import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, Shield, ArrowLeft, CheckCircle2, Phone, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/devki-logo.png";
import bgImg from "@/assets/hero-mountain.jpg";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — Devki Travels" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) { setLoading(false); toast.error("Invalid credentials"); return; }
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.session.user.id);
    const isAdmin = roles?.some((r: any) => r.role === "admin");
    if (!isAdmin) { await supabase.auth.signOut(); setLoading(false); toast.error("Not authorized as admin"); return; }
    toast.success("Welcome back, Admin");
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#061a36]">
      {/* LEFT — Brand / Info panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={bgImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#061a36]/95 via-[#0b2545]/85 to-[#061a36]/95" />
        </div>
        {/* decorative glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{
          backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        {/* Top: logo + back link */}
        <div className="relative flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-white rounded-2xl p-2 shadow-glow group-hover:scale-105 transition">
              <img src={logo} alt="Devki Travels" className="w-14 h-14 object-contain" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-extrabold text-xl text-white tracking-wide">DEVKI TRAVELS</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-amber-300 font-semibold">Travel Comfortably</div>
            </div>
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-amber-300 transition">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to site
          </Link>
        </div>

        {/* Middle: pitch */}
        <div className="relative max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] uppercase tracking-[0.25em] font-bold mb-6">
            <Sparkles className="w-3 h-3" /> Secure Admin Console
          </div>
          <h2 className="text-4xl xl:text-5xl font-display font-extrabold text-white leading-tight">
            Manage your <span className="text-amber-400">fleet</span>, bills & bookings — all in one place.
          </h2>
          <p className="text-white/70 mt-5 leading-relaxed">
            The Devki Travels admin console gives authorised staff full control over invoices, driver applications, customer queries and live offers.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-white/85">
            {[
              "GST-compliant tax invoices in one click",
              "Driver verification & document storage",
              "Live booking and contact-query management",
              "Manage homepage offers & site content",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: contact band */}
        <div className="relative text-xs text-white/60 flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-amber-300" /> +91 7895049876</div>
          <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-amber-300" /> info@devkitravle.com</div>
          <div className="ml-auto">© {new Date().getFullYear()} Devki Travels</div>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="relative flex items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-white via-slate-50 to-white">
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, oklch(0.85 0.05 230) 0px, transparent 40%), radial-gradient(circle at 75% 75%, oklch(0.9 0.08 60 / 0.4) 0px, transparent 40%)",
        }} />

        <div className="relative w-full max-w-md">
          {/* Mobile-only logo */}
          <div className="lg:hidden flex flex-col items-center mb-6">
            <div className="bg-white rounded-2xl p-2 shadow-soft border border-border">
              <img src={logo} alt="Devki Travels" className="w-16 h-16 object-contain" />
            </div>
            <div className="font-display font-extrabold text-lg text-[#0b2545] mt-3 tracking-wide">DEVKI TRAVELS</div>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0b2545] to-[#1d3b6d] items-center justify-center text-amber-300 shadow-elegant mb-4">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-display font-extrabold text-[#0b2545]">Admin Sign In</h1>
            <p className="text-muted-foreground text-sm mt-2">Enter your credentials to access the console.</p>
          </div>

          <form onSubmit={onSubmit} className="bg-white rounded-2xl p-7 sm:p-8 shadow-elegant border border-border space-y-5">
            <div>
              <label className="text-[11px] font-bold text-[#0b2545] uppercase tracking-[0.15em] block mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition" />
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue="info@devkitravels.in"
                  placeholder="you@devkitravels.in"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-border text-foreground placeholder:text-muted-foreground/60 focus:bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold text-[#0b2545] uppercase tracking-[0.15em]">Password</label>
                <button type="button" onClick={() => setShow((s) => !s)} className="text-[11px] text-primary font-semibold hover:underline">
                  {show ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative group">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition" />
                <input
                  name="password"
                  type={show ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-border text-foreground placeholder:text-muted-foreground/60 focus:bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0b2545] to-[#1d3b6d] text-white font-semibold shadow-soft hover:shadow-glow transition-all hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Authenticating…
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" /> Sign In Securely
                </>
              )}
            </button>

            <div className="flex items-center gap-2 pt-2 text-[11px] text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>End-to-end encrypted · Authorised personnel only</span>
            </div>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Trouble signing in? Contact <a href="mailto:info@devkitravle.com" className="text-primary font-semibold hover:underline">info@devkitravle.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
