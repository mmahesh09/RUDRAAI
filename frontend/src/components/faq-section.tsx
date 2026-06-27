"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Faq5 } from "@/components/ui/faq-accordion";

const faqs = [
  {
    question: "How quickly can you deploy an automation for my business?",
    answer:
      "Our standard deployment time is 48 hours from the moment we agree on the workflow scope. For more complex multi-system automations involving AI agents, it can take 3–5 business days. Either way, you'll have a live, tested automation faster than any in-house team could deliver.",
  },
  {
    question: "Do I need any technical knowledge to use or manage the automations?",
    answer:
      "None at all. We build every workflow visually in n8n and document everything so your team can understand what's happening. We also provide a short walkthrough call after launch. If something ever breaks or needs changing, we handle it — that's what the ongoing support is for.",
  },
  {
    question: "What tools and platforms do you integrate with?",
    answer:
      "We integrate with 400+ tools via n8n including HubSpot, Salesforce, Slack, Gmail, Notion, Airtable, Google Sheets, Stripe, Shopify, WhatsApp, and any platform with a REST API or webhook. If your tool has an API, we can automate it.",
  },
  {
    question: "How is the free automation audit different from a sales call?",
    answer:
      "The audit is a working session, not a pitch deck. We spend 60 minutes mapping your actual workflows, identifying bottlenecks, and estimating ROI. You walk away with a documented roadmap you can act on — even if you never hire us. Most clients say it's the most useful hour they've spent on operations.",
  },
  {
    question: "What happens if an automation breaks after you deploy it?",
    answer:
      "All plans include post-launch monitoring. We set up alerting so we know before you do when something fails. For Growth and Enterprise clients, we have a 4-hour SLA response time. Bugs and breaking changes from third-party APIs are fixed at no extra cost during your support period.",
  },
  {
    question: "Can you build AI agents, not just workflow automations?",
    answer:
      "Yes — AI agent development is one of our core services. We build agentic systems using GPT-4o, Claude, and open-source LLMs that can reason, make decisions, use tools, and complete multi-step tasks autonomously. Think AI SDRs, support agents, data analysts, and internal copilots.",
  },
  {
    question: "Do you work with startups or only enterprise companies?",
    answer:
      "Both. Our Starter package is designed for 5–50 person teams tackling their first major automation. Enterprise plans suit 200+ person orgs with complex, multi-department needs. We've worked with pre-revenue startups and publicly listed companies — the common thread is that they want to operate smarter, not just bigger.",
  },
  {
    question: "Is our data safe? Where do the automations run?",
    answer:
      "We take data security seriously. All workflows run on your own self-hosted n8n instance or a dedicated cloud environment — your data never passes through our servers. We sign NDAs before any engagement and follow SOC 2-aligned practices for credential management and access control.",
  },
];

export default function FaqSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[#09090B]" />
      <div className="absolute inset-0 grid-bg opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <Faq5
          badge="FAQ"
          heading="Everything You Want to Know"
          description="Straight answers to the questions every smart operator asks before hiring an automation agency."
          faqs={faqs}
        />
      </motion.div>
    </section>
  );
}
