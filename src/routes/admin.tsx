import { createFileRoute, Link, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, MessageSquare, Calendar, Settings, LogOut, FileSignature, IdCard, Sparkles, Bell, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import logo from "@/assets/devki-logo.png";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/bills/new", label: "Generate Bill", icon: FileSignature },
  { to: "/admin/bills", label: "All Bills", icon: FileText },
  { to: "/admin/offers", label: "Service Offers", icon: Tag },
  { to: "/admin/queries", label: "Contact Queries", icon: MessageSquare },
  { to: "/admin/bookings", label: "Bookings", icon: Calendar },
  { to: "/admin/drivers", label: "Driver Applications", icon: IdCard },
  { to: "/admin/content", label: "Site Content", icon: Settings },
];

function AdminLayout() {
  const navigate = useNavigate();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const path = router.state.location.pathname;
    if (path === "/admin/login") { setChecking(false); return; }
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate({ to: "/admin/login" }); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      const isAdmin = roles?.some((r: any) => r.role === "admin");
      if (!isAdmin) { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); return; }
      setEmail(session.user.email ?? "");
      setAuthed(true);
      setChecking(false);
    })();
  }, [router.state.location.pathname, navigate]);

  if (router.state.location.pathname === "/admin/login") return <Outlet />;
  if (checking) return <div className="min-h-screen flex items-center justify-center bg-gradient-sky"><div className="animate-pulse text-muted-foreground">Verifying access…</div></div>;
  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.02_230)] flex admin-shell">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 bg-gradient-to-b from-[oklch(0.18_0.06_255)] via-[oklch(0.22_0.08_250)] to-[oklch(0.16_0.05_255)] text-white flex-col relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-56 h-56 rounded-full bg-[oklch(0.72_0.16_235)]/30 blur-3xl pointer-events-none" />

        <Link to="/" className="relative px-6 py-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-glow flex items-center justify-center">
            <img src={logo} alt="Devki Travels" className="w-full h-full object-contain" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-lg">Devki Travels</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Admin Console
            </div>
          </div>
        </Link>

        <nav className="relative flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pt-2 pb-3 text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">Main Menu</div>
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              activeOptions={{ exact: it.exact }}
              className="group flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm text-white/75 hover:bg-white/10 hover:text-white transition-all duration-300"
              activeProps={{ className: "!bg-gradient-to-r !from-primary !to-[oklch(0.72_0.16_235)] !text-white shadow-glow" }}
            >
              <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/15 flex items-center justify-center transition">
                <it.icon className="w-4 h-4" />
              </span>
              <span className="font-medium">{it.label}</span>
            </Link>
          ))}
        </nav>

        <div className="relative m-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-hero flex items-center justify-center text-sm font-bold uppercase">
              {email.charAt(0) || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold truncate">{email || "Administrator"}</div>
              <div className="text-[10px] text-white/50 uppercase tracking-widest">Super Admin</div>
            </div>
          </div>
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs bg-destructive/20 hover:bg-destructive text-white transition-all duration-300 font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="hidden md:flex sticky top-0 z-30 items-center justify-between px-8 lg:px-10 py-4 bg-white/80 backdrop-blur-xl border-b border-border shadow-sm">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Devki Travels</div>
            <div className="text-sm text-foreground/70">Manage your business in real-time</div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition flex items-center justify-center">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <Link to="/" className="text-xs px-4 py-2.5 rounded-xl border border-border hover:bg-secondary transition font-medium">View Site →</Link>
          </div>
        </header>

        {/* Mobile bar */}
        <header className="md:hidden bg-gradient-to-r from-[oklch(0.18_0.06_255)] to-[oklch(0.22_0.08_250)] text-white p-4 flex items-center justify-between shadow-soft">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center font-display font-bold">D</div>
            <span className="font-display font-bold">Devki Admin</span>
          </div>
          <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }} className="p-2 rounded-lg bg-white/10"><LogOut className="w-5 h-5" /></button>
        </header>
        <nav className="md:hidden bg-foreground text-background overflow-x-auto flex border-t border-background/10 sticky top-0 z-20">
          {items.map((it) => (
            <Link key={it.to} to={it.to} activeOptions={{ exact: it.exact }} className="px-4 py-3 text-xs whitespace-nowrap text-background/80" activeProps={{ className: "text-white border-b-2 border-primary" }}>
              {it.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          <div className="animate-fade-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export { cn };
