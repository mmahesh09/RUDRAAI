import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import FeedbackView from "./feedback-view";

export const metadata: Metadata = pageMetadata({
  title: "Client Feedback & Reviews",
  description:
    "What clients say about working with RudraAI on n8n workflow automation, AI agents, and business process automation projects.",
  path: "/feedback",
});

export default function FeedbackPage() {
  return <FeedbackView />;
}
