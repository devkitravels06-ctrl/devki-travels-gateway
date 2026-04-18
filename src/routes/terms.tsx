import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — Devki Travels" }, { name: "description", content: "Terms and conditions for Devki Travels services." }] }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <section className="pt-32 pb-20 bg-gradient-sky min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-display font-bold">Terms & Conditions</h1>
        <p className="mt-2 text-muted-foreground text-sm">Last updated: April 2026</p>
        <div className="prose prose-slate mt-8 space-y-6 text-foreground/85 leading-relaxed">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-display text-2xl font-semibold mt-6 mb-2">{s.title}</h2>
              <p>{s.body}</p>
            </div>
          ))}
          <p className="text-sm text-muted-foreground pt-6 border-t border-border">All disputes subject to Dehradun jurisdiction only. E. & O. E.</p>
        </div>
      </div>
    </section>
  );
}

const sections = [
  { title: "1. Booking & Confirmation", body: "All bookings are subject to vehicle availability. A booking is considered confirmed only after acknowledgement from Devki Travels via call, SMS, or email. Advance payment may be required for outstation, multi-day, or wedding bookings." },
  { title: "2. Cancellation Policy", body: "Cancellations made 24+ hours before the scheduled pickup are eligible for a full refund of any advance paid (less applicable transaction fees). Cancellations within 24 hours may attract a charge of 25-50% of the booking value depending on the trip." },
  { title: "3. Fares & Billing", body: "All fares are quoted in Indian Rupees and are subject to applicable GST (CGST + SGST or IGST). Toll, parking, state-entry tax, and night-halt charges (if applicable) are billed extra at actuals. GST-compliant tax invoices are issued for every trip." },
  { title: "4. Driver & Vehicle", body: "Drivers are professionally trained and verified. Customers are requested to treat drivers with respect. Smoking, consumption of alcohol, or carrying contraband in our vehicles is strictly prohibited." },
  { title: "5. Liability", body: "Devki Travels is not liable for any delay or non-performance arising due to force majeure events such as natural disasters, road blockades, strikes, government restrictions, or mechanical breakdown beyond our reasonable control. Personal belongings are the sole responsibility of the customer." },
  { title: "6. Conduct of Customer", body: "Devki Travels reserves the right to terminate a trip without refund if the customer's conduct is abusive, illegal, or endangers the driver, vehicle, or other passengers." },
  { title: "7. Modifications", body: "Itinerary changes during the trip (extra kilometres, additional stops, route changes) will be billed at the prevailing rates and added to the final invoice." },
  { title: "8. Jurisdiction", body: "All disputes are subject to the exclusive jurisdiction of the courts at Dehradun, Uttarakhand." },
];
