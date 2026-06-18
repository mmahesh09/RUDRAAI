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
  { src: "https://html.tailus.io/blocks/customers/nvidia.svg", alt: "Nvidia Logo", height: 20 },
  { src: "https://html.tailus.io/blocks/customers/column.svg", alt: "Column Logo", height: 16 },
  { src: "https://html.tailus.io/blocks/customers/github.svg", alt: "GitHub Logo", height: 16 },
  { src: "https://html.tailus.io/blocks/customers/nike.svg", alt: "Nike Logo", height: 20 },
  { src: "https://html.tailus.io/blocks/customers/lemonsqueezy.svg", alt: "Lemon Squeezy Logo", height: 20 },
  { src: "https://html.tailus.io/blocks/customers/laravel.svg", alt: "Laravel Logo", height: 16 },
  { src: "https://html.tailus.io/blocks/customers/lilly.svg", alt: "Lilly Logo", height: 28 },
  { src: "https://html.tailus.io/blocks/customers/openai.svg", alt: "OpenAI Logo", height: 24 },
];

export function CustomersSectionDemo() {
  return <CustomersSection customers={customers} />;
}
