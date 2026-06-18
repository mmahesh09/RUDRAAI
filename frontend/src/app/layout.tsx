import type { Metadata } from "next";
import { Montserrat, Raleway, DM_Sans } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";
import CookieConsent from "@/components/cookie-consent";
import { Providers } from "@/components/providers";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "RudraAI — Stop Hiring for Repetitive Work. Deploy AI Automations.",
  description:
    "RudraAI builds intelligent n8n workflows and AI agents that run 24/7, eliminate human error, and scale with your business. Book a free automation audit today.",
  keywords: [
    "AI automation",
    "n8n workflow",
    "AI agents",
    "business process automation",
    "workflow engineering",
    "AI consulting",
  ],
  openGraph: {
    title: "RudraAI — AI Automation Agency",
    description:
      "Stop hiring for repetitive work. Deploy AI automations instead.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RudraAI — AI Automation Agency",
    description:
      "Stop hiring for repetitive work. Deploy AI automations instead.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${raleway.variable} ${dmSans.variable} dark`}
      suppressHydrationWarning
    >
      <body className="bg-[#09090B] text-white antialiased overflow-x-hidden">
        <SmoothScrollProvider>
          <Providers>{children}</Providers>
        </SmoothScrollProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
