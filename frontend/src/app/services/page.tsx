import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import ServicesView from "./services-view";

export const metadata: Metadata = pageMetadata({
  title: "Services — Websites, AI Agents & Automations",
  description:
    "Fast Next.js websites, custom AI agents trained on your data, and n8n workflow automations. Fixed price, documented and yours to keep. Book a free call.",
  path: "/services",
});

export default function ServicesPage() {
  return <ServicesView />;
}
