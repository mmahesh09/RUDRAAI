import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, ArrowLeft } from "lucide-react";
import { posts, getPostBySlug, categoryColors } from "@/lib/posts";

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

  const color = categoryColors[post.category] ?? "#A1A1AA";

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
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Navbar />

      {/* Hero */}
      <div className="relative pt-32 pb-0 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative z-10 container-wide">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-body text-[#71717A] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Category + meta */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Badge
              style={{
                color,
                background: `${color}15`,
                borderColor: `${color}30`,
              }}
            >
              {post.category}
            </Badge>
            <span className="flex items-center gap-1 text-sm font-body text-[#71717A]">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1 text-sm font-body text-[#71717A]">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white leading-tight mb-6 max-w-4xl">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-[#A1A1AA] font-body text-lg max-w-3xl mb-10 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </div>

      {/* Hero image */}
      <div className="relative w-full" style={{ maxHeight: "480px", overflow: "hidden" }}>
        <img
          src={post.image}
          alt={post.title}
          className="w-full object-cover opacity-60"
          style={{ maxHeight: "480px" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D14] via-[#0D0D14]/20 to-transparent" />
      </div>

      {/* Article body */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <div
              className="prose-blog"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
