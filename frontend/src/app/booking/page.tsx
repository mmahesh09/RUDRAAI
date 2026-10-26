import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import BookingView from "./booking-view";

export const metadata: Metadata = pageMetadata({
  title: "Book a Free 15-Minute Automation Audit",
  description:
    "Book a free 15-minute automation audit with RudraAI on Saturday or Sunday. Get a clear, fixed-price plan for your website, AI agent or automation.",
  path: "/booking",
});

export default function BookingPage() {
  return <BookingView />;
}
