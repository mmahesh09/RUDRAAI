// Long-form content for /services/[slug]. Short facts (name, line, timeline, deliverables)
// live in SERVICES in lib/site.ts so the dropdown, home and /services never drift.

import { SERVICES, SITE } from "@/lib/site";

export type ServiceSlug = (typeof SERVICES)[number]["slug"];

type Step = { title: string; body: string };
type StackGroup = { group: string; tools: string[]; why: string };
type Outcome = { title: string; body: string };
type Faq = { q: string; a: string };

export type ServicePage = {
  slug: ServiceSlug;
  /** <title> without brand, ≤ 50 chars so the " | RudraAI" suffix fits in SERPs */
  seoTitle: string;
  /** 140–160 chars */
  seoDescription: string;
  /** Breadcrumb + schema name */
  schemaName: string;
  serviceType: string;
  h1: string;
  h1Accent: string;
  intro: string;
  process: Step[];
  stack: StackGroup[];
  growth: Outcome[];
  examples: string[];
  faqs: Faq[];
  related: { label: string; href: string }[];
};

export const SERVICE_PAGES: Record<ServiceSlug, ServicePage> = {
  websites: {
    slug: "websites",
    seoTitle: "Website Design & Development in Hyderabad",
    seoDescription:
      "Fast, SEO-ready websites designed and built in Next.js by RudraAI, Hyderabad. Fixed price, live in 2–4 weeks, built to turn visitors into enquiries.",
    schemaName: "Website Design and Development",
    serviceType: "Website design and development",
    h1: "Website design and development",
    h1Accent: "that brings in enquiries.",
    intro:
      "We design and build fast, search-ready business websites in Next.js. Every page loads quickly, reads well on a phone, and is set up so Google understands exactly what you do and who you serve.",
    process: [
      {
        title: "Discovery call",
        body: `A ${SITE.call.minutes}-minute call about your customers, what they search for, and what a good enquiry looks like for you.`,
      },
      {
        title: "Keyword and content plan",
        body: "We map the searches your customers make to pages on your site, then write a sitemap and page outline before anything is designed.",
      },
      {
        title: "Design",
        body: "Layouts for mobile and desktop, built around one clear action per page — call, book, or enquire. You review and approve before we build.",
      },
      {
        title: "Build in Next.js",
        body: "Hand-written components, optimised images, structured data and clean URLs. No page builders, no plugin bloat, no theme lock-in.",
      },
      {
        title: "Test and launch",
        body: "We check Core Web Vitals, mobile layouts, forms and redirects, connect Search Console and analytics, and submit your sitemap to Google.",
      },
      {
        title: "Handover",
        body: `Logins, a recorded walkthrough and ${SITE.supportDays} days of free fixes. The code and domain are yours.`,
      },
    ],
    stack: [
      { group: "Framework", tools: ["Next.js", "React", "TypeScript"], why: "Server-rendered pages that load fast and are fully readable by search engines." },
      { group: "Design", tools: ["Tailwind CSS", "Framer Motion", "Figma"], why: "A consistent design system with motion that never slows the page down." },
      { group: "Hosting", tools: ["Vercel", "Global CDN"], why: "Pages served from the edge closest to your visitor, with automatic HTTPS." },
      { group: "Forms & data", tools: ["Supabase", "Resend", "WhatsApp"], why: "Enquiries stored safely and delivered to your inbox or phone in seconds." },
      { group: "SEO & analytics", tools: ["Schema.org", "Google Search Console", "Google Analytics 4"], why: "Rich results in Google and clear reporting on where enquiries come from." },
    ],
    growth: [
      { title: "Get found on Google", body: "Each service and location gets its own page targeting what people actually search, with titles, structured data and internal links done properly." },
      { title: "Turn visits into enquiries", body: "Clear calls to action, fast forms and WhatsApp buttons placed where visitors decide — not buried in a footer." },
      { title: "Load fast everywhere", body: "We build to pass Core Web Vitals on mobile, because slow pages lose both rankings and customers." },
      { title: "Know what's working", body: "Analytics and Search Console set up from day one, so you can see which pages and searches bring in business." },
      { title: "Grow without a rebuild", body: "New pages, services and locations slot into the same system, so the site scales with your business." },
    ],
    examples: [
      "A clinic site where patients find the right doctor and book in two taps",
      "A product site that ranks for what your customers actually search",
      "A service business site with WhatsApp enquiries routed straight to the owner",
    ],
    faqs: [
      { q: "How long does a website take?", a: "Most business websites take 2–4 weeks from approved plan to launch, depending on the number of pages and how quickly content is ready." },
      { q: "How much does a website cost?", a: "A fixed price, quoted after a free 15-minute call once we understand your pages and goals. No hourly billing and no surprise invoices." },
      { q: "Will my website rank on Google?", a: "We build every site with the technical SEO foundations Google expects — fast pages, clean structure, structured data and a submitted sitemap. Rankings also depend on competition and content over time, and we show you how to keep improving." },
      { q: "Can I edit the website myself?", a: "Yes. Text, images and new pages can be updated without touching code, and we walk you through it at handover." },
      { q: "Do I own the website?", a: "Yes. The code, domain and hosting accounts are yours. There is no lock-in." },
    ],
    related: [
      { label: "See a website we shipped", href: "/showcase" },
      { label: "Add an AI agent to your site", href: "/services/ai-agents" },
    ],
  },

  "ai-agents": {
    slug: "ai-agents",
    seoTitle: "Custom AI Agent & Chatbot Development",
    seoDescription:
      "Custom AI agents and chatbots trained on your own data. They answer customers, qualify leads and book meetings on your site or WhatsApp. Live in 1–3 weeks.",
    schemaName: "Custom AI Agent Development",
    serviceType: "AI agent and chatbot development",
    h1: "Custom AI agents",
    h1Accent: "that answer, qualify and act.",
    intro:
      "We build AI agents trained on your own documents and connected to the tools you already use. They answer customer questions accurately, qualify leads, book meetings, and hand off to a person when they should.",
    process: [
      {
        title: "Map the conversations",
        body: "We collect the questions customers actually ask and the actions the agent should take — answer, book, update a CRM, or escalate.",
      },
      {
        title: "Prepare your knowledge",
        body: "Your FAQs, documents, pricing and policies are cleaned, split and indexed in a vector database so answers come from your facts, not guesses.",
      },
      {
        title: "Build retrieval and tools",
        body: "We wire up retrieval-augmented generation (RAG) and give the agent safe, limited actions in your calendar, CRM or helpdesk.",
      },
      {
        title: "Evaluate before launch",
        body: "The agent is tested against a set of real questions and scored for accuracy, tone and correct hand-off before any customer sees it.",
      },
      {
        title: "Deploy where customers are",
        body: "Launch on your website chat, WhatsApp, or both, with human hand-off to your team when a conversation needs a person.",
      },
      {
        title: "Monitor and improve",
        body: `We review conversations, fix gaps in its knowledge and tune answers. Fixes are free for the first ${SITE.supportDays} days.`,
      },
    ],
    stack: [
      { group: "Models", tools: ["OpenRouter", "GPT", "Claude", "Llama", "Ollama"], why: "We pick the model on evidence for your use case, with automatic fallback if one is unavailable." },
      { group: "Knowledge (RAG)", tools: ["Qdrant", "Embeddings", "Supabase"], why: "Answers grounded in your own documents, with sources you can check." },
      { group: "Tools & actions", tools: ["n8n", "MCP", "REST APIs"], why: "Lets the agent book, look up and update records in the systems you already use." },
      { group: "Channels", tools: ["Website chat", "WhatsApp", "Chatwoot"], why: "Meet customers where they are, with a shared inbox for human hand-off." },
      { group: "Quality", tools: ["Evals", "Conversation logs", "Alerts"], why: "Measured accuracy before launch and visibility into every conversation after." },
    ],
    growth: [
      { title: "Answer every enquiry instantly", body: "Customers get accurate answers at 2am on a Sunday, so leads stop going cold while your team is offline." },
      { title: "Qualify leads automatically", body: "The agent asks the right questions, scores the lead and books a call — your team only talks to people ready to buy." },
      { title: "Free up your team", body: "Repetitive questions about pricing, availability and policies are handled, so people spend time on work that needs them." },
      { title: "Keep answers on-brand and correct", body: "Grounded in your own documents and tested before launch, so it doesn't invent prices or promises." },
      { title: "Learn what customers want", body: "Every conversation is logged, showing the questions and objections you can act on in sales and marketing." },
    ],
    examples: [
      "A website assistant that answers pricing and availability from your own docs",
      "A WhatsApp agent that qualifies leads and books calls into your calendar",
      "A support agent that looks up order status and hands tricky cases to a person",
    ],
    faqs: [
      { q: "What is a custom AI agent?", a: "An AI assistant trained on your business's own information and connected to your tools, so it can answer questions accurately and take actions like booking meetings or updating your CRM." },
      { q: "How is this different from a basic chatbot?", a: "A basic chatbot follows a fixed script. A custom AI agent understands free-form questions, retrieves answers from your documents, and can act in your systems — and hands off to a person when it should." },
      { q: "Will the agent make things up?", a: "We ground answers in your own documents using retrieval-augmented generation and test the agent against real questions before launch. When it doesn't know, it says so and hands off." },
      { q: "Can it work on WhatsApp?", a: "Yes. We deploy agents on website chat, WhatsApp, or both, with a shared inbox so your team can take over a conversation at any time." },
      { q: "How long does it take to build?", a: "Most AI agents go live in 1–3 weeks, depending on how much knowledge and how many tool integrations are involved." },
    ],
    related: [
      { label: "How RAG works, explained", href: "/blog/rag-architecture-explained" },
      { label: "Choosing an LLM on evidence", href: "/blog/llm-models-benchmarks-evals" },
      { label: "Automate the work around your agent", href: "/services/automations" },
    ],
  },

  automations: {
    slug: "automations",
    seoTitle: "n8n & AI Workflow Automation Services",
    seoDescription:
      "n8n workflow automation that moves data between your apps — leads to CRM, invoices out, reports to Slack — with alerts and retries. Live in 3–7 days.",
    schemaName: "n8n and AI Workflow Automation",
    serviceType: "Business process and workflow automation",
    h1: "Workflow automation",
    h1Accent: "that runs while you sleep.",
    intro:
      "We build n8n workflows that move data between the apps you already use — leads into the CRM, invoices out, reports to Slack — with alerts and retries so nothing fails quietly.",
    process: [
      {
        title: "Find the repetitive work",
        body: `A ${SITE.call.minutes}-minute call to list the copy-paste tasks eating your week and pick the one that saves the most time first.`,
      },
      {
        title: "Map the workflow",
        body: "We document every trigger, step and decision on paper, with a fixed price, before any automation is built.",
      },
      {
        title: "Build in n8n",
        body: "Each workflow is built with clear naming, credentials stored securely, and AI steps only where they genuinely help — like reading emails or drafting replies.",
      },
      {
        title: "Test on real data",
        body: "We run the workflow against sample and real records, including edge cases, and show you the results before switching it on.",
      },
      {
        title: "Add alerts and retries",
        body: "If an app is down or data is missing, the workflow retries and alerts us — so failures are fixed, not discovered weeks later.",
      },
      {
        title: "Document and hand over",
        body: `Written docs, a walkthrough and ${SITE.supportDays} days of free fixes. You own the workflows and the accounts they run on.`,
      },
    ],
    stack: [
      { group: "Orchestration", tools: ["n8n", "Webhooks", "Schedules"], why: "An open, self-hostable automation platform with 400+ app integrations and no per-task pricing." },
      { group: "AI steps", tools: ["OpenRouter", "GPT", "Claude"], why: "Read, classify, summarise and draft — added only where a rule can't do the job." },
      { group: "Business apps", tools: ["Google Sheets", "Notion", "Slack", "CRMs"], why: "We connect the tools your team already works in, instead of replacing them." },
      { group: "Data & email", tools: ["Supabase", "PostgreSQL", "Resend"], why: "Reliable storage for records and transactional emails that actually land." },
      { group: "Scheduling", tools: ["Cal.com", "Zoom", "Google Calendar"], why: "Bookings, meeting links and reminders created automatically." },
    ],
    growth: [
      { title: "Get hours back every week", body: "Data entry, copy-paste and status updates run on their own, so your team spends time on customers and growth." },
      { title: "Respond to leads in seconds", body: "New enquiries reach your CRM, get a personal reply and alert the right person before a competitor calls back." },
      { title: "Stop costly mistakes", body: "Automations do the same steps the same way every time, removing typos, missed follow-ups and lost invoices." },
      { title: "Scale without hiring", body: "Handle ten times the orders or leads with the same team, because the busywork scales automatically." },
      { title: "See everything in one place", body: "Daily reports and alerts land in Slack or email, so you know what's happening without chasing people." },
    ],
    examples: [
      "Form → CRM → personal reply → Slack alert, in under ten seconds",
      "Invoices created when a job is marked done, reminders sent automatically",
      "A weekly report pulled from three tools and posted to your team channel",
    ],
    faqs: [
      { q: "What is n8n?", a: "n8n is an open workflow automation platform that connects 400+ apps and APIs. Unlike per-task tools, it can be self-hosted and doesn't charge more as your volume grows." },
      { q: "What can I automate first?", a: "Start with the task that is repetitive, rule-based and done often — lead capture, CRM updates, invoicing and reporting are the usual winners. We help you pick on the first call." },
      { q: "How long does an automation take?", a: "Most automations go live in 3–7 days from an approved plan." },
      { q: "What happens if an automation breaks?", a: `Every workflow has retries and alerts. We're notified the moment a step fails, and fixes are free for the first ${SITE.supportDays} days.` },
      { q: "Do I need to be technical?", a: "No. We build it, document it and walk you through it in plain English." },
    ],
    related: [
      { label: "The automation guide: what to automate first", href: "/automation-guide" },
      { label: "Automation ideas by industry", href: "/industries" },
      { label: "Add an AI agent on top", href: "/services/ai-agents" },
    ],
  },
};

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);
