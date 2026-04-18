import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Devki Travels" }, { name: "description", content: "How Devki Travels collects, uses, and protects your information." }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <section className="pt-32 pb-20 bg-gradient-sky min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-display font-bold">Privacy Policy</h1>
        <p className="mt-2 text-muted-foreground text-sm">Last updated: April 2026</p>
        <div className="mt-8 space-y-6 text-foreground/85 leading-relaxed">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-display text-2xl font-semibold mt-6 mb-2">{s.title}</h2>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const sections = [
  { title: "1. Information We Collect", body: "We collect information you provide directly — your name, phone, email, pickup/drop locations, and trip details — when you book a ride or contact us. We do not knowingly collect data from children under 13." },
  { title: "2. How We Use Your Information", body: "Information is used solely to fulfill your booking, issue GST-compliant invoices, contact you about your trip, and improve our service. We never sell your personal data to third parties." },
  { title: "3. Sharing", body: "Booking details are shared only with the assigned driver. Invoices may be shared with your organization (e.g., government department, employer) when explicitly authorised. Data may be shared with law enforcement if compelled by valid legal process." },
  { title: "4. Data Retention", body: "Trip records and invoices are retained for the period required by Indian tax law (currently 8 years). Contact form messages are retained for up to 2 years for follow-up purposes." },
  { title: "5. Security", body: "Your data is stored on encrypted, access-controlled cloud infrastructure. Only authorised Devki Travels staff can access customer records." },
  { title: "6. Your Rights", body: "You may request access to, correction of, or deletion of your personal data by emailing info@devkitravels.in. We will respond within 30 days." },
  { title: "7. Cookies", body: "Our website uses minimal cookies for session management and analytics. We do not use advertising or tracking cookies." },
  { title: "8. Updates", body: "This policy may be updated from time to time. The 'Last updated' date at the top will reflect any changes." },
];
