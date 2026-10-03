import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ArrowLeft, ArrowUpRight, Plus } from "lucide-react";
import { posts, getPostBySlug } from "@/lib/posts";

const BASE = "https://www.rudraai.online";

interface Props {
  params: Promise<{ slug: string }>;
}

/** Gives every <h2> an id and returns them as a table of contents. */
function withHeadingIds(html: string) {
  const toc: { id: string; text: string }[] = [];
  const used = new Set<string>();
  const out = html.replace(/<h2>(.*?)<\/h2>/g, (_, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim();
    const base = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    toc.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, toc };
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const image = { url: post.image, width: 1200, height: 630, alt: post.imageAlt };
  return {
    // The root layout's title template appends " | RudraAI"
    title: post.seoTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `/blog/${slug}`,
      images: [image],
      type: "article",
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      section: post.category,
      tags: post.keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { html, toc } = withHeadingIds(post.content);
  const related = posts.filter((p) => p.slug !== post.slug);
  const url = `${BASE}/blog/${post.slug}`;
  const wordCount = post.content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription,
      image: [`${BASE}${post.image}`],
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      articleSection: post.category,
      keywords: post.keywords.join(", "),
      wordCount,
      inLanguage: "en",
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: { "@type": "Organization", name: "RudraAI", url: BASE },
      publisher: { "@type": "Organization", name: "RudraAI", logo: { "@type": "ImageObject", url: `${BASE}/logo.png` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <main className="bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Navbar />

      <article>
        <header className="container-wide pt-32 md:pt-40">
          <div className="mx-auto max-w-3xl">
            <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <li>
                  <Link href="/" className="transition-colors hover:text-[#F5F5F7]">Home</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/blog" className="inline-flex items-center gap-1.5 transition-colors hover:text-[#F5F5F7]">
                    <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-[#BF5AF2]">{post.category}</li>
              </ol>
            </nav>
            <h1 className="mt-10 font-heading text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-[#F5F5F7] [text-wrap:balance]">
              {post.title}
            </h1>
            <p className="mt-6 text-xl leading-[1.6] text-[#A1A1AA]">{post.excerpt}</p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">
              By RudraAI&nbsp;&nbsp;·&nbsp;&nbsp;
              <time dateTime={post.datePublished}>{post.date}</time>&nbsp;&nbsp;·&nbsp;&nbsp;{post.readTime}
            </p>
          </div>
        </header>

        <div className="container-wide mt-12 md:mt-16">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-[#0B0B0C]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.imageAlt}
              width={1200}
              height={630}
              fetchPriority="high"
              className="aspect-[40/21] w-full object-cover"
            />
          </div>
        </div>

        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-12 lg:gap-x-10">
            {/* Table of contents — sticky beside the article on desktop */}
            <aside className="hidden lg:col-span-3 lg:block">
              <nav aria-label="On this page" className="sticky top-28">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">On this page</p>
                <ol className="mt-4 space-y-2.5 border-l border-white/[0.08] text-[13px] leading-snug">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-3 text-[#8A8A93] transition-colors hover:border-[#BF5AF2] hover:text-[#F5F5F7]">
                        {h.text}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="#faq" className="-ml-px block border-l border-transparent pl-3 text-[#8A8A93] transition-colors hover:border-[#BF5AF2] hover:text-[#F5F5F7]">
                      FAQ
                    </a>
                  </li>
                </ol>
              </nav>
            </aside>

            <div className="min-w-0 lg:col-span-9">
              {/* Key takeaways — the short answer, up front */}
              <section aria-labelledby="takeaways" className="rounded-2xl border border-white/[0.08] bg-[#0B0B0C] p-6 md:p-8">
                <h2 id="takeaways" className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#BF5AF2]">Key takeaways</h2>
                <ul className="mt-4 space-y-3">
                  {post.takeaways.map((t) => (
                    <li key={t} className="flex gap-3 text-[15px] leading-[1.7] text-[#F5F5F7]">
                      <span className="mt-[0.7em] h-1 w-1 shrink-0 rotate-45 bg-[#BF5AF2]" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Mobile table of contents */}
              <details className="group mt-6 rounded-2xl border border-white/[0.08] px-6 py-4 lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-[#A1A1AA] [&::-webkit-details-marker]:hidden">
                  On this page
                  <Plus className="h-4 w-4 transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
                </summary>
                <ol className="mt-4 space-y-2 text-[14px]">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="text-[#A1A1AA] hover:text-[#F5F5F7]">{h.text}</a>
                    </li>
                  ))}
                </ol>
              </details>

              <div className="prose-blog mt-12 max-w-[68ch]" dangerouslySetInnerHTML={{ __html: html }} />

              {/* FAQ — mirrors the FAQPage structured data */}
              <section id="faq" aria-labelledby="faq-title" className="mt-20 max-w-[68ch] scroll-mt-28">
                <h2 id="faq-title" className="font-heading text-[1.625rem] font-bold tracking-[-0.02em] text-[#F5F5F7]">
                  Frequently asked questions
                </h2>
                <div className="ledger mt-6 border-y border-white/[0.08]">
                  {post.faqs.map((f) => (
                    <details key={f.q} className="group py-1">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                        <h3 className="font-heading text-lg font-semibold tracking-[-0.02em] text-[#F5F5F7]">{f.q}</h3>
                        <Plus className="h-5 w-5 shrink-0 text-[#A1A1AA] transition-transform duration-300 group-open:rotate-45 group-open:text-[#BF5AF2]" aria-hidden="true" />
                      </summary>
                      <p className="pb-6 text-[15px] leading-[1.75] text-[#A1A1AA]">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </article>

      {/* Keep reading — internal links to the rest of the series */}
      <section aria-labelledby="keep-reading" className="pb-24 md:pb-32">
        <div className="container-wide">
          <div className="mx-auto max-w-5xl">
            <h2 id="keep-reading" className="border-t border-white/[0.08] pt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">
              Keep reading
            </h2>
            <ol className="mt-6 border-b border-white/[0.08]">
              {related.map((p) => (
                <li key={p.slug} className="border-t border-white/[0.08] first:border-t-0">
                  <Link href={`/blog/${p.slug}`} className="group grid gap-3 py-8 md:grid-cols-12 md:gap-x-8">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#BF5AF2] md:col-span-2 md:pt-1.5">{p.category}</p>
                    <div className="md:col-span-9">
                      <h3 className="font-heading text-xl font-semibold leading-snug tracking-[-0.02em] text-[#F5F5F7] transition-colors group-hover:text-[#BF5AF2] sm:text-2xl">
                        {p.title}
                      </h3>
                      <p className="mt-2 max-w-[60ch] text-[15px] leading-[1.7] text-[#A1A1AA]">{p.excerpt}</p>
                    </div>
                    <div className="flex md:col-span-1 md:justify-end">
                      <ArrowUpRight className="h-5 w-5 text-[#A1A1AA] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#BF5AF2]" aria-hidden="true" />
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
