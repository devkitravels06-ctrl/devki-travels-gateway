import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — Devki Travels" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-foreground">
      {/* hackademic-style animated grid background */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: "linear-gradient(oklch(0.55 0.18 245 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(0.55 0.18 245 / 0.5) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
      }} />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-primary-glow/30" />
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-primary-glow/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-hero items-center justify-center text-primary-foreground shadow-glow mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">Admin Access</h1>
          <p className="text-white/60 text-sm mt-2 tracking-wide uppercase">Devki Travels · Secure Portal</p>
        </div>
        <form onSubmit={onSubmit} className="glass rounded-2xl p-8 shadow-elegant space-y-5">
          <div>
            <label className="text-xs font-medium text-white/80 uppercase tracking-wider block mb-2">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input name="email" type="email" required defaultValue="info@devkitravels.in" className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary-glow outline-none transition" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-white/80 uppercase tracking-wider block mb-2">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input name="password" type="password" required className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary-glow outline-none transition" />
            </div>
          </div>
          <button disabled={loading} className="w-full py-3.5 rounded-xl bg-gradient-hero text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-smooth disabled:opacity-60">
            {loading ? "Authenticating…" : "Sign In Securely"}
          </button>
          <p className="text-xs text-center text-white/40">Authorized personnel only.</p>
        </form>
      </div>
    </div>
  );
}
