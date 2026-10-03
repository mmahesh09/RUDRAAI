import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import PageHero from "@/components/site/page-hero";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — Practical Notes on AI Agents & Automation",
  description:
    "Plain-English guides on n8n, AI agents, websites and workflow automation — what works, what it costs, and how to start — from the RudraAI studio.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.slug !== featured?.slug);

  return (
    <main className="bg-black">
      <Navbar />
      <PageHero
        label="Blog"
        title="Notes from the workbench."
        intro="Practical writing on AI agents, automation and the web — what we've learned building them, without the hype."
      />

      <section className="pb-24 md:pb-32">
        <div className="container-wide">
          {/* Featured — image-led, full width */}
          {featured && (
            <Link href={`/blog/${featured.slug}`} className="group grid gap-8 border-t border-white/[0.08] pt-10 lg:grid-cols-12 lg:gap-x-8">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#0B0B0C] lg:col-span-7">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.image}
                  alt=""
                  className="h-full w-full object-cover opacity-80 transition-[opacity,transform] duration-700 group-hover:scale-[1.02] group-hover:opacity-100"
                />
              </div>
              <div className="flex flex-col justify-end lg:col-span-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">
                  <span className="text-[#BF5AF2]">Featured</span>&nbsp;&nbsp;·&nbsp;&nbsp;{featured.category}
                </p>
                <h2 className="mt-4 font-heading text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#F5F5F7] transition-colors group-hover:text-[#BF5AF2]">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-[48ch] text-[15px] leading-[1.7] text-[#A1A1AA]">{featured.excerpt}</p>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-[#8A8A93]">
                  {featured.date} · {featured.readTime}
                </p>
              </div>
            </Link>
          )}

          {/* Index — one post per ruled row */}
          <ol className="mt-20 border-b border-white/[0.08]">
            {rest.map((post) => (
              <li key={post.slug} className="border-t border-white/[0.08]">
                <Link href={`/blog/${post.slug}`} className="group grid gap-3 py-8 md:grid-cols-12 md:gap-x-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#8A8A93] md:col-span-2 md:pt-1.5">{post.date}</p>
                  <div className="md:col-span-7">
                    <h3 className="font-heading text-xl font-semibold leading-snug tracking-[-0.02em] text-[#F5F5F7] transition-colors group-hover:text-[#BF5AF2] sm:text-2xl">
                      {post.title}
                    </h3>
                    <p className="mt-2 max-w-[60ch] text-[15px] leading-[1.7] text-[#A1A1AA]">{post.excerpt}</p>
                  </div>
                  <div className="flex items-start justify-between gap-4 md:col-span-3 md:justify-end">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#A1A1AA] md:pt-1.5">
                      {post.category} · {post.readTime}
                    </p>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-[#A1A1AA] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#BF5AF2]" aria-hidden="true" />
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
