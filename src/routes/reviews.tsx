import { createFileRoute } from "@tanstack/react-router";
import { Star, ExternalLink } from "lucide-react";
import { SITE } from "@/lib/site";
import { PageBackground } from "@/components/PageBackground";
import bg from "@/assets/bg-dehradun.jpg";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Google Reviews — Devki Travels" },
      { name: "description", content: "Read what our clients across Uttarakhand say about Devki Travels. Leave us a Google review." },
    ],
  }),
  component: ReviewsPage,
});

const testimonials = [
  { name: "Anil Sharma", role: "Joint Secretary, Govt. of Uttarakhand", text: "Devki Travels has been our trusted partner for over 5 years. Punctual, professional, and absolutely dependable for every official assignment.", rating: 5 },
  { name: "Priya Negi", role: "HR Director, Tech Mahindra Dehradun", text: "We use Devki Travels for all our executive transfers from Jolly Grant. They've never been late — not once. Drivers are courteous and clean cars every time.", rating: 5 },
  { name: "Manoj Rawat", role: "Travel Operator", text: "Booked a Tempo Traveller for our Char Dham Yatra group of 15. Hill driver was an absolute pro. Made the trip safe and memorable.", rating: 5 },
  { name: "Dr. Sushma Bisht", role: "Senior Consultant", text: "Used their Innova for an airport pickup at midnight. Driver was waiting 20 minutes early with my name placard. Perfect.", rating: 5 },
  { name: "Vikram Thapa", role: "Wedding Planner, Mussoorie", text: "Booked their Fortuner fleet for a destination wedding. Decorated beautifully, on time, and the team coordinated like clockwork.", rating: 5 },
  { name: "Rohit Aggarwal", role: "Corporate Client", text: "Their billing is transparent — proper GST invoices, no hidden charges. Wish every vendor was this professional.", rating: 5 },
];

function ReviewsPage() {
  return (
    <PageBackground image={bg} overlay="medium">
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary">Google Reviews</span>
          <h1 className="text-5xl md:text-6xl font-display font-bold mt-3 animate-fade-up">Loved across Uttarakhand.</h1>
          <div className="mt-6 inline-flex items-center gap-3 glass-light rounded-full px-6 py-3 shadow-soft">
            <div className="flex">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-gold text-gold" />)}
            </div>
            <span className="font-semibold text-lg">4.9 / 5</span>
            <span className="text-muted-foreground text-sm">· based on 200+ reviews</span>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gradient-card border border-border rounded-2xl p-7 hover-lift animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-gold text-gold" />)}
                </div>
                <p className="text-sm leading-relaxed text-foreground/85">"{t.text}"</p>
                <div className="mt-5 pt-5 border-t border-border">
                  <div className="font-display font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="bg-gradient-hero rounded-3xl p-10 md:p-14 text-center text-primary-foreground shadow-elegant">
            <h2 className="font-display text-3xl md:text-4xl font-bold">Loved your experience? Tell the world.</h2>
            <p className="mt-3 text-primary-foreground/90 max-w-xl mx-auto">A 30-second Google review helps us serve more travellers across Uttarakhand.</p>
            <a href={SITE.googleReviewUrl} target="_blank" rel="noopener" className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-primary font-semibold hover:scale-105 transition-smooth shadow-soft">
              Leave a Google Review <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </PageBackground>
  );
}
