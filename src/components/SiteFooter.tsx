import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { SITE, NAV } from "@/lib/site";
import logo from "@/assets/devki-logo.png";

export function SiteFooter() {
  return (
    <footer className="relative bg-[#061a36] text-white mt-20 print:hidden overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-primary to-amber-400" />
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="relative container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white rounded-xl p-1 shadow-soft">
                <img src={logo} alt="Devki Travels" className="w-14 h-14 object-contain" />
              </div>
              <div>
                <div className="font-display font-extrabold text-xl tracking-wide">DEVKI TRAVELS</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-semibold">Travel Comfortably</div>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Trusted by the Government of Uttarakhand for 8+ years. Vehicle on rent · Safe journey · Memorable trips.
            </p>
            <div className="flex gap-3 mt-5">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-amber-500 flex items-center justify-center transition-smooth">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4 text-amber-300">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-white/70 hover:text-amber-300 transition-smooth">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4 text-amber-300">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="text-white/70 hover:text-amber-300 transition-smooth">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-white/70 hover:text-amber-300 transition-smooth">Privacy Policy</Link></li>
              <li><Link to="/admin/login" className="text-white/70 hover:text-amber-300 transition-smooth">Admin Panel</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4 text-amber-300">Contact</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 text-amber-300 shrink-0" />{SITE.address}</li>
              <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5 text-amber-300" /><a href={`tel:${SITE.phone1}`} className="hover:text-amber-300">{SITE.phone1}</a></li>
              <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5 text-amber-300" /><a href={`tel:${SITE.phone2}`} className="hover:text-amber-300">{SITE.phone2}</a></li>
              <li className="flex gap-2"><Mail className="w-4 h-4 mt-0.5 text-amber-300" /><a href={`mailto:${SITE.email}`} className="hover:text-amber-300">{SITE.email}</a></li>
              <li className="text-xs pt-2">GSTIN: {SITE.gstin}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Devki Travels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
