import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Target, Eye, Award, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageBackground } from "@/components/PageBackground";
import bg from "@/assets/bg-dehradun.jpg";
import founder1 from "@/assets/founder-1.jpg";
import founder2 from "@/assets/founder-2.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Devki Travels" },
      { name: "description", content: "8+ years serving the Government of Uttarakhand. Meet the founders behind Devki Travels and our mission." },
    ],
  }),
  component: AboutPage,
});

interface Founder { id: string; name: string; role: string; bio: string | null; photo_url: string | null; display_order: number; }

const fallbackPhotos = [founder1, founder2];

function AboutPage() {
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [about, setAbout] = useState("");
  const [founders, setFounders] = useState<Founder[]>([]);

  useEffect(() => {
    (async () => {
      const { data: content } = await supabase.from("site_content").select("*").in("key", ["mission", "vision", "about"]);
      content?.forEach((c: any) => {
        if (c.key === "mission") setMission(c.value.text);
        if (c.key === "vision") setVision(c.value.text);
        if (c.key === "about") setAbout(c.value.text);
      });
      const { data: f } = await supabase.from("founders").select("*").order("display_order");
      if (f) setFounders(f as Founder[]);
    })();
  }, []);

  return (
    <PageBackground image={bg} overlay="medium">
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl text-center mx-auto animate-fade-up">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">About Us</span>
            <h1 className="text-5xl md:text-6xl font-display font-bold mt-3">A legacy of trust on every road.</h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{about}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-card border border-border rounded-3xl p-10 hover-lift">
              <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center text-primary-foreground mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="font-display text-3xl font-bold mb-3">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">{mission}</p>
            </div>
            <div className="bg-gradient-card border border-border rounded-3xl p-10 hover-lift">
              <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center text-primary-foreground mb-5">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="font-display text-3xl font-bold mb-3">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">{vision}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">Leadership</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mt-3">Meet the Founders</h2>
            <p className="mt-4 text-muted-foreground">The vision and the engine behind Devki Travels.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {founders.map((f, i) => (
              <div key={f.id} className="group bg-gradient-card border border-border rounded-3xl overflow-hidden hover-lift">
                <div className="aspect-square overflow-hidden bg-gradient-sky">
                  <img
                    src={f.photo_url || fallbackPhotos[i] || founder1}
                    alt={f.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
                  />
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
                    <Award className="w-4 h-4" />{f.role}
                  </div>
                  <h3 className="font-display text-2xl font-bold mt-2">{f.name}</h3>
                  {f.bio && <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{f.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="bg-gradient-hero rounded-3xl p-10 md:p-14 text-primary-foreground shadow-elegant relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-white/10 animate-float" />
            <div className="relative grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <Users className="w-10 h-10 mb-4" />
                <h3 className="font-display text-3xl md:text-4xl font-bold">8+ years. Thousands of journeys. One unwavering standard.</h3>
              </div>
              <div className="text-primary-foreground/90 leading-relaxed">
                From dignitaries to families, our drivers and our promise stay the same: safe, on time, and unmistakably professional.
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageBackground>
  );
}
