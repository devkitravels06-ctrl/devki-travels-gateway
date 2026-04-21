import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Offer = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  discount_label: string | null;
  price_label: string | null;
  whatsapp_message: string;
  whatsapp_number: string;
};

const FALLBACK_IMG = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=70";

export function OfferCards() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("service_offers")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      setOffers((data as any) ?? []);
    })();
  }, []);

  if (!offers.length) return null;

  const perPage = 3;
  const pages = Math.max(1, Math.ceil(offers.length / perPage));
  const visible = offers.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="relative py-20 bg-gradient-to-br from-[#061a36] via-[#0b2545] to-[#061a36] overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_0%,white,transparent_50%)]" />
      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-amber-300">Limited Time</span>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white mt-3">
            Special <span className="text-amber-400">Offers</span>
          </h2>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto">
            Book now and save big. Pay only an advance to confirm — settle the rest on arrival.
          </p>
        </div>

        <div className="relative">
          <div className="bg-white/95 backdrop-blur rounded-3xl p-6 md:p-10 shadow-elegant">
            <div className="grid md:grid-cols-3 gap-6">
              {visible.map((o, i) => (
                <OfferCard key={o.id} offer={o} delay={i * 0.1} />
              ))}
            </div>
          </div>

          {pages > 1 && (
            <>
              <button
                onClick={() => setPage((p) => (p - 1 + pages) % pages)}
                className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-amber-500 text-white shadow-lg flex items-center justify-center hover:bg-amber-600 hover:scale-110 transition"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage((p) => (p + 1) % pages)}
                className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-amber-500 text-white shadow-lg flex items-center justify-center hover:bg-amber-600 hover:scale-110 transition"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function OfferCard({ offer, delay }: { offer: Offer; delay: number }) {
  const num = offer.whatsapp_number.replace(/\D/g, "");
  const msg = encodeURIComponent(offer.whatsapp_message || "Hi, I want to Book a CAB");
  const href = `https://wa.me/${num}?text=${msg}`;
  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 animate-fade-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={offer.image_url || FALLBACK_IMG}
          alt={offer.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {offer.discount_label && (
          <div className="absolute top-4 left-0 bg-amber-500 text-white text-xs font-extrabold tracking-wider px-4 py-1.5 shadow-lg before:content-[''] before:absolute before:right-[-8px] before:top-0 before:border-l-[8px] before:border-l-amber-500 before:border-t-[15px] before:border-t-transparent before:border-b-[15px] before:border-b-transparent">
            {offer.discount_label}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display font-bold text-lg text-gray-900 leading-snug">{offer.title}</h3>
            {offer.subtitle && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {offer.subtitle}
              </div>
            )}
          </div>
          {offer.price_label && (
            <div className="text-right shrink-0">
              <div className="text-[10px] uppercase tracking-wider text-gray-400">From</div>
              <div className="text-amber-600 font-extrabold text-lg leading-tight whitespace-nowrap">
                {offer.price_label.replace(/^From\s*/i, "")}
              </div>
            </div>
          )}
        </div>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm uppercase tracking-wider shadow-soft transition-all hover:scale-[1.02]"
        >
          <MessageCircle className="w-4 h-4" />
          Contact
        </a>
      </div>
    </div>
  );
}
