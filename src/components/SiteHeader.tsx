import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const isHome = loc.pathname === "/";
  // On non-home routes, ALWAYS use the solid (light) header so it stays visible over any content
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
        transparent ? "bg-transparent" : "glass-light shadow-soft"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold text-lg shadow-soft group-hover:shadow-glow transition-smooth">
              D
            </div>
            <div className={cn("font-display font-bold text-lg leading-tight", transparent ? "text-white drop-shadow" : "text-foreground")}>
              Devki Travels
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-smooth relative",
                  transparent ? "text-white hover:text-primary-glow" : "text-foreground hover:text-primary",
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
                "flex items-center gap-2 text-sm font-medium",
                transparent ? "text-white" : "text-foreground"
              )}
            >
              <Phone className="w-4 h-4" />
              {SITE.phone1}
            </a>
            <Link
              to="/book"
              className="px-5 py-2.5 rounded-full bg-gradient-hero text-primary-foreground font-medium text-sm shadow-soft hover:shadow-glow transition-smooth hover:scale-105"
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
        <div className="lg:hidden glass-light border-t border-border animate-fade-up">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-smooth"
                activeProps={{ className: "bg-primary/10 text-primary" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/book" className="mt-2 text-center px-4 py-3 rounded-lg bg-gradient-hero text-primary-foreground font-medium">
              Book a Ride
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
