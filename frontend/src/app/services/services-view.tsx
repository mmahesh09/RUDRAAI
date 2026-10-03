import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HowItWorksSection from "@/components/how-it-works-section";
import ServicesContactSection from "@/components/services-contact-section";
import CTASection from "@/components/cta-section";
import PageHero from "@/components/site/page-hero";
import Reveal from "@/components/site/reveal";
import { SERVICES, SITE } from "@/lib/site";

// What each service looks like in practice — concrete examples, not categories.
const EXAMPLES: Record<(typeof SERVICES)[number]["slug"], string[]> = {
  websites: [
    "A clinic site where patients find the right doctor and book in two taps",
    "A product site that ranks for what your customers actually search",
    "A landing page for a launch, live in days, measured from the first visit",
  ],
  "ai-agents": [
    "A website assistant that answers pricing and availability from your own docs",
    "A WhatsApp agent that qualifies leads and books calls into your calendar",
    "An internal helper that finds the right policy or SOP in seconds",
  ],
  automations: [
    "Form → CRM → personal reply → Slack alert, in under ten seconds",
    "Invoices created when a job is marked done, reminders sent automatically",
    "A Monday-morning report pulled from five tools into one message",
  ],
};

export default function ServicesView() {
  return (
    <main className="bg-black">
      <Navbar />
      <PageHero
        label="Services"
        title="Built to take work off your plate."
        intro="Websites that bring people in, AI agents that answer them, and automations that handle what happens next. Each one fixed-price, documented, and yours to keep."
      >
        <nav aria-label="Services on this page" className="flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              className="inline-flex h-10 items-center rounded-full border border-white/[0.18] px-5 text-[14px] font-medium text-[#F5F5F7] transition-colors hover:border-white/40"
            >
              {s.name}
            </a>
          ))}
        </nav>
      </PageHero>

      {SERVICES.map((s, i) => (
        <section key={s.slug} id={s.slug} className="scroll-mt-16 border-t border-white/[0.08] py-24 md:py-32">
          <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow">
                  <span className="text-[#2997FF]">{String(i + 1).padStart(2, "0")}&nbsp;&nbsp;</span>
                  {s.timeline} typical
                </p>
              </Reveal>
              <h2 className="mt-6 font-heading font-semibold leading-none tracking-[-0.045em] text-[#F5F5F7] text-[clamp(3rem,7vw,5.5rem)]">
                <Reveal as="span" variant="line">{s.name}</Reveal>
              </h2>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-[34ch] text-xl leading-snug text-[#F5F5F7]">{s.line}</p>
                <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.7] text-[#A1A1AA]">{s.detail}</p>
              </Reveal>
            </div>

            <div className="grid gap-12 sm:grid-cols-2 lg:col-span-6 lg:col-start-7 lg:pt-16">
              <Reveal delay={0.1}>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">What you get</h3>
                <ul className="ledger mt-4 border-y border-white/[0.08]">
                  {s.deliverables.map((d) => (
                    <li key={d} className="py-3.5 text-[15px] text-[#F5F5F7]">
                      {d}
                    </li>
                  ))}
                  <li className="py-3.5 text-[15px] text-[#F5F5F7]">{SITE.supportDays} days of free fixes</li>
                </ul>
              </Reveal>
              <Reveal delay={0.16}>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">For example</h3>
                <ul className="ledger mt-4 border-y border-white/[0.08]">
                  {EXAMPLES[s.slug].map((e) => (
                    <li key={e} className="py-3.5 text-[15px] leading-snug text-[#A1A1AA]">
                      {e}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.2} className="sm:col-span-2">
                <Link
                  href="/booking"
                  className="group inline-flex items-center gap-2 text-[15px] font-medium text-[#F5F5F7] underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-[#2997FF]"
                >
                  Talk about {s.name.toLowerCase()}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      <div className="border-t border-white/[0.08]">
        <HowItWorksSection index="04" />
      </div>
      <ServicesContactSection />
      <CTASection />
      <Footer />
    </main>
  );
}
