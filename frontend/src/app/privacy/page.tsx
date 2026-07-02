import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — RudraAI",
  description: "How RudraAI collects, uses, and protects your personal data.",
};

const LAST_UPDATED = "June 15, 2026";
const CONTACT_EMAIL = "privacy@rudraai.online";
const COMPANY = "RudraAI";
const WEBSITE = "https://rudraai.online";

export default function PrivacyPage() {
  return (
    <main>
      <Navbar />

      <div className="relative pt-32 pb-8 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative z-10 container-wide text-center">
          <Badge className="mb-4">Legal</Badge>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-[#71717A] font-body text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <section className="section-padding pt-12">
        <div className="container-wide max-w-3xl prose-dark">
          <div className="space-y-10 font-body text-[#A1A1AA] leading-relaxed">

            <div className="p-5 rounded-xl border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.05)] text-sm">
              <strong className="text-white">Plain-English Summary:</strong> We collect only what we need
              (name, email, company) to respond to your enquiry or confirm your booking. We don't sell
              your data, don't run ads, and don't use third-party tracking beyond what's listed below.
            </div>

            {[
              {
                title: "1. Who We Are",
                body: `${COMPANY} ("we", "us", "our") is an AI automation agency based in Hyderabad, India. Our website is ${WEBSITE}. This policy explains how we handle personal data collected through our website's contact form and booking form.`,
              },
              {
                title: "2. What Data We Collect",
                body: null,
                list: [
                  "Contact form: name, work email, company name, budget range, message text",
                  "Booking form: name, work email, company name, job role, automation goal, selected time slot",
                  "Server logs: IP address, browser user agent, page visited, timestamp — retained for 30 days",
                  "Cookies: a single first-party cookie to remember your cookie consent preference",
                ],
              },
              {
                title: "3. Why We Collect It (Legal Basis)",
                body: null,
                list: [
                  "To respond to your contact enquiry (legitimate interest / contract performance)",
                  "To confirm and manage your booked consultation (contract performance)",
                  "To send you a confirmation email (contract performance)",
                  "To protect against abuse and spam (legitimate interest)",
                ],
              },
              {
                title: "4. How We Use Your Data",
                body: "Your data is used only to respond to your message and/or confirm your booked call. We do not use it for marketing unless you explicitly opt in. We do not sell, rent, or share your data with third parties for their own purposes.",
              },
              {
                title: "5. Third-Party Services",
                body: null,
                list: [
                  "Email delivery: Gmail SMTP / SendGrid — used to send confirmation emails. Your email address is passed to these providers.",
                  "n8n (self-hosted): Our workflow automation engine, hosted on our own servers. Contact/booking data may be forwarded to it for CRM logging.",
                  "Google Fonts: Loads font files from fonts.googleapis.com. No personal data is sent.",
                  "Vercel / hosting provider: Server-side logs only. No personal data shared beyond standard hosting.",
                ],
              },
              {
                title: "6. Data Retention",
                body: "Form submission data (name, email, company, message) is retained in our email inbox for up to 24 months or until you request deletion. Server logs are deleted after 30 days. Cookie consent preference is stored in your browser and expires after 12 months.",
              },
              {
                title: "7. Your Rights (GDPR & CCPA)",
                body: "If you are in the EU, UK, or California, you have the right to:",
                list: [
                  "Access: Request a copy of the personal data we hold about you",
                  "Rectification: Ask us to correct inaccurate data",
                  "Erasure: Ask us to delete your data ('right to be forgotten')",
                  "Portability: Receive your data in a machine-readable format",
                  "Objection: Object to our use of your data for legitimate interest purposes",
                  "Withdraw consent: Where processing is based on consent, withdraw it at any time",
                ],
              },
              {
                title: "8. Cookies",
                body: `We use one cookie: <code class="text-[#FF6B00]">rudraai_cookie_consent</code> — a first-party cookie that stores whether you have accepted or declined our cookie notice. It does not track you. It expires after 12 months. We do not use advertising cookies, third-party tracking cookies, or analytics cookies at this time.`,
                isHtml: true,
              },
              {
                title: "9. Data Security",
                body: "We use HTTPS on all pages, environment variables for all secrets, and access controls to limit who can read form submissions. We do not store form data in a database — submissions go directly to email. Email accounts are protected by two-factor authentication.",
              },
              {
                title: "10. International Transfers",
                body: "We are based in India. If you are in the EU/EEA, your data may be transferred to India and processed there. We take appropriate safeguards including contractual protections with our email provider.",
              },
              {
                title: "11. Children",
                body: "Our services are not directed at children under 16. We do not knowingly collect data from minors. If you believe we have collected data from a child, contact us and we will delete it promptly.",
              },
              {
                title: "12. Changes to This Policy",
                body: "We may update this policy from time to time. We will update the 'Last updated' date at the top of the page. Continued use of our website after changes constitutes acceptance of the updated policy.",
              },
              {
                title: "13. Contact Us",
                body: `To exercise your rights, request deletion, or ask any privacy question, email us at <a href="mailto:${CONTACT_EMAIL}" class="text-[#FF6B00] hover:underline">${CONTACT_EMAIL}</a>. We will respond within 30 days.`,
                isHtml: true,
              },
            ].map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-heading font-bold text-white mb-3">{section.title}</h2>
                {section.body && section.isHtml ? (
                  <p dangerouslySetInnerHTML={{ __html: section.body }} />
                ) : section.body ? (
                  <p>{section.body}</p>
                ) : null}
                {section.list && (
                  <ul className="mt-3 space-y-2 list-disc list-inside marker:text-[#FF6B00]">
                    {section.list.map((item) => (
                      <li key={item} className="pl-1">{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
