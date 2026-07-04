import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — RudraAI",
  description: "Terms and conditions for using RudraAI's website and services.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "June 15, 2026";
const CONTACT_EMAIL = "legal@rudraai.online";
const COMPANY = "RudraAI";

export default function TermsPage() {
  return (
    <main>
      <Navbar />

      <div className="relative pt-32 pb-8 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative z-10 container-wide text-center">
          <Badge className="mb-4">Legal</Badge>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-[#71717A] font-body text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <section className="section-padding pt-12">
        <div className="container-wide max-w-3xl">
          <div className="space-y-10 font-body text-[#A1A1AA] leading-relaxed">

            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03] text-sm">
              <strong className="text-white">Summary:</strong> By using this website or booking a consultation,
              you agree to these terms. We provide professional automation services; you agree to pay
              agreed fees on time and not misuse our services. Neither party is liable for indirect damages.
            </div>

            {[
              {
                title: "1. Acceptance of Terms",
                body: `By accessing ${COMPANY}'s website or engaging our services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our website or services.`,
              },
              {
                title: "2. Services",
                body: `${COMPANY} provides AI automation consulting, n8n workflow development, AI agent development, and related professional services. The specific scope, deliverables, timeline, and fees for any engagement are defined in a separate Statement of Work (SOW) or service agreement signed by both parties.`,
              },
              {
                title: "3. Free Automation Audit",
                body: "The free 60-minute automation audit is a no-obligation consultation. We will provide strategic recommendations, but are not contractually obligated to provide any specific deliverable from the audit call. Booking a free audit does not create a client-agency relationship.",
              },
              {
                title: "4. Payment Terms",
                body: null,
                list: [
                  "Fees are as agreed in the SOW or invoice",
                  "Payment is due within 14 days of invoice date unless otherwise agreed",
                  "Late payments accrue interest at 1.5% per month",
                  "We reserve the right to pause work on overdue accounts",
                  "All fees are in USD unless otherwise stated",
                ],
              },
              {
                title: "5. Intellectual Property",
                body: "Upon full payment, all custom-built automation workflows and code become your property. We retain the right to use anonymised case studies and general technical approaches for portfolio and marketing purposes, unless you request otherwise in writing. Third-party tools (n8n, OpenAI, etc.) remain subject to their own licenses.",
              },
              {
                title: "6. Confidentiality",
                body: "Both parties agree to keep confidential any non-public business information shared during the engagement. We will not disclose your trade secrets, customer data, or internal processes to third parties without your written consent.",
              },
              {
                title: "7. Data Handling",
                body: "During a project, we may have access to your business systems and data. We handle this data solely to complete the agreed work. We sign an NDA before any engagement where sensitive data is involved. See our Privacy Policy for website data handling.",
              },
              {
                title: "8. Warranties and Disclaimers",
                body: null,
                list: [
                  "We warrant that our work will be delivered with reasonable skill and care",
                  "We do not warrant uninterrupted, error-free operation of third-party platforms (OpenAI, n8n cloud, etc.)",
                  "ROI estimates provided in audits are projections based on information provided — actual results may vary",
                  "The website is provided 'as is' without warranties of any kind",
                ],
              },
              {
                title: "9. Limitation of Liability",
                body: `To the maximum extent permitted by law, ${COMPANY}'s total liability for any claim arising from our services is limited to the fees paid for the specific project in question during the 3 months preceding the claim. We are not liable for indirect, incidental, or consequential damages, loss of profits, or data loss.`,
              },
              {
                title: "10. Indemnification",
                body: "You agree to indemnify and hold harmless RudraAI from any claims, damages, or expenses arising from your misuse of our website or services, your violation of these terms, or your violation of any third-party rights.",
              },
              {
                title: "11. Acceptable Use",
                body: "You agree not to:",
                list: [
                  "Use our website or services for any unlawful purpose",
                  "Attempt to gain unauthorized access to our systems",
                  "Use our services to build automations that violate the law or third-party terms of service",
                  "Reverse engineer, copy, or resell our proprietary methodologies without permission",
                ],
              },
              {
                title: "12. Termination",
                body: "Either party may terminate an engagement with 14 days' written notice. You will owe fees for work completed up to the termination date. We reserve the right to terminate immediately for non-payment or material breach.",
              },
              {
                title: "13. Governing Law",
                body: "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Hyderabad, Telangana, India. For EU clients, mandatory consumer protection laws of your country also apply.",
              },
              {
                title: "14. Changes to Terms",
                body: "We may update these terms at any time. Updated terms are effective when posted. Continued use of our services after an update constitutes acceptance.",
              },
              {
                title: "15. Contact",
                body: `For questions about these terms, email <a href="mailto:${CONTACT_EMAIL}" class="text-[#FF6B00] hover:underline">${CONTACT_EMAIL}</a>.`,
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
