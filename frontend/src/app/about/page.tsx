import type { Metadata } from "next";
import AboutView from "./about-view";

export const metadata: Metadata = {
  title: "About — An Engineer-Led AI Studio",
  description:
    "RudraAI is a small, engineer-led studio in Hyderabad building websites, AI agents and n8n automations — documented, owned by you, and built to keep running.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutView />;
}
