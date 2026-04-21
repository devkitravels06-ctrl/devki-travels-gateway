import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import logo from "@/assets/devki-logo.png";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const isHome = loc.pathname === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [loc.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-smooth print:hidden",
        transparent
          ? "bg-gradient-to-b from-black/40 to-transparent"
          : "bg-white/95 backdrop-blur-xl shadow-soft border-b border-border"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          <Link to="/" className="flex items-center gap-3 group">
            <div className={cn(
              "rounded-xl p-1 transition-smooth",
              transparent ? "bg-white/95 shadow-glow" : "bg-white shadow-soft"
            )}>
              <img src={logo} alt="Devki Travels" className="w-12 h-12 lg:w-14 lg:h-14 object-contain" />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className={cn(
                "font-display font-extrabold text-lg lg:text-xl tracking-wide",
                transparent ? "text-white drop-shadow-lg" : "text-[#0b2545]"
              )}>
                DEVKI TRAVELS
              </div>
              <div className={cn(
                "text-[10px] uppercase tracking-[0.2em] font-semibold",
                transparent ? "text-amber-300" : "text-amber-600"
              )}>
                Travel Uttarakhand · Comfortably
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "px-3 py-2 text-sm font-semibold rounded-md transition-smooth relative",
                  transparent ? "text-white hover:text-amber-300" : "text-foreground hover:text-primary",
                  "hover:bg-primary/10"
                )}
                activeProps={{ className: "text-primary bg-primary/10" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${SITE.phone1.replace(/\s/g, "")}`}
              className={cn(
                "flex items-center gap-2 text-sm font-semibold",
                transparent ? "text-white" : "text-foreground"
              )}
            >
              <Phone className="w-4 h-4" />
              {SITE.phone1}
            </a>
            <Link
              to="/book"
              className="px-5 py-2.5 rounded-full bg-gradient-hero text-primary-foreground font-semibold text-sm shadow-soft hover:shadow-glow transition-smooth hover:scale-105"
            >
              Book a Ride
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className={cn("lg:hidden p-2 rounded-md", transparent ? "text-white" : "text-foreground")}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-border animate-fade-up">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-smooth font-semibold"
                activeProps={{ className: "bg-primary/10 text-primary" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/book" className="mt-2 text-center px-4 py-3 rounded-lg bg-gradient-hero text-primary-foreground font-semibold">
              Book a Ride
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
