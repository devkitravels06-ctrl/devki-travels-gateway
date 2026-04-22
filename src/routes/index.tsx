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

const trustLogos = [
  "Govt. of Uttarakhand", "PWD Dehradun", "Forest Dept.", "Jal Sansthan", "Tourism Board",
  "ITBP Liaison", "DRDO Visits", "Doon Hospital", "ONGC Officials", "Election Commission",
];

const testimonials = [
  { name: "R. Singh", role: "PWD Officer", quote: "Devki Travels has been our go-to for 6 years — never a single late pickup. Fleet is spotless." },
  { name: "Priya M.", role: "Tourism Board", quote: "Drove ministerial delegations across Garhwal. Drivers were professional, route knowledge unmatched." },
  { name: "A. Bisht", role: "Corporate Client", quote: "Booked a Tempo Traveller for a 12-day Char Dham circuit. Flawless. Bills GST-ready in 24 hours." },
];

function HomePage() {
  return (
    <>
      {/* HERO with HD video background */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <video
            autoPlay muted loop playsInline preload="auto"
            poster={heroImg}
            className="w-full h-full object-cover scale-105"
          >
            {/* HD mountain road footage from Coverr (free, no attribution required) */}
            <source src="https://videos.pexels.com/video-files/2098989/2098989-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          </video>
          <img src={heroImg} alt="Uttarakhand Himalayan road" className="hidden" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/85 via-foreground/55 to-primary/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,transparent_30%,oklch(0.15_0.04_250/0.8)_100%)]" />
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
              <Link to="/fleet" className="px-7 py-3.5 rounded-full glass text-white font-medium hover:bg-white/20 hover:scale-105 transition-smooth">
                Explore Fleet
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl">
            {stats.map((s, i) => (
              <div key={i} className="glass glow-ring rounded-2xl p-5 text-white hover-lift animate-fade-up" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                <s.icon className="w-6 h-6 text-primary-glow mb-2" />
                <div className="text-3xl font-display font-bold">{s.value}</div>
                <div className="text-xs text-white/75 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-[10px] uppercase tracking-[0.3em] flex flex-col items-center gap-2 animate-float">
          Scroll
          <div className="w-px h-8 bg-white/40" />
        </div>
      </section>

      {/* TRUST MARQUEE */}
      <section className="bg-foreground text-white/80 py-6 overflow-hidden border-y border-white/10">
        <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
          {[...trustLogos, ...trustLogos].map((l, i) => (
            <div key={i} className="flex items-center gap-3 text-sm font-medium tracking-wide">
              <Shield className="w-4 h-4 text-primary-glow" />
              <span>{l}</span>
              <span className="text-white/30 ml-12">●</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-gradient-sky relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary-glow/10 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">Why Devki Travels</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mt-3">Built for those who can't compromise.</h2>
            <p className="mt-4 text-muted-foreground">Government departments, corporate houses, and discerning travellers choose us for one reason: we deliver, every single time.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group bg-gradient-card border border-border rounded-2xl p-7 hover-tilt card-shine glow-ring">
                <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-110 group-hover:rotate-6 transition-smooth shadow-soft">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-smooth">{f.title}</h3>
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
            <Link to="/fleet" className="group inline-flex items-center gap-2 text-primary font-medium link-underline">
              View entire fleet <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFleet.map((v, i) => (
              <div key={i} className="group rounded-2xl overflow-hidden bg-gradient-card border border-border hover-tilt card-shine">
                <div className="aspect-[4/3] overflow-hidden bg-gradient-sky relative">
                  <img src={v.img} alt={v.name} loading="lazy" width={1024} height={640} className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
                  <div className="absolute bottom-3 left-3 right-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-smooth">
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-white bg-primary/80 backdrop-blur px-2.5 py-1 rounded-full">View details</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-semibold text-lg group-hover:text-primary transition-smooth">{v.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{v.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-foreground text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-primary-glow/20 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary-glow">Voices that matter</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mt-3">What our clients say.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass rounded-2xl p-7 hover-lift glow-ring">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-gold text-gold" style={{ color: "oklch(0.78 0.15 80)" }} />)}
                </div>
                <p className="text-white/90 leading-relaxed italic">"{t.quote}"</p>
                <div className="mt-5 pt-5 border-t border-white/10">
                  <div className="font-display font-semibold">{t.name}</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider">{t.role}</div>
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
                <Link to="/book" className="px-7 py-3.5 rounded-full bg-white text-primary font-semibold hover:scale-105 hover:shadow-glow transition-smooth shadow-soft">
                  Book a Ride Now
                </Link>
                <Link to="/contact" className="px-7 py-3.5 rounded-full glass text-white font-medium hover:bg-white/20 hover:scale-105 transition-smooth">
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
