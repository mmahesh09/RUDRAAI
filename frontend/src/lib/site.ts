// Single source for business facts that appear across pages, so copy never drifts
// (e.g. one page saying a 15-minute call while another says 60).

export const SITE = {
  name: "RudraAI",
  email: "hello@rudraai.online",
  location: "Hyderabad, India",
  // Never hardcode a personal name (see CLAUDE.md)
  consultant: process.env.NEXT_PUBLIC_CONSULTANT_NAME || "Automation Consultant",
  call: {
    minutes: 15,
    days: "Saturday & Sunday",
    short: "15 min · Sat–Sun",
  },
  supportDays: 30,
} as const;

export const SERVICES = [
  {
    slug: "websites",
    name: "Websites",
    line: "Fast, search-ready sites that turn visitors into enquiries.",
    detail:
      "Designed and built in Next.js. Every page loads quickly, reads well on a phone, and is set up so search engines understand what you do.",
    deliverables: ["Design + build", "SEO foundations", "Analytics", "Editable content"],
    timeline: "2–4 weeks",
  },
  {
    slug: "ai-agents",
    name: "AI agents",
    line: "Assistants that answer customers and act on your systems.",
    detail:
      "Agents trained on your own documents and connected to your tools. They answer questions, qualify leads, book meetings, and hand off to a person when they should.",
    deliverables: ["Website or WhatsApp chat", "Trained on your data", "CRM + tool actions", "Human hand-off"],
    timeline: "1–3 weeks",
  },
  {
    slug: "automations",
    name: "Automations",
    line: "The repetitive work between your tools, done for you.",
    detail:
      "n8n workflows that move data between the apps you already use — leads into the CRM, invoices out, reports to Slack — with alerts so nothing fails quietly.",
    deliverables: ["n8n workflows", "400+ app integrations", "Error alerts + retries", "Full documentation"],
    timeline: "3–7 days",
  },
] as const;
