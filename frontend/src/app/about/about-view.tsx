import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import PageHero from "@/components/site/page-hero";
import SectionHead from "@/components/site/section-head";
import Reveal from "@/components/site/reveal";
import { SITE } from "@/lib/site";

// Margin notes beside the story — facts, not claims
const NOTES = [
  { k: "Founded", v: "2026" },
  { k: "Based in", v: SITE.location },
  { k: "Works with", v: "Small and growing teams, worldwide" },
  { k: "You talk to", v: "The person who builds it" },
];

const STACK = [
  { name: "n8n", body: "Self-hosted or cloud workflows with retries, error branches and alerts." },
  { name: "AI models", body: "OpenAI, Claude, Gemini and open-source models — chosen per job, not by habit." },
  { name: "Next.js", body: "Fast, accessible websites with SEO built in from the first page." },
  { name: "APIs + webhooks", body: "REST, OAuth and webhooks — if a tool has an API, it can be connected." },
];

const VALUES = [
  { title: "Useful beats impressive", body: "A plain workflow that saves five hours a week is worth more than a clever demo nobody uses." },
  { title: "Measured in hours, not features", body: "We judge a project by the time and money it gives back, and we say up front what that should be." },
  { title: "No black boxes", body: "You can open every workflow and read what it does. Documentation is part of the job, not an extra." },
  { title: "Ownership, not dependency", body: "Everything is built in your accounts. If you never call us again, it keeps running." },
];

export default function AboutView() {
  return (
    <main className="bg-black">
      <Navbar />
      <PageHero
        label="About"
        title="An engineer's studio, not an agency."
        intro={`${SITE.name} is a small practice in ${SITE.location.split(",")[0]} that builds websites, AI agents and automations for businesses that would rather spend their time on customers than on copy-paste.`}
      />

      {/* Story — a single editorial column with margin notes */}
      <section className="border-t border-white/[0.08] py-24 md:py-32">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-x-8">
          <Reveal className="lg:col-span-3">
            <dl className="ledger border-y border-white/[0.08] lg:sticky lg:top-24">
              {NOTES.map((n) => (
                <div key={n.k} className="py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">{n.k}</dt>
                  <dd className="mt-1 text-[15px] text-[#F5F5F7]">{n.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="lg:col-span-7 lg:col-start-5">
            <Reveal>
              <p className="font-heading text-[clamp(1.5rem,2.6vw,2.125rem)] font-medium leading-[1.3] tracking-[-0.025em] text-[#F5F5F7]">
                {SITE.name} started with a simple frustration: watching capable people lose hours every day to work a
                computer should be doing.
              </p>
            </Reveal>
            <div className="mt-10 space-y-6 text-[17px] leading-[1.8] text-[#A1A1AA]">
              <Reveal>
                <p>
                  Copying details from a form into a CRM. Answering the same customer question for the fifth time before
                  lunch. Building the same report every Monday. None of it is difficult — it&apos;s just endless, and it
                  quietly takes the hours a growing business needs most.
                </p>
              </Reveal>
              <Reveal>
                <p>
                  So we build the systems that take it away: websites that bring the right people in, AI agents that
                  answer them properly, and automations that move everything to where it needs to go. Mostly on n8n,
                  with AI models where they genuinely help, and Next.js for the web.
                </p>
              </Reveal>
              <Reveal>
                <p>
                  We stay deliberately small. When you work with us, you talk to the engineer building your system — not
                  an account manager or a ticket queue. Decisions are faster, nothing gets lost in translation, and you
                  aren&apos;t paying for layers you don&apos;t need.
                </p>
              </Reveal>
              <Reveal>
                <p className="text-[#F5F5F7]">
                  Everything we build is documented, lives in your accounts, and is handed over completely. The goal is
                  a business that runs better whether we&apos;re around or not.
                </p>
              </Reveal>
            </div>
            <Reveal className="mt-10">
              <p className="font-heading text-base font-semibold text-[#F5F5F7]">{SITE.consultant}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">Founder, {SITE.name}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="section-padding border-t border-white/[0.08]">
        <div className="container-wide">
          <SectionHead index="01" label="What we work with" title="A small toolkit, used well." />
          <ul className="mt-16 grid border-t border-white/[0.08] sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {STACK.map((s, i) => (
              <Reveal
                as="li"
                key={s.name}
                delay={i * 0.06}
                className="border-b border-white/[0.08] py-8 sm:px-6 sm:[&:nth-child(odd)]:pl-0 lg:border-b-0 lg:border-r lg:[&:last-child]:border-r-0 lg:[&:nth-child(odd)]:pl-6 lg:first:pl-0"
              >
                <h3 className="font-heading text-2xl font-semibold tracking-[-0.025em] text-[#F5F5F7]">{s.name}</h3>
                <p className="mt-3 max-w-[32ch] text-[15px] leading-[1.7] text-[#A1A1AA]">{s.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding border-t border-white/[0.08]">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-12">
            <SectionHead index="02" label="How we think" title="Four rules we don't bend." />
          </div>
          <ol className="ledger border-y border-white/[0.08] lg:col-span-8 lg:col-start-5">
            {VALUES.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 0.05} className="grid gap-2 py-7 sm:grid-cols-12 sm:gap-x-6">
                <span className="font-mono text-[11px] tracking-[0.14em] text-[#2997FF] sm:col-span-1 sm:pt-1.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="sm:col-span-11">
                  <h3 className="font-heading text-xl font-semibold tracking-[-0.02em] text-[#F5F5F7]">{v.title}</h3>
                  <p className="mt-1.5 max-w-[56ch] text-[15px] leading-[1.7] text-[#A1A1AA]">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal className="lg:col-span-8 lg:col-start-5">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-[15px] font-medium text-[#F5F5F7] underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-[#2997FF]"
            >
              See what we build
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
