import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Fuel, Snowflake, ArrowRight } from "lucide-react";
import { PageBackground } from "@/components/PageBackground";
import bg from "@/assets/bg-dehradun.jpg";
import innova from "@/assets/fleet-innova.jpg";
import fortuner from "@/assets/fleet-fortuner.jpg";
import amaze from "@/assets/fleet-amaze.jpg";
import scorpio from "@/assets/fleet-scorpio.jpg";
import tempo from "@/assets/fleet-tempo.jpg";
import hycross from "@/assets/fleet-hycross.jpg";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Our Fleet — Devki Travels" },
      { name: "description", content: "Hire Innova Crysta, Toyota Fortuner, Honda Amaze, Mahindra Scorpio, Tempo Traveller and more across Uttarakhand." },
    ],
  }),
  component: FleetPage,
});

const fleet = [
  { name: "Toyota Innova Crysta", img: innova, seats: 7, ac: true, type: "Premium MPV", desc: "The undisputed king of premium people movers. Plush interior, smooth ride, our most-requested vehicle for officials." },
  { name: "Toyota Fortuner", img: fortuner, seats: 7, ac: true, type: "Luxury SUV", desc: "Commanding road presence with the comfort of a luxury car. Ideal for VIP convoys and long highway runs." },
  { name: "Mahindra Scorpio", img: scorpio, seats: 7, ac: true, type: "Rugged SUV", desc: "Built for Uttarakhand's mountains. Tested across Char Dham, Auli and the highest accessible passes." },
  { name: "Honda Amaze", img: amaze, seats: 4, ac: true, type: "Sedan", desc: "Quiet, fuel-efficient sedan for executive city travel and short outstation runs." },
  { name: "Toyota Innova HyCross", img: hycross, seats: 7, ac: true, type: "Hybrid MPV", desc: "The next-generation hybrid flagship. Whisper-quiet cabin, captain seats and superior fuel economy for VIP travel." },
  { name: "Tempo Traveller", img: tempo, seats: 17, ac: true, type: "Group Travel", desc: "12-17 seater for groups, school tours, weddings and pilgrimages. Push-back seats and ample luggage." },
];

function FleetPage() {
  return (
    <PageBackground image={bg} overlay="medium">
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary">The Fleet</span>
          <h1 className="text-5xl md:text-6xl font-display font-bold mt-3 animate-fade-up">A vehicle for every mission.</h1>
          <p className="mt-5 text-lg text-muted-foreground">Hand-picked, professionally maintained, and always ready to roll.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {fleet.map((v, i) => (
              <article key={i} className="group bg-gradient-card border border-border rounded-3xl overflow-hidden hover-lift animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-sky">
                  <img src={v.img} alt={v.name} loading="lazy" width={1024} height={640} className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-700" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass text-white text-xs font-medium">{v.type}</div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold">{v.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{v.seats} Seater</span>
                    {v.ac && <span className="flex items-center gap-1.5"><Snowflake className="w-3.5 h-3.5" />AC</span>}
                    <span className="flex items-center gap-1.5"><Fuel className="w-3.5 h-3.5" />Diesel</span>
                  </div>
                  <Link to="/book" className="mt-5 inline-flex items-center gap-2 text-primary font-medium text-sm group/btn">
                    Book this vehicle
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-smooth" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageBackground>
  );
}
