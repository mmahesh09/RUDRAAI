import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import AboutView from "./about-view";

export const metadata: Metadata = pageMetadata({
  title: "About Us — Engineer-Led AI Studio, Hyderabad",
  description:
    "RudraAI is a small, engineer-led studio in Hyderabad building websites, AI agents and n8n automations — documented, owned by you, and built to keep running.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutView />;
}
