import type { Metadata } from "next";
import AboutView from "./about-view";

export const metadata: Metadata = {
  title: "About RudraAI — AI Automation Agency",
  description:
    "Meet the team behind RudraAI and why we build production-grade n8n workflows and AI agents instead of fragile no-code demos.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutView />;
}
