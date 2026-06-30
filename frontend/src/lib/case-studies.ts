import { TrendingUp, Clock, DollarSign, Users, type LucideIcon } from "lucide-react";

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

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
