import { TrendingUp, Clock, DollarSign, Users, Mail, FileText, BarChart3, type LucideIcon } from "lucide-react";

export interface CaseStudyMetric {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
}

export interface CaseStudy {
  slug: string;
  industry: string;
  title: string;
  description: string;
  challenge: string;
  solution: string;
  outcome: string;
  metrics: CaseStudyMetric[];
  tags: string[];
  gradient: string;
  accentColor: string;
  image: string;
  timeline: string;
  content: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "lead-qualification-automation",
    industry: "SaaS / Sales",
    title: "Lead Qualification Automation",
    description:
      "Built an AI agent that scores and qualifies inbound leads from 5 sources, enriches with firmographic data, and routes to the right sales rep — all in under 3 seconds.",
    challenge:
      "A B2B SaaS company was receiving 400+ inbound leads per week across 5 channels (website, LinkedIn, webinars, partner referrals, and paid ads). Their SDR team spent 60% of their time manually qualifying leads, only to find most were unfit. Response times averaged 4 hours, and high-fit leads were going cold.",
    solution:
      "We built an n8n workflow connected to a GPT-4o AI agent that automatically triggers on every new lead entry. The agent pulls firmographic data from Clearbit, checks LinkedIn fit signals, scores the lead 0–100 against their ICP, and routes them to the correct rep in HubSpot with a pre-drafted personalised opener. The entire pipeline runs in under 3 seconds.",
    outcome:
      "Within 90 days, their pipeline grew by $180K. SDRs now spend 80% of their time actually selling. High-intent leads receive a response within 8 minutes on average. The team closed 3 deals in the first month that would have been missed due to slow follow-up.",
    metrics: [
      { icon: TrendingUp, value: "340%", label: "More qualified leads", color: "#10B981" },
      { icon: Clock, value: "92%", label: "Reduction in response time", color: "#3B82F6" },
      { icon: DollarSign, value: "$180K", label: "Pipeline added in 90 days", color: "#FF6B00" },
    ],
    tags: ["n8n", "GPT-4o", "HubSpot", "Clearbit"],
    gradient: "from-[#FF6B00]/10 to-transparent",
    accentColor: "#FF6B00",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    timeline: "3 weeks build · 90-day results",
    content: `
<h2>The Problem</h2>
<p>The client, a B2B SaaS company selling project management software, was receiving over 400 inbound leads per week across five channels: their website, LinkedIn outreach, webinar sign-ups, partner referrals, and paid search. Their team of four SDRs was spending the majority of their day manually reviewing each lead, looking up company info on LinkedIn, checking CRM history, and deciding whether to prioritise follow-up.</p>
<p>The result? Average response times of 4+ hours, leads going stale, and sales reps closing deals at a fraction of the rate they should have been. High-intent buyers were filling out the form and signing up with a competitor before anyone got back to them.</p>

<h2>The Automation We Built</h2>
<p>We designed a fully automated lead processing pipeline using n8n as the orchestration layer:</p>
<ol>
  <li><strong>Trigger:</strong> Any new lead entry (from any source) fires a webhook to the workflow.</li>
  <li><strong>Enrichment:</strong> Clearbit API instantly adds firmographic data — company size, revenue, tech stack, and industry.</li>
  <li><strong>AI Scoring:</strong> A GPT-4o agent scores the lead 0–100 against a custom ICP rubric, written in plain English by the client's head of sales.</li>
  <li><strong>Routing logic:</strong> Leads scored 75+ go to senior AEs. Leads 50–74 go to mid-level SDRs. Below 50 are auto-enrolled in a nurture sequence.</li>
  <li><strong>HubSpot update:</strong> The lead record is updated with the score, routing decision, and a pre-drafted personalised outreach message the rep can send in one click.</li>
</ol>
<p>Total processing time: <strong>under 3 seconds.</strong></p>

<h2>Results After 90 Days</h2>
<p>The impact was immediate and measurable. Response time to high-fit leads dropped from 4 hours to 8 minutes. SDRs reported spending 80% of their time in conversations rather than admin. Three deals that had previously stalled due to slow follow-up were resurrected within the first month.</p>
<p>Pipeline value grew by $180,000 in 90 days, representing a 340% improvement in qualified lead volume without adding headcount.</p>

<h2>Tools Used</h2>
<ul>
  <li><strong>n8n</strong> — workflow orchestration</li>
  <li><strong>GPT-4o</strong> — ICP scoring and message drafting</li>
  <li><strong>Clearbit</strong> — firmographic enrichment</li>
  <li><strong>HubSpot</strong> — CRM integration and lead routing</li>
</ul>
    `,
  },
  {
    slug: "customer-support-ai-agent",
    industry: "E-Commerce",
    title: "Customer Support AI Agent",
    description:
      "Deployed a fully autonomous support agent that handles 80% of tickets end-to-end using knowledge base lookups, order data, and LLM reasoning — escalating only complex cases.",
    challenge:
      "A fast-growing DTC e-commerce brand was receiving 3,000+ support tickets per month and had a 48-hour average resolution time. Their 6-person support team was drowning in repetitive queries about order status, returns, and product FAQs.",
    solution:
      "We deployed a custom AI support agent integrated with Zendesk, Shopify, and a custom knowledge base. The agent reads incoming tickets, fetches live order data, generates empathetic responses, and resolves straightforward cases autonomously — only escalating when human judgment is needed.",
    outcome:
      "80% of tickets are now resolved without any human involvement. Average resolution time dropped from 48 hours to 4 minutes. The brand saves $95K annually in support costs and has reallocated the team to handle high-value pre-sales conversations.",
    metrics: [
      { icon: TrendingUp, value: "80%", label: "Tickets auto-resolved", color: "#8B5CF6" },
      { icon: Clock, value: "4 min", label: "Avg resolution time", color: "#10B981" },
      { icon: DollarSign, value: "$95K", label: "Annual support savings", color: "#FF6B00" },
    ],
    tags: ["AI Agent", "Zendesk", "Shopify", "OpenAI"],
    gradient: "from-[#8B5CF6]/10 to-transparent",
    accentColor: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    timeline: "4 weeks build · 6-month results",
    content: `
<h2>The Problem</h2>
<p>A direct-to-consumer fashion brand with 50,000 monthly orders was receiving 3,000+ support tickets per month. Their team of six support agents was handling an average of 500 tickets each — unsustainable, especially during peak season. Average resolution time sat at 48 hours. Customer satisfaction scores were slipping.</p>
<p>80% of tickets fell into just six categories: order status, returns/exchanges, shipping delays, sizing questions, discount codes, and product care instructions. All of these had deterministic answers — but a human had to type them out every time.</p>

<h2>The Automation We Built</h2>
<p>We built a multi-step AI agent pipeline that handles the full lifecycle of a support ticket:</p>
<ol>
  <li><strong>Classification:</strong> Incoming Zendesk ticket is classified by category and intent.</li>
  <li><strong>Data fetch:</strong> The agent queries Shopify in real-time for the customer's order history, tracking status, and return eligibility.</li>
  <li><strong>Knowledge base lookup:</strong> A vector search retrieves the most relevant policy, FAQ, or product information from the brand's knowledge base.</li>
  <li><strong>Response generation:</strong> An LLM composes a brand-voice response, personalised with the customer's name and order details.</li>
  <li><strong>Autonomous resolution:</strong> If the ticket falls into a low-risk category, the agent sends the reply and closes the ticket. Higher-risk cases (complaints, refund disputes, order errors) are routed to a human with a summary and recommended action.</li>
</ol>

<h2>Results</h2>
<p>Within 30 days of deployment, 80% of all incoming tickets were being resolved fully autonomously. Average resolution time collapsed from 48 hours to 4 minutes. The six-person team now focuses entirely on complex cases, pre-sales support, and VIP customer relationships.</p>
<p>The brand projects $95,000 in annual savings from reduced support headcount growth. Customer satisfaction scores (CSAT) improved from 3.8 to 4.6 out of 5.</p>

<h2>Tools Used</h2>
<ul>
  <li><strong>OpenAI GPT-4o</strong> — response generation and intent classification</li>
  <li><strong>Zendesk</strong> — ticket management and automation triggers</li>
  <li><strong>Shopify API</strong> — live order and customer data</li>
  <li><strong>Qdrant</strong> — vector database for knowledge base search</li>
</ul>
    `,
  },
  {
    slug: "appointment-booking-automation",
    industry: "Healthcare / Operations",
    title: "Appointment Booking Automation",
    description:
      "Automated patient appointment scheduling, reminders, and follow-ups across 3 clinic locations — integrating EHR system, Google Calendar, and SMS in a single workflow.",
    challenge:
      "A multi-location physiotherapy clinic group was managing appointment scheduling for 3 locations manually. Front desk staff spent 35+ hours per week on phone-based scheduling, reminders, and rescheduling. No-show rates were running at 28%, costing thousands in wasted appointment slots each month.",
    solution:
      "We built an end-to-end appointment automation system using n8n that connects their EHR, Google Calendar, Twilio SMS, and email — handling booking, reminders, and post-appointment follow-ups without any front desk involvement.",
    outcome:
      "No-show rate dropped from 28% to 15.4% — a 45% reduction. Front desk staff saved 28 hours per week. Patient satisfaction scores rose to 4.9 stars. The clinics onboarded 40 additional weekly appointments using the time freed up.",
    metrics: [
      { icon: TrendingUp, value: "45%", label: "No-show reduction", color: "#EC4899" },
      { icon: Clock, value: "28h", label: "Staff hours saved/week", color: "#3B82F6" },
      { icon: Users, value: "4.9★", label: "Patient satisfaction", color: "#F59E0B" },
    ],
    tags: ["n8n", "Twilio", "Google Calendar", "EHR API"],
    gradient: "from-[#10B981]/10 to-transparent",
    accentColor: "#10B981",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
    timeline: "5 weeks build · 3-month results",
    content: `
<h2>The Problem</h2>
<p>A group of three physiotherapy clinics in Hyderabad was scheduling all appointments manually. Patients called or emailed to book, front desk staff checked a shared Google Sheet against each therapist's schedule, confirmed via phone, and sent reminders by hand. With 200+ appointments per week across three locations, the process was unsustainable.</p>
<p>The biggest pain point: a 28% no-show rate. Patients would simply not arrive for their slot, leaving therapists sitting idle and revenue on the table. The front desk spent 10+ hours per week just making reminder calls.</p>

<h2>The Automation We Built</h2>
<p>We designed a complete patient journey automation using n8n as the core orchestrator:</p>
<ol>
  <li><strong>Booking intake:</strong> A custom web form captures appointment requests and syncs directly with each therapist's Google Calendar, checking availability in real time.</li>
  <li><strong>Instant confirmation:</strong> The patient receives an SMS (via Twilio) and email confirmation within 30 seconds of booking, including location, therapist name, and preparation instructions.</li>
  <li><strong>Multi-stage reminders:</strong> Automated SMS reminders at 48 hours, 24 hours, and 2 hours before the appointment. Each message allows one-tap confirm or reschedule.</li>
  <li><strong>EHR sync:</strong> Confirmed appointments are pushed to their EHR system with patient details pre-populated, saving therapists 5 minutes of admin per session.</li>
  <li><strong>Post-appointment follow-up:</strong> 24 hours after each visit, an automated message collects a satisfaction rating and prompts rebooking if a follow-up is recommended.</li>
</ol>

<h2>Results After 3 Months</h2>
<p>No-show rates dropped from 28% to 15.4% — a 45% reduction. Front desk staff reclaimed 28 hours per week previously spent on manual scheduling and reminder calls. The clinics used that freed capacity to onboard 40 additional weekly appointments without hiring.</p>
<p>Patient satisfaction scores improved from 4.2 to 4.9 stars, with patients specifically citing the "easy booking" and "helpful reminders" in reviews.</p>

<h2>Tools Used</h2>
<ul>
  <li><strong>n8n</strong> — workflow orchestration and scheduling logic</li>
  <li><strong>Twilio</strong> — SMS confirmations and reminders</li>
  <li><strong>Google Calendar API</strong> — real-time availability management</li>
  <li><strong>EHR API</strong> — patient record sync</li>
  <li><strong>Resend</strong> — email confirmations and follow-ups</li>
</ul>
    `,
  },
];

  {
    slug: "email-marketing-automation",
    industry: "Marketing Agency",
    title: "Email Marketing Automation",
    description:
      "Built a behaviour-triggered drip engine that segments leads in real time and sends hyper-personalised sequences — increasing email revenue by 210% without growing the team.",
    challenge:
      "A performance marketing agency managing 12 client email programmes was running every campaign manually. List segmentation, sequence writes, and send scheduling consumed 22 hours per week of strategist time. Campaigns were batch-and-blast; engagement rates were declining month-on-month.",
    solution:
      "We built a behaviour-triggered segmentation and send engine using n8n, Instantly, and a GPT-4o copy layer. The workflow watches website events, purchase history, and email engagement in real time, assigns contacts to micro-segments automatically, and generates personalised subject lines and body copy for each segment — then schedules sends at each contact's optimal open time.",
    outcome:
      "Open rates climbed from 19% to 41%. Click-through rates tripled. Email-attributed revenue across the 12 client accounts grew by 210% in 6 months. The team reallocated 18 hours per week from manual campaign ops to creative strategy.",
    metrics: [
      { icon: TrendingUp, value: "210%", label: "Email revenue growth", color: "#3B82F6" },
      { icon: Mail, value: "41%", label: "Avg open rate (was 19%)", color: "#10B981" },
      { icon: Clock, value: "18h", label: "Strategist hours saved/week", color: "#8B5CF6" },
    ],
    tags: ["n8n", "GPT-4o", "Instantly", "Segment", "Klaviyo"],
    gradient: "from-[#3B82F6]/10 to-transparent",
    accentColor: "#3B82F6",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80",
    timeline: "3 weeks build · 6-month results",
    content: `
<h2>The Problem</h2>
<p>A performance marketing agency managing email programmes for 12 B2C and B2B clients was struggling with scale. Every campaign — welcome sequences, abandoned cart flows, win-back programmes — was being configured, written, and scheduled by hand. Two strategists were spending more than half their week on operational tasks rather than strategy.</p>
<p>Worse, campaigns were sent as batch-and-blast blasts to entire lists with minimal segmentation. Open rates had dropped from 28% to 19% over 12 months as inbox providers tightened spam filters in response to low engagement signals. Revenue attribution from email was declining across every account.</p>

<h2>The Automation We Built</h2>
<p>We designed a behaviour-triggered email engine that treats every contact as an individual rather than a list member:</p>
<ol>
  <li><strong>Event ingestion:</strong> Website events (page views, product interactions, form fills, checkout steps) stream into the n8n workflow via webhook in real time.</li>
  <li><strong>Live segmentation:</strong> Each event updates the contact's segment score across 14 micro-segments — cold, warm, high-intent, churned, VIP, category-specific, and more. Segment assignment happens within 2 seconds of the triggering event.</li>
  <li><strong>AI copy generation:</strong> A GPT-4o agent generates a personalised subject line and email body for each contact based on their segment, recent behaviour, and purchase history. Each client has a stored brand voice and product catalogue the agent draws from.</li>
  <li><strong>Optimal send timing:</strong> The workflow checks each contact's historical open-time data and schedules the send for their individual peak window rather than a global send time.</li>
  <li><strong>Feedback loop:</strong> Open, click, and unsubscribe events feed back into the segmentation model, continuously improving targeting without manual intervention.</li>
</ol>

<h2>Results After 6 Months</h2>
<p>Average open rates across all 12 accounts climbed from 19% to 41%. Click-through rates increased 3× as personalised content resonated with the right contacts at the right time. Email-attributed revenue grew by 210% — without any increase in send volume or ad spend.</p>
<p>The two strategists reclaimed 18 hours per week from campaign operations, using that time to focus on higher-value creative and strategic work.</p>

<h2>Tools Used</h2>
<ul>
  <li><strong>n8n</strong> — event processing, segmentation engine, and send orchestration</li>
  <li><strong>GPT-4o</strong> — personalised subject line and copy generation</li>
  <li><strong>Instantly / Klaviyo</strong> — email delivery per client stack</li>
  <li><strong>Segment</strong> — event stream ingestion</li>
</ul>
    `,
  },
  {
    slug: "real-estate-lead-nurturing",
    industry: "Real Estate",
    title: "Real Estate Lead Nurturing Pipeline",
    description:
      "Automated a full lead-to-listing pipeline for a property group — from portal enquiry through personalised follow-up, viewing scheduling, and agent briefing — cutting time-to-viewing by 67%.",
    challenge:
      "A mid-size residential property group was receiving 600+ inbound enquiries per month from Magicbricks, Housing.com, and their own website. Agents were manually calling every lead within business hours, missing evening and weekend enquiries. Of 600 monthly leads, only 80 converted to viewings. The rest went cold within 48 hours.",
    solution:
      "We built an end-to-end lead nurturing pipeline using n8n, Twilio WhatsApp, and a fine-tuned property assistant AI. Leads are captured from all portals, scored by budget and intent, enrolled in a personalised WhatsApp sequence, and self-book viewings — with a pre-briefing summary sent to the agent before each meeting.",
    outcome:
      "Time-to-first-contact dropped from 4 hours to 90 seconds. Viewing bookings increased from 80 to 214 per month — a 168% uplift. Agent briefing time per lead dropped from 20 minutes to zero. The group closed 22% more deals in Q1 without adding a single agent.",
    metrics: [
      { icon: TrendingUp, value: "168%", label: "More viewings booked", color: "#EC4899" },
      { icon: Clock, value: "90s", label: "Time to first contact", color: "#F59E0B" },
      { icon: Users, value: "22%", label: "More deals closed", color: "#10B981" },
    ],
    tags: ["n8n", "WhatsApp API", "Twilio", "Cal.com", "OpenAI"],
    gradient: "from-[#EC4899]/10 to-transparent",
    accentColor: "#EC4899",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
    timeline: "4 weeks build · 90-day results",
    content: `
<h2>The Problem</h2>
<p>A residential property group operating across three cities was receiving over 600 inbound enquiries per month from property portals, Google Ads, and their own website. With a team of 14 agents, manually calling every lead was impossible — especially in the evenings and weekends when buyers were most active.</p>
<p>The result was a leaking funnel: most leads never received contact within the critical first hour. Studies show that lead conversion rate drops 10× if the first contact takes longer than 5 minutes. This group's average was 4 hours. Of 600 monthly enquiries, only 80 converted to in-person viewings.</p>

<h2>The Automation We Built</h2>
<p>We designed a four-stage lead nurturing pipeline that operates 24 hours a day, 7 days a week:</p>
<ol>
  <li><strong>Instant capture and scoring:</strong> New leads from all portals trigger the workflow within seconds via webhook. An AI agent reads the enquiry, extracts budget, location preference, property type, and urgency signals, and assigns a priority score.</li>
  <li><strong>Personalised WhatsApp sequence:</strong> The lead receives a personalised WhatsApp message within 90 seconds — addressing them by name, referencing the specific property they enquired about, and offering three available viewing slots. The message is written in the client's brand tone.</li>
  <li><strong>Self-service booking:</strong> Confirmed viewings sync directly with the assigned agent's Cal.com calendar. The lead receives a confirmation with address, parking info, and what to bring.</li>
  <li><strong>Agent pre-brief:</strong> 30 minutes before each viewing, the agent receives a WhatsApp summary of the lead: their stated budget, how many properties they've viewed, their urgency level, and three suggested talking points to personalise the conversation.</li>
  <li><strong>Post-viewing follow-up:</strong> If no offer is made within 48 hours, an automated sequence offers alternative properties matching the buyer's stated criteria.</li>
</ol>

<h2>Results After 90 Days</h2>
<p>Viewing bookings grew from 80 to 214 per month — a 168% increase — driven entirely by faster response and 24/7 availability. Agents reported spending zero time on lead briefing, as the pre-briefing summary replaced their manual CRM research. The group's deal close rate improved by 22% in Q1, directly attributed to higher-quality, better-prepared viewings.</p>

<h2>Tools Used</h2>
<ul>
  <li><strong>n8n</strong> — lead capture, scoring, and sequence orchestration</li>
  <li><strong>Twilio WhatsApp API</strong> — two-way lead communication</li>
  <li><strong>OpenAI GPT-4o</strong> — personalised message generation and lead scoring</li>
  <li><strong>Cal.com</strong> — agent calendar and viewing slot management</li>
</ul>
    `,
  },
  {
    slug: "invoice-processing-automation",
    industry: "Finance / Operations",
    title: "Invoice & Accounts Payable Automation",
    description:
      "Eliminated manual invoice processing for a logistics company — automatically extracting, validating, coding, and approving 95% of invoices end-to-end, cutting processing cost by 73%.",
    challenge:
      "A regional logistics company processing 1,200+ vendor invoices per month was doing it entirely by hand. Three accounts payable clerks spent 90% of their time extracting data from PDFs, matching against POs, coding to cost centres, chasing approvals via email, and entering data into their ERP. Processing cost per invoice was $18. Errors caused late payment penalties averaging $12K per quarter.",
    solution:
      "We built a fully automated invoice processing pipeline using n8n, an LLM-powered OCR and extraction layer, and direct ERP integration. Invoices arrive by email, are read and validated against the PO database, automatically coded, routed for approval via Slack, and posted to the ERP — all without human touch for 95% of invoices.",
    outcome:
      "Processing cost per invoice dropped from $18 to $4.90 — a 73% reduction. Late payment penalties dropped to zero in the first full quarter. AP clerks were redeployed to vendor relationship management and cash flow forecasting. The company now processes invoices in 4 hours on average versus 6 business days.",
    metrics: [
      { icon: DollarSign, value: "73%", label: "Cost reduction per invoice", color: "#F59E0B" },
      { icon: FileText, value: "95%", label: "Invoices processed hands-free", color: "#10B981" },
      { icon: BarChart3, value: "4h", label: "Processing time (was 6 days)", color: "#3B82F6" },
    ],
    tags: ["n8n", "GPT-4o Vision", "Slack", "SAP", "PostgreSQL"],
    gradient: "from-[#F59E0B]/10 to-transparent",
    accentColor: "#F59E0B",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80",
    timeline: "6 weeks build · 3-month results",
    content: `
<h2>The Problem</h2>
<p>A regional logistics company with operations across four states was processing over 1,200 vendor invoices per month. The accounts payable team of three clerks was doing every step manually: downloading PDF invoices from email, re-keying line items into a spreadsheet, matching against purchase orders in their ERP, deciding on cost centre codes, emailing department heads for approval, and finally posting to SAP.</p>
<p>Average processing time per invoice was 6 business days end-to-end. Processing cost per invoice — including labour, error correction, and late payment penalties — worked out to $18. The team was making 3–5 data entry errors per day, some of which triggered late payment penalties from vendors. Over Q3, these penalties totalled $12,000.</p>

<h2>The Automation We Built</h2>
<p>We designed a six-stage intelligent invoice pipeline:</p>
<ol>
  <li><strong>Capture:</strong> A dedicated accounts-payable email inbox is monitored by n8n. Every new email attachment is extracted and classified — invoice, statement, or other.</li>
  <li><strong>AI extraction:</strong> GPT-4o Vision reads each invoice PDF and extracts structured data: vendor name, invoice number, date, line items, amounts, VAT, and payment terms. Extraction accuracy on this client's invoice corpus: 98.7%.</li>
  <li><strong>PO matching:</strong> The extracted data is matched against open purchase orders in SAP via API. Matched invoices (within a 2% tolerance) proceed automatically. Mismatches are flagged for human review.</li>
  <li><strong>Cost centre coding:</strong> An AI model trained on 18 months of historical coding decisions assigns the correct cost centre code for each line item. Accuracy on the validation set: 96%.</li>
  <li><strong>Approval routing:</strong> Invoices above threshold amounts are posted to a Slack channel as an approval card. Approvers click one button — approve or query. Approved invoices post automatically to SAP within 60 seconds.</li>
  <li><strong>Exception handling:</strong> Invoices that fail any validation step are queued in a human review dashboard with the specific failure reason highlighted, reducing resolution time from hours to minutes.</li>
</ol>

<h2>Results After 3 Months</h2>
<p>95% of invoices now complete the full process from email receipt to ERP posting without any human involvement. Average processing time dropped from 6 business days to 4 hours. Per-invoice processing cost fell from $18 to $4.90 — a 73% reduction. Late payment penalties dropped to zero in the first full quarter of operation.</p>
<p>The three AP clerks were reassigned to vendor relationship management and strategic cash flow forecasting — higher-value work the company previously had no capacity for.</p>

<h2>Tools Used</h2>
<ul>
  <li><strong>n8n</strong> — pipeline orchestration and email monitoring</li>
  <li><strong>GPT-4o Vision</strong> — PDF data extraction and cost centre coding</li>
  <li><strong>SAP API</strong> — PO matching and ERP posting</li>
  <li><strong>Slack</strong> — in-flow approval workflow</li>
  <li><strong>PostgreSQL</strong> — audit trail and exception queue</li>
</ul>
    `,
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
