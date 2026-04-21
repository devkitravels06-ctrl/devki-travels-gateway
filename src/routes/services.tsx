import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Plane, Mountain, Users, Building2, Calendar, Car, Truck } from "lucide-react";
import { PageBackground } from "@/components/PageBackground";
import { OfferCards } from "@/components/OfferCards";
import bg from "@/assets/hero-mountain.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Devki Travels" },
      { name: "description", content: "Government tours, corporate travel, airport transfers, hill station tours, wedding fleets, group travel and more across Uttarakhand." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: Building2, title: "Government Department Tours", desc: "Preferred vendor for multiple Uttarakhand government departments. Inspections, conferences, VIP visits — handled discreetly and on time." },
  { icon: Briefcase, title: "Corporate Travel", desc: "Long-term contracts and one-off bookings for corporate clients. Monthly billing, dedicated drivers, fleet on standby." },
  { icon: Plane, title: "Airport Transfers", desc: "On-time pickups and drops at Jolly Grant (DED), Delhi (DEL) and Chandigarh (IXC). Flight-tracked and worry-free." },
  { icon: Mountain, title: "Hill Station Tours", desc: "Mussoorie, Nainital, Auli, Char Dham, Valley of Flowers, Jim Corbett — curated multi-day itineraries with experienced hill drivers." },
  { icon: Calendar, title: "Wedding Fleet", desc: "Premium SUVs and luxury cars for weddings. Decorated, on-time, and immaculately presented." },
  { icon: Users, title: "Group & Pilgrim Travel", desc: "Tempo Travellers and mini-buses for school trips, family functions, and Char Dham yatras." },
  { icon: Car, title: "Daily / Outstation Hire", desc: "Per-day or per-km hire for any duration. Transparent pricing with GST invoices." },
  { icon: Truck, title: "Logistics & Delivery", desc: "Light commercial transport for documents, equipment and time-sensitive shipments across the state." },
];

function ServicesPage() {
  return (
    <PageBackground image={bg} overlay="medium">
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary">What We Do</span>
          <h1 className="text-5xl md:text-6xl font-display font-bold mt-3 animate-fade-up">Services Offered</h1>
          <p className="mt-5 text-lg text-muted-foreground">From government inspections to family pilgrimages — every journey, our promise.</p>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} className="group bg-gradient-card border border-border rounded-2xl p-7 hover-lift animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground mb-4 group-hover:rotate-6 group-hover:scale-110 transition-smooth">
                  <s.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/book" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-hero text-primary-foreground font-medium shadow-elegant hover:shadow-glow transition-smooth hover:scale-105">
              Request a Service
            </Link>
          </div>
        </div>
      </section>
    </PageBackground>
  );
}
