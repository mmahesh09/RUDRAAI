import type { Metadata } from "next";
import FeedbackView from "./feedback-view";

export const metadata: Metadata = {
  title: "Client Feedback — RudraAI Automation Projects",
  description:
    "What clients say about working with RudraAI on n8n workflow automation, AI agents, and business process automation projects.",
  alternates: { canonical: "/feedback" },
};

export default function FeedbackPage() {
  return <FeedbackView />;
}
