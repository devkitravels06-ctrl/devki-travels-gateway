import { Outlet, Link, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-sky px-4">
      <div className="max-w-md text-center">
        <h1 className="text-8xl font-display font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-2xl font-display font-semibold">Page not found</h2>
        <p className="mt-3 text-muted-foreground">The road you took doesn't exist on our map.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-hero px-6 py-3 text-sm font-medium text-primary-foreground shadow-soft hover:shadow-glow transition-smooth">
          Return Home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Devki Travels: Navigating the Governance Grid" },
      { name: "description", content: "Premium travel & vehicle hire services across Uttarakhand. Trusted by the Government of Uttarakhand for 8+ years. Innova Crysta, Fortuner, Scorpio, Tempo Traveller and more." },
      { name: "author", content: "Devki Travels" },
      { property: "og:title", content: "Devki Travels: Navigating the Governance Grid" },
      { property: "og:description", content: "Premium travel & vehicle hire services across Uttarakhand. Trusted by the Government of Uttarakhand for 8+ years. Innova Crysta, Fortuner, Scorpio, Tempo Traveller and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Devki Travels: Navigating the Governance Grid" },
      { name: "twitter:description", content: "Premium travel & vehicle hire services across Uttarakhand. Trusted by the Government of Uttarakhand for 8+ years. Innova Crysta, Fortuner, Scorpio, Tempo Traveller and more." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/b95bc198-0637-4404-8d72-a3250a586c25" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/b95bc198-0637-4404-8d72-a3250a586c25" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith("/admin");
  return (
    <>
      {!isAdmin && <SiteHeader />}
      <main className={isAdmin ? "" : "min-h-screen"}>
        <Outlet />
      </main>
      {!isAdmin && <SiteFooter />}
      <Toaster richColors position="top-right" />
    </>
  );
}
