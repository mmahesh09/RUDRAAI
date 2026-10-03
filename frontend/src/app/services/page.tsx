import type { Metadata } from "next";
import ServicesView from "./services-view";

export const metadata: Metadata = {
  title: "Services — Websites, AI Agents & Automations",
  description:
    "Fast Next.js websites, AI agents trained on your data, and n8n automations between your tools. Fixed-price, documented, and owned by you. Automations live in 3–7 days.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <ServicesView />;
}
