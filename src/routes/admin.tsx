import { createFileRoute, Link, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, MessageSquare, Calendar, Settings, LogOut, FileSignature, IdCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/bills/new", label: "Generate Bill", icon: FileSignature },
  { to: "/admin/bills", label: "All Bills", icon: FileText },
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

  useEffect(() => {
    const path = router.state.location.pathname;
    if (path === "/admin/login") { setChecking(false); return; }
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate({ to: "/admin/login" }); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      const isAdmin = roles?.some((r: any) => r.role === "admin");
      if (!isAdmin) { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); return; }
      setAuthed(true);
      setChecking(false);
    })();
  }, [router.state.location.pathname, navigate]);

  if (router.state.location.pathname === "/admin/login") return <Outlet />;
  if (checking) return <div className="min-h-screen flex items-center justify-center bg-gradient-sky"><div className="animate-pulse text-muted-foreground">Verifying access…</div></div>;
  if (!authed) return null;

  return (
    <div className="min-h-screen bg-gradient-sky flex">
      <aside className="hidden md:flex w-64 bg-foreground text-background flex-col">
        <Link to="/" className="px-6 py-5 border-b border-background/10 flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center font-display font-bold text-primary-foreground">D</div>
          <div>
            <div className="font-display font-bold">Devki Travels</div>
            <div className="text-[10px] uppercase tracking-widest text-background/60">Admin Panel</div>
          </div>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              activeOptions={{ exact: it.exact }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-background/80 hover:bg-primary/20 hover:text-white transition-smooth"
              activeProps={{ className: "bg-primary text-white" }}
            >
              <it.icon className="w-4 h-4" />{it.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }}
          className="m-3 flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-background/80 hover:bg-destructive/20 hover:text-white transition-smooth"
        >
          <LogOut className="w-4 h-4" />Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-foreground text-background p-4 flex items-center justify-between">
          <span className="font-display font-bold">Devki Admin</span>
          <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }}><LogOut className="w-5 h-5" /></button>
        </header>
        <nav className="md:hidden bg-foreground text-background overflow-x-auto flex border-t border-background/10">
          {items.map((it) => (
            <Link key={it.to} to={it.to} activeOptions={{ exact: it.exact }} className="px-4 py-3 text-xs whitespace-nowrap text-background/80" activeProps={{ className: "text-white border-b-2 border-primary" }}>
              {it.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { cn };
