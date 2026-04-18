import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { SITE, NAV } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative bg-foreground text-background mt-20 print:hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-glow to-transparent" />
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center font-display font-bold text-lg text-primary-foreground">D</div>
              <span className="font-display text-xl font-bold">Devki Travels</span>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              Navigating the Governance Grid. Trusted by the Government of Uttarakhand for 8+ years.
            </p>
            <div className="flex gap-3 mt-5">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-smooth">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-background/70 hover:text-primary-glow transition-smooth">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="text-background/70 hover:text-primary-glow transition-smooth">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-background/70 hover:text-primary-glow transition-smooth">Privacy Policy</Link></li>
              <li><Link to="/admin/login" className="text-background/70 hover:text-primary-glow transition-smooth">Admin Panel</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 text-primary-glow shrink-0" />{SITE.address}</li>
              <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5 text-primary-glow" /><a href={`tel:${SITE.phone1}`} className="hover:text-primary-glow">{SITE.phone1}</a></li>
              <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5 text-primary-glow" /><a href={`tel:${SITE.phone2}`} className="hover:text-primary-glow">{SITE.phone2}</a></li>
              <li className="flex gap-2"><Mail className="w-4 h-4 mt-0.5 text-primary-glow" /><a href={`mailto:${SITE.email}`} className="hover:text-primary-glow">{SITE.email}</a></li>
              <li className="text-xs pt-2">GSTIN: {SITE.gstin}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-6 flex flex-col md:flex-row justify-between gap-4 text-xs text-background/60">
          <p>© {new Date().getFullYear()} Devki Travels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
