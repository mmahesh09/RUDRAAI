"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AnimatedGroup } from "@/components/ui/animated-group";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export interface CustomerLogo {
  src: string;
  alt: string;
  height: number;
}

interface CustomersSectionProps {
  customers: CustomerLogo[];
  className?: string;
  title?: string;
}

export function CustomersSection({
  customers = [],
  className,
  title = "Trusted by innovative teams worldwide",
}: CustomersSectionProps) {
  return (
    <section className={`pb-16 pt-8 md:pb-24 ${className ?? ""}`}>
      <div className="group relative mx-auto max-w-5xl px-6">
        {title && (
          <p className="text-center text-sm font-subheading font-medium text-[#71717A] uppercase tracking-widest mb-10">
            {title}
          </p>
        )}
        <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
          <Link
            href="/contact"
            className="flex items-center gap-1 text-sm font-body text-[#FF6B00] duration-150 hover:opacity-75"
          >
            <span>Become a partner</span>
            <ChevronRight className="size-3" />
          </Link>
        </div>
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.5,
                },
              },
            },
            ...transitionVariants,
          }}
          className="group-hover:blur-sm mx-auto mt-4 grid max-w-3xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-40 sm:gap-x-16 sm:gap-y-12"
        >
          {customers.map((logo, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                className="mx-auto h-auto w-fit opacity-50 hover:opacity-80 transition-opacity duration-300 invert"
                src={logo.src}
                alt={logo.alt}
                height={logo.height}
                width="auto"
              />
            </div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}

const customers = [
  { src: "https://cdn.simpleicons.org/n8n", alt: "n8n", height: 24 },
  { src: "https://cdn.simpleicons.org/notion", alt: "Notion", height: 24 },
  { src: "https://cdn.simpleicons.org/slack", alt: "Slack", height: 22 },
  { src: "https://cdn.simpleicons.org/zoom", alt: "Zoom", height: 22 },
  { src: "https://cdn.simpleicons.org/googlesheets", alt: "Google Sheets", height: 22 },
  { src: "https://cdn.simpleicons.org/openai", alt: "OpenAI", height: 22 },
  { src: "https://cdn.simpleicons.org/docker", alt: "Docker", height: 24 },
  { src: "https://cdn.simpleicons.org/github", alt: "GitHub", height: 22 },
];

export function CustomersSectionDemo() {
  return (
    <CustomersSection
      customers={customers}
      title="Technologies & integrations we build with"
    />
  );
}
