"use client";

import type React from "react";
import { Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface PricingFeature {
  text: string;
  hasInfo?: boolean;
}

export interface PricingTier {
  name: string;
  description: string;
  price?: number;
  inrPrice?: number;
  priceLabel?: string;
  billingPeriod?: string;
  buttonText: string;
  buttonHref?: string;
  buttonVariant?: "default" | "secondary" | "outline";
  isPrimary?: boolean;
  features: PricingFeature[];
  hasAnnualToggle?: boolean;
  creditOptions?: string[];
  defaultCredits?: string;
  featuresTitle?: string;
}

export interface PricingProps {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  tiers: PricingTier[];
  footerTitle?: string;
  footerDescription?: string;
  footerButtonText?: string;
  footerButtonHref?: string;
  className?: string;
}

export function Pricing({
  icon,
  title,
  subtitle,
  tiers,
  footerTitle,
  footerDescription,
  footerButtonText,
  footerButtonHref = "#",
  className,
}: PricingProps) {
  const [annualBilling, setAnnualBilling] = useState<Record<string, boolean>>({});
  const [selectedCredits, setSelectedCredits] = useState<Record<string, string>>({});
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  return (
    <div className={cn("w-full py-16 px-4", className)}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {icon && <div className="flex justify-center mb-4">{icon}</div>}
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-white mb-4">{title}</h1>
          <p className="text-[#A1A1AA] font-body text-lg max-w-2xl mx-auto mb-8">{subtitle}</p>

          {/* Currency Toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/[0.05] border border-white/10">
            <button
              onClick={() => setCurrency("USD")}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-subheading font-semibold transition-all duration-200",
                currency === "USD"
                  ? "bg-[#FF6B00] text-white shadow-md"
                  : "text-[#71717A] hover:text-white"
              )}
            >
              $ USD
            </button>
            <button
              onClick={() => setCurrency("INR")}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-subheading font-semibold transition-all duration-200",
                currency === "INR"
                  ? "bg-[#FF6B00] text-white shadow-md"
                  : "text-[#71717A] hover:text-white"
              )}
            >
              ₹ INR
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              className={cn(
                "p-6 flex flex-col",
                tier.isPrimary && "ring-2 ring-[#FF6B00] shadow-[0_0_40px_rgba(255,107,0,0.15)]"
              )}
            >
              {/* Tier Header */}
              <div className="mb-6">
                {tier.isPrimary && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] text-xs font-subheading font-semibold mb-3">
                    Most Popular
                  </div>
                )}
                <h2 className="text-xl font-heading font-bold text-white mb-2">{tier.name}</h2>
                <p className="text-[#A1A1AA] font-body text-sm leading-relaxed">{tier.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                {tier.price !== undefined ? (
                  <div className="flex items-baseline gap-1">
                    {currency === "USD" ? (
                      <span className="text-4xl font-heading font-black text-white">${tier.price.toLocaleString()}</span>
                    ) : (
                      <span className="text-4xl font-heading font-black text-white">
                        ₹{(tier.inrPrice ?? Math.round(tier.price * 84)).toLocaleString("en-IN")}
                      </span>
                    )}
                    <span className="text-[#71717A] font-body text-sm">{tier.billingPeriod || "/mo"}</span>
                  </div>
                ) : (
                  <div className="text-xl font-heading font-bold text-white">{tier.priceLabel}</div>
                )}
              </div>

              {/* Annual Toggle */}
              {tier.hasAnnualToggle && (
                <div className="mb-6 flex items-center gap-3">
                  <button
                    onClick={() =>
                      setAnnualBilling((prev) => ({
                        ...prev,
                        [tier.name]: !prev[tier.name],
                      }))
                    }
                    className={cn(
                      "w-11 h-6 rounded-full relative transition-colors",
                      annualBilling[tier.name]
                        ? "bg-[#FF6B00]"
                        : "bg-white/10"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                        annualBilling[tier.name] && "translate-x-5"
                      )}
                    />
                  </button>
                  <span className="text-sm font-body text-[#A1A1AA]">Annual billing (save 20%)</span>
                </div>
              )}

              {/* CTA Button */}
              <a href={tier.buttonHref || "#"}>
                <Button
                  className={cn(
                    "w-full mb-6",
                    tier.isPrimary
                      ? ""
                      : "bg-white/[0.05] border border-white/10 text-white hover:bg-white/[0.08] hover:border-white/20"
                  )}
                  variant={tier.isPrimary ? "default" : "secondary"}
                >
                  {tier.buttonText}
                </Button>
              </a>

              {/* Credit Options */}
              {tier.creditOptions && tier.creditOptions.length > 0 && (
                <div className="mb-6">
                  <Select
                    value={selectedCredits[tier.name] || tier.defaultCredits || tier.creditOptions[0]}
                    onValueChange={(value) =>
                      setSelectedCredits((prev) => ({ ...prev, [tier.name]: value }))
                    }
                  >
                    <SelectTrigger className="w-full bg-white/[0.05] border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111117] border-white/10 text-white">
                      {tier.creditOptions.map((option) => (
                        <SelectItem key={option} value={option} className="focus:bg-white/10 text-white">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Features Title */}
              {tier.featuresTitle && (
                <div className="mb-4 text-xs font-subheading font-semibold text-[#71717A] uppercase tracking-wider">
                  {tier.featuresTitle}
                </div>
              )}

              {/* Features List */}
              <div className="space-y-3 flex-1">
                {tier.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-body text-[#A1A1AA] leading-relaxed flex-1">
                      {feature.text}
                    </span>
                    {feature.hasInfo && (
                      <Info className="w-3.5 h-3.5 text-[#71717A] flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Banner */}
        {footerTitle && (
          <Card className="p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-heading font-bold text-white mb-2">{footerTitle}</h3>
              {footerDescription && (
                <p className="text-[#A1A1AA] font-body text-sm">{footerDescription}</p>
              )}
            </div>
            {footerButtonText && (
              <a href={footerButtonHref}>
                <Button variant="outline" className="whitespace-nowrap">
                  {footerButtonText}
                </Button>
              </a>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
