import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ShowcaseSection from "@/components/showcase-section";
import PageHero from "@/components/site/page-hero";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Showcase — Client Websites We've Shipped",
  description:
    "Live client work from RudraAI, including Mindbodymedworks — a holistic health and wellness website designed and built in Next.js.",
  path: "/showcase",
  image: "/showcase/mindbodymedworks-desktop.webp",
});

export default function ShowcasePage() {
  return (
    <main className="bg-black">
      <Navbar />
      <PageHero
        label="Showcase"
        title={
          <span>
            Work that&apos;s <span className="text-[#BF5AF2]">live on the web.</span>
          </span>
        }
        intro="Real sites for real clients. Scroll through them as they are today."
      />
      <ShowcaseSection />
      <Footer />
    </main>
  );
}
