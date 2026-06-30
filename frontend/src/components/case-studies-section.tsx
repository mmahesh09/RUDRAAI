"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { caseStudies } from "@/lib/case-studies";

export default function CaseStudiesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="case-studies" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-25" />

      <div ref={ref} className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <Badge className="mb-4">Case Studies</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white mb-4 leading-tight">
            Real Automations.{" "}
            <span className="text-gradient-orange">Real Results.</span>
          </h2>
          <p className="text-[#A1A1AA] font-body text-lg max-w-2xl mx-auto leading-relaxed">
            Every engagement starts with a deep-dive audit. Here&apos;s what we&apos;ve built
            for companies just like yours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {caseStudies.map((study, i) => (
            <motion.div
              key={study.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group relative rounded-2xl neo-card overflow-hidden hover:border-white/12 transition-all duration-300"
            >
              {/* Top gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${study.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111117] via-[#111117]/60 to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="text-[10px]">{study.industry}</Badge>
                </div>
              </div>

              <div className="relative z-10 p-5">
                <h3 className="text-lg font-heading font-bold text-white mb-2 group-hover:text-[#FF6B00] transition-colors">
                  {study.title}
                </h3>
                <p className="text-sm text-[#A1A1AA] font-body leading-relaxed mb-5">
                  {study.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {study.metrics.map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <div key={metric.label} className="text-center p-2 rounded-lg bg-white/03 border border-white/05">
                        <div className="font-heading font-bold text-base" style={{ color: metric.color }}>
                          {metric.value}
                        </div>
                        <div className="text-[9px] text-[#71717A] font-body leading-tight mt-0.5">{metric.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {study.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-body text-[#71717A] px-2 py-0.5 rounded bg-white/05 border border-white/06">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/case-studies/${study.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-subheading font-medium text-[#A1A1AA] group-hover:text-[#FF6B00] transition-colors"
                >
                  Read full case study
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm font-subheading font-medium text-[#A1A1AA] hover:text-white transition-colors"
          >
            View all case studies
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
