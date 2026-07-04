import type { Metadata } from "next";
import BookingView from "./booking-view";

export const metadata: Metadata = {
  title: "Book a Free Automation Audit",
  description:
    "Book a free 15-minute automation audit with RudraAI, Saturdays and Sundays. Get a custom n8n and AI agent roadmap for your business.",
  alternates: { canonical: "/booking" },
};

export default function BookingPage() {
  return <BookingView />;
}
