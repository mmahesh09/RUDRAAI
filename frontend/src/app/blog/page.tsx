import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import type { Metadata } from "next";
import { posts, categoryColors } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — RudraAI | Automation Tips & AI Insights",
  description:
    "Practical guides on n8n, AI agents, workflow automation, and business process optimization from the RudraAI team.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <main>
      <Navbar />

      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative z-10 container-wide text-center">
          <Badge className="mb-4">Knowledge Hub</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mb-4 leading-tight">
            Automation <span className="text-gradient-orange">Insights</span>
          </h1>
          <p className="text-[#A1A1AA] font-body text-xl max-w-2xl mx-auto">
            Practical guides, tutorials, and strategies from my work building real automations.
          </p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-wide">
          {/* Featured post */}
          {featured && (
            <div className="mb-10">
              <Link href={`/blog/${featured.slug}`} className="group block">
                <div className="relative rounded-3xl neo-card overflow-hidden hover:border-white/12 transition-all duration-300">
                  <div className="grid md:grid-cols-2 items-center gap-0">
                    <div className="relative h-64 md:h-full overflow-hidden">
                      <img
                        src={featured.image}
                        alt={featured.title}
                        className="w-full h-full object-cover opacity-50 group-hover:opacity-65 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#111117] hidden md:block" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111117] via-[#111117]/30 to-transparent md:hidden" />
                    </div>
                    <div className="p-8 md:p-10">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge
                          style={{
                            color: categoryColors[featured.category],
                            background: `${categoryColors[featured.category]}15`,
                            borderColor: `${categoryColors[featured.category]}30`,
                          }}
                        >
                          {featured.category}
                        </Badge>
                        <Badge variant="default" className="text-[10px]">Featured</Badge>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-heading font-black text-white mb-3 group-hover:text-[#FF6B00] transition-colors leading-tight">
                        {featured.title}
                      </h2>
                      <p className="text-[#A1A1AA] font-body leading-relaxed mb-5">{featured.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm font-body text-[#71717A]">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featured.readTime}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{featured.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Rest of posts */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <div className="rounded-2xl neo-card overflow-hidden hover:border-white/12 transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111117] via-[#111117]/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span
                        className="text-[10px] font-body px-2 py-1 rounded"
                        style={{
                          color: categoryColors[post.category] || "#A1A1AA",
                          background: `${categoryColors[post.category] || "#A1A1AA"}15`,
                          border: `1px solid ${categoryColors[post.category] || "#A1A1AA"}30`,
                        }}
                      >
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-heading font-bold text-white mb-2 group-hover:text-[#FF6B00] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#A1A1AA] font-body leading-relaxed mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs font-body text-[#71717A]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                        <span>{post.date}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:text-[#FF6B00] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
