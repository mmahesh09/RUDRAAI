import type { Metadata } from "next";
import ServicesView from "./services-view";

export const metadata: Metadata = {
  title: "AI Automation Services — n8n & AI Agent Development",
  description:
    "Custom n8n workflow automation, AI agent development, and CRM/WhatsApp/Slack integrations, live in 3–7 days. See RudraAI's full service breakdown.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <ServicesView />;
}
