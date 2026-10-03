import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import { ArrowLeft } from "lucide-react";
import { posts, getPostBySlug } from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — RudraAI Blog`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image, width: 1200, height: 630 }],
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: { "@type": "Organization", name: "RudraAI", url: "https://www.rudraai.online" },
    publisher: { "@type": "Organization", name: "RudraAI", logo: { "@type": "ImageObject", url: "https://www.rudraai.online/logo.png" } },
  };

  return (
    <main className="bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Navbar />

      <article>
        <header className="container-wide pt-32 md:pt-40">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#A1A1AA] transition-colors hover:text-[#F5F5F7]"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              All posts
            </Link>
            <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">
              <span className="text-[#BF5AF2]">{post.category}</span>&nbsp;&nbsp;·&nbsp;&nbsp;{post.date}&nbsp;&nbsp;·&nbsp;&nbsp;{post.readTime}
            </p>
            <h1 className="mt-5 font-heading text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-[#F5F5F7] [text-wrap:balance]">
              {post.title}
            </h1>
            <p className="mt-6 text-xl leading-[1.6] text-[#A1A1AA]">{post.excerpt}</p>
          </div>
        </header>

        <div className="container-wide mt-12 md:mt-16">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-[#0B0B0C]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt="" className="aspect-[40/21] w-full object-cover" />
          </div>
        </div>

        <div className="container-wide py-16 md:py-24">
          <div className="prose-blog mx-auto max-w-[68ch]" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>

      <CTASection />
      <Footer />
    </main>
  );
}
