import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import PageHero from "@/components/site/page-hero";
import SectionHead from "@/components/site/section-head";
import Reveal from "@/components/site/reveal";
import { SERVICES, SITE } from "@/lib/site";
import { SERVICE_PAGES, SERVICE_SLUGS, type ServiceSlug } from "@/lib/service-pages";
import { BASE_URL, breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

function getService(slug: string) {
  const page = SERVICE_PAGES[slug as ServiceSlug];
  const summary = SERVICES.find((s) => s.slug === slug);
  return page && summary ? { page, summary } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.page.seoTitle,
    description: service.page.seoDescription,
    path: `/services/${slug}`,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const { page, summary } = service;
  const others = SERVICES.filter((s) => s.slug !== slug);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.schemaName,
    serviceType: page.serviceType,
    description: page.seoDescription,
    url: `${BASE_URL}/services/${slug}`,
    provider: { "@id": `${BASE_URL}/#organization` },
    areaServed: ["IN", "Worldwide"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${summary.name} deliverables`,
      itemListElement: summary.deliverables.map((d) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: d },
      })),
    },
  };

  const schemas = [
    serviceSchema,
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: summary.name, path: `/services/${slug}` },
    ]),
    faqSchema(page.faqs),
  ];

  return (
    <main className="bg-black">
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <Navbar />

      <PageHero
        label="Services"
        title={
          <span>
            {page.h1} <span className="text-[#BF5AF2]">{page.h1Accent}</span>
          </span>
        }
        intro={page.intro}
      >
        <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[12px] uppercase tracking-[0.12em] text-[#8A8A93]">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-[#F5F5F7]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/services" className="hover:text-[#F5F5F7]">Services</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#F5F5F7]">{summary.name}</li>
          </ol>
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/booking"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[#8944AB] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#7A3A9A]"
          >
            Book a free call · {SITE.call.short}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#8A8A93]">
            {summary.timeline} typical · fixed price · {SITE.supportDays} days free fixes
          </p>
        </div>
      </PageHero>

      {/* 01 — Process */}
      <section aria-labelledby="process" className="border-t border-white/[0.08] py-24 md:py-32">
        <div className="container-wide">
          <SectionHead
            index="01"
            label="How we build it"
            title={<span id="process">How we create your {summary.name.toLowerCase()}</span>}
            intro="A clear, fixed-price process. You see and approve each stage before the next one starts."
          />
          <ol className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
            {page.process.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 0.06} className="bg-black p-7 md:p-8">
                <p className="font-mono text-[12px] text-[#BF5AF2]">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 font-heading text-xl font-semibold tracking-[-0.02em] text-[#F5F5F7]">{step.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.65] text-[#A1A1AA]">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 02 — Tech stack */}
      <section aria-labelledby="stack" className="border-t border-white/[0.08] py-24 md:py-32">
        <div className="container-wide">
          <SectionHead
            index="02"
            label="Tech stack"
            title={<span id="stack">The tools behind your {summary.name.toLowerCase()}</span>}
            intro="Proven, well-supported technology chosen for speed, reliability and no lock-in."
          />
          <dl className="ledger mt-16 border-y border-white/[0.08]">
            {page.stack.map((g, i) => (
              <Reveal key={g.group} delay={i * 0.05} className="grid gap-4 py-7 md:grid-cols-12 md:gap-8">
                <dt className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#8A8A93] md:col-span-3 md:pt-1.5">{g.group}</dt>
                <dd className="md:col-span-9 md:grid md:grid-cols-9 md:gap-8">
                  <ul className="flex flex-wrap gap-2 md:col-span-5">
                    {g.tools.map((t) => (
                      <li key={t} className="rounded-full border border-white/[0.14] px-3.5 py-1.5 text-[14px] text-[#F5F5F7]">
                        {t}
                      </li>
                    ))}
                    {g.link && (
                      <li>
                        <a
                          href={g.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#BF5AF2]/40 px-3.5 py-1.5 text-[14px] text-[#BF5AF2] transition-colors hover:border-[#BF5AF2] hover:text-[#F5F5F7]"
                        >
                          {g.link.label}
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                        </a>
                      </li>
                    )}
                  </ul>
                  <p className="mt-4 text-[15px] leading-[1.65] text-[#A1A1AA] md:col-span-4 md:mt-0">{g.why}</p>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* 03 — Growth */}
      <section aria-labelledby="growth" className="border-t border-white/[0.08] py-24 md:py-32">
        <div className="container-wide">
          <SectionHead
            index="03"
            label="How we help you grow"
            title={
              <span id="growth">
                How our team helps your business <span className="text-[#BF5AF2]">grow.</span>
              </span>
            }
            intro={summary.detail}
          />
          <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-x-8">
            <ul className="grid gap-10 sm:grid-cols-2 lg:col-span-7">
              {page.growth.map((o, i) => (
                <Reveal as="li" key={o.title} delay={i * 0.06}>
                  <h3 className="font-heading text-lg font-semibold tracking-[-0.02em] text-[#F5F5F7]">{o.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.65] text-[#A1A1AA]">{o.body}</p>
                </Reveal>
              ))}
            </ul>
            <div className="grid content-start gap-12 lg:col-span-4 lg:col-start-9">
              <Reveal>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">What you get</h3>
                <ul className="ledger mt-4 border-y border-white/[0.08]">
                  {summary.deliverables.map((d) => (
                    <li key={d} className="py-3.5 text-[15px] text-[#F5F5F7]">{d}</li>
                  ))}
                  <li className="py-3.5 text-[15px] text-[#F5F5F7]">{SITE.supportDays} days of free fixes</li>
                </ul>
              </Reveal>
              <Reveal delay={0.08}>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">For example</h3>
                <ul className="ledger mt-4 border-y border-white/[0.08]">
                  {page.examples.map((e) => (
                    <li key={e} className="py-3.5 text-[15px] leading-snug text-[#A1A1AA]">{e}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — FAQ */}
      <section aria-labelledby="faq" className="border-t border-white/[0.08] py-24 md:py-32">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-4">
            <p className="eyebrow"><span className="text-[#BF5AF2]">04&nbsp;&nbsp;</span>Questions</p>
            <h2 id="faq" className="mt-6 font-heading text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-[#F5F5F7]">
              {summary.name}: common questions
            </h2>
          </div>
          <div className="ledger border-y border-white/[0.08] lg:col-span-7 lg:col-start-6">
            {page.faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[17px] font-medium text-[#F5F5F7] [&::-webkit-details-marker]:hidden">
                  <h3>{f.q}</h3>
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#8A8A93] transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-[#A1A1AA]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related — internal links to sibling services and supporting content */}
      <section aria-labelledby="related" className="border-t border-white/[0.08] py-20">
        <div className="container-wide grid gap-10 md:grid-cols-2">
          <div>
            <h2 id="related" className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">Other services</h2>
            <ul className="ledger mt-4 border-y border-white/[0.08]">
              {others.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="group flex items-center justify-between gap-4 py-4">
                    <span>
                      <span className="block font-heading text-xl font-semibold tracking-[-0.02em] text-[#F5F5F7]">{s.name}</span>
                      <span className="mt-1 block text-[14px] text-[#A1A1AA]">{s.line}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#8A8A93] transition-transform group-hover:translate-x-0.5 group-hover:text-[#F5F5F7]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">Keep reading</h2>
            <ul className="ledger mt-4 border-y border-white/[0.08]">
              {page.related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="group flex items-center justify-between gap-4 py-4 text-[16px] text-[#F5F5F7]">
                    {r.label}
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#8A8A93] transition-transform group-hover:translate-x-0.5 group-hover:text-[#F5F5F7]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
