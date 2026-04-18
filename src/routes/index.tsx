import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Shield, Award, Users, Clock, MapPin, Star, CheckCircle2 } from "lucide-react";
import heroImg from "@/assets/hero-mountain.jpg";
import innova from "@/assets/fleet-innova.jpg";
import fortuner from "@/assets/fleet-fortuner.jpg";
import scorpio from "@/assets/fleet-scorpio.jpg";
import tempo from "@/assets/fleet-tempo.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Devki Travels: Navigating the Governance Grid" },
      { name: "description", content: "Uttarakhand's most trusted travel partner. 8+ years serving the Government of Uttarakhand with Innova Crysta, Fortuner, Scorpio and more." },
    ],
  }),
  component: HomePage,
});

const stats = [
  { icon: Award, value: "8+", label: "Years of Excellence" },
  { icon: Users, value: "10,000+", label: "Happy Clients" },
  { icon: Shield, value: "100%", label: "Govt. Approved" },
  { icon: Clock, value: "24/7", label: "On-Call Service" },
];

const features = [
  { icon: Shield, title: "Government Trusted", desc: "Preferred travel partner for multiple departments of the Government of Uttarakhand for 8+ years." },
  { icon: Award, title: "Premium Fleet", desc: "Well-maintained Innova Crysta, Fortuner, Scorpio, Honda Amaze, Tempo Traveller and more." },
  { icon: Users, title: "Professional Drivers", desc: "Experienced, courteous, and verified chauffeurs trained for VIP and official travel." },
  { icon: Clock, title: "Always On Time", desc: "Punctuality you can plan around — because government schedules don't wait." },
  { icon: MapPin, title: "Pan-Uttarakhand", desc: "From Dehradun to Pithoragarh — we cover every district, every hill station." },
  { icon: Star, title: "Transparent Billing", desc: "GST-compliant invoices, no hidden charges, every trip documented." },
];

const featuredFleet = [
  { name: "Toyota Innova Crysta", type: "Premium MPV · 7 Seater", img: innova },
  { name: "Toyota Fortuner", type: "Luxury SUV · 7 Seater", img: fortuner },
  { name: "Mahindra Scorpio", type: "Rugged SUV · 7 Seater", img: scorpio },
  { name: "Tempo Traveller", type: "Group Travel · 12-17 Seater", img: tempo },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="Uttarakhand Himalayan road" className="w-full h-full object-cover animate-slow-zoom" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/80 via-foreground/50 to-primary/40" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 pt-24 pb-16 relative">
          <div className="max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium tracking-wider uppercase mb-6 animate-fade-up">
              <Shield className="w-3.5 h-3.5 text-primary-glow" />
              Trusted by the Government of Uttarakhand · Since 2017
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.05] animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Navigating the<br />
              <span className="text-gradient bg-gradient-to-r from-primary-glow via-white to-primary-glow bg-clip-text text-transparent">
                Governance Grid.
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Uttarakhand's most decorated travel partner. Premium fleet, verified drivers, and a perfect on-time record — built for officials, perfected for everyone.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Link to="/book" className="group px-7 py-3.5 rounded-full bg-gradient-hero text-primary-foreground font-medium shadow-elegant hover:shadow-glow transition-smooth hover:scale-105 flex items-center gap-2">
                Book Your Ride
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
              </Link>
              <Link to="/fleet" className="px-7 py-3.5 rounded-full glass text-white font-medium hover:bg-white/20 transition-smooth">
                Explore Fleet
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl">
            {stats.map((s, i) => (
              <div key={i} className="glass rounded-2xl p-5 text-white hover-lift animate-fade-up" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                <s.icon className="w-6 h-6 text-primary-glow mb-2" />
                <div className="text-3xl font-display font-bold">{s.value}</div>
                <div className="text-xs text-white/75 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-gradient-sky">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">Why Devki Travels</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mt-3">Built for those who can't compromise.</h2>
            <p className="mt-4 text-muted-foreground">Government departments, corporate houses, and discerning travellers choose us for one reason: we deliver, every single time.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group bg-gradient-card border border-border rounded-2xl p-7 hover-lift">
                <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-110 transition-smooth">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLEET PREVIEW */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-primary">Our Fleet</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mt-3">A vehicle for every mission.</h2>
            </div>
            <Link to="/fleet" className="group inline-flex items-center gap-2 text-primary font-medium">
              View entire fleet <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFleet.map((v, i) => (
              <div key={i} className="group rounded-2xl overflow-hidden bg-gradient-card border border-border hover-lift">
                <div className="aspect-[4/3] overflow-hidden bg-gradient-sky">
                  <img src={v.img} alt={v.name} loading="lazy" width={1024} height={640} className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-700" />
                </div>
                <div className="p-5">
                  <h3 className="font-display font-semibold text-lg">{v.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{v.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-hero p-12 md:p-16 shadow-elegant">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 animate-float" />
            <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-white/10 animate-float" style={{ animationDelay: "2s" }} />
            <div className="relative max-w-2xl text-primary-foreground">
              <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">Ready to ride with Uttarakhand's #1?</h2>
              <p className="mt-4 text-primary-foreground/90 text-lg">Book in under a minute. Confirmation within 30 minutes. Driver allotted within an hour.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/book" className="px-7 py-3.5 rounded-full bg-white text-primary font-semibold hover:scale-105 transition-smooth shadow-soft">
                  Book a Ride Now
                </Link>
                <Link to="/contact" className="px-7 py-3.5 rounded-full glass text-white font-medium hover:bg-white/20 transition-smooth">
                  Talk to Us
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-primary-foreground/85">
                {["No hidden charges", "GST-compliant invoices", "24×7 support"].map((t) => (
                  <div key={t} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
