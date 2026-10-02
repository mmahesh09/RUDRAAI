export type ShowcaseStepKind = "trigger" | "ai" | "logic" | "action";

export interface ShowcaseStep {
  label: string;
  tool: string;
  kind: ShowcaseStepKind;
}

export interface ShowcaseBuild {
  id: string;
  title: string;
  category: "Sales" | "Support" | "Operations" | "Marketing" | "Finance";
  summary: string;
  steps: ShowcaseStep[];
  stack: string[];
  accentColor: string;
  caseStudySlug: string;
}

export const showcaseCategories = ["All", "Sales", "Support", "Operations", "Marketing", "Finance"] as const;

export const showcaseBuilds: ShowcaseBuild[] = [
  {
    id: "lead-qualification-agent",
    title: "AI Lead Qualification Agent",
    category: "Sales",
    summary:
      "Every inbound lead is enriched, scored 0–100 against the client's ICP by an AI agent, and routed to the right rep in HubSpot with a drafted opener.",
    steps: [
      { label: "New lead", tool: "Webhook", kind: "trigger" },
      { label: "Enrich company data", tool: "Clearbit", kind: "action" },
      { label: "Score against ICP", tool: "GPT-4o", kind: "ai" },
      { label: "Route by score", tool: "IF node", kind: "logic" },
      { label: "Update + assign rep", tool: "HubSpot", kind: "action" },
    ],
    stack: ["n8n", "GPT-4o", "HubSpot", "Clearbit"],
    accentColor: "#FF6B00",
    caseStudySlug: "lead-qualification-automation",
  },
  {
    id: "support-agent",
    title: "Customer Support AI Agent",
    category: "Support",
    summary:
      "Reads incoming tickets, pulls live order data, answers from the knowledge base, and escalates to a human only when judgment is needed.",
    steps: [
      { label: "New ticket", tool: "Zendesk", kind: "trigger" },
      { label: "Fetch order", tool: "Shopify", kind: "action" },
      { label: "Draft answer from KB", tool: "OpenAI", kind: "ai" },
      { label: "Confident?", tool: "Quality gate", kind: "logic" },
      { label: "Reply or escalate", tool: "Zendesk", kind: "action" },
    ],
    stack: ["AI Agent", "Zendesk", "Shopify", "OpenAI"],
    accentColor: "#3B82F6",
    caseStudySlug: "customer-support-ai-agent",
  },
  {
    id: "appointment-booking",
    title: "Appointment Booking & Reminders",
    category: "Operations",
    summary:
      "Handles booking, SMS and email reminders, and post-visit follow-ups across clinic locations without front-desk involvement.",
    steps: [
      { label: "Booking request", tool: "EHR API", kind: "trigger" },
      { label: "Reserve slot", tool: "Google Calendar", kind: "action" },
      { label: "Wait until reminder", tool: "Schedule", kind: "logic" },
      { label: "Send reminder", tool: "Twilio SMS", kind: "action" },
      { label: "Follow-up email", tool: "Email", kind: "action" },
    ],
    stack: ["n8n", "Twilio", "Google Calendar", "EHR API"],
    accentColor: "#10B981",
    caseStudySlug: "appointment-booking-automation",
  },
  {
    id: "email-segmentation",
    title: "Behaviour-Triggered Email Engine",
    category: "Marketing",
    summary:
      "Watches site events, purchases, and engagement in real time, assigns micro-segments, and writes personalised copy for each one.",
    steps: [
      { label: "User event", tool: "Segment", kind: "trigger" },
      { label: "Assign segment", tool: "Code", kind: "logic" },
      { label: "Write subject + body", tool: "GPT-4o", kind: "ai" },
      { label: "Schedule send", tool: "Instantly", kind: "action" },
      { label: "Sync profile", tool: "Klaviyo", kind: "action" },
    ],
    stack: ["n8n", "GPT-4o", "Instantly", "Segment", "Klaviyo"],
    accentColor: "#8B5CF6",
    caseStudySlug: "email-marketing-automation",
  },
  {
    id: "real-estate-nurturing",
    title: "WhatsApp Lead Nurturing Pipeline",
    category: "Sales",
    summary:
      "Captures portal enquiries, scores budget and intent, nurtures over WhatsApp, lets leads self-book viewings, and briefs the agent beforehand.",
    steps: [
      { label: "Portal enquiry", tool: "Webhook", kind: "trigger" },
      { label: "Score intent", tool: "OpenAI", kind: "ai" },
      { label: "Nurture sequence", tool: "WhatsApp API", kind: "action" },
      { label: "Self-book viewing", tool: "Cal.com", kind: "action" },
      { label: "Brief the agent", tool: "OpenAI", kind: "ai" },
    ],
    stack: ["n8n", "WhatsApp API", "Twilio", "Cal.com", "OpenAI"],
    accentColor: "#F59E0B",
    caseStudySlug: "real-estate-lead-nurturing",
  },
  {
    id: "invoice-processing",
    title: "Invoice Processing & AP Automation",
    category: "Finance",
    summary:
      "Reads invoices from email, validates them against purchase orders, codes them, routes approvals in Slack, and posts to the ERP.",
    steps: [
      { label: "Invoice email", tool: "IMAP", kind: "trigger" },
      { label: "Extract fields", tool: "GPT-4o Vision", kind: "ai" },
      { label: "Match PO", tool: "PostgreSQL", kind: "logic" },
      { label: "Approve", tool: "Slack", kind: "action" },
      { label: "Post entry", tool: "SAP", kind: "action" },
    ],
    stack: ["n8n", "GPT-4o Vision", "Slack", "SAP", "PostgreSQL"],
    accentColor: "#EC4899",
    caseStudySlug: "invoice-processing-automation",
  },
];
