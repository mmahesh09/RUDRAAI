import { TrendingUp, Clock, DollarSign, Users, MessageSquare, Percent, type LucideIcon } from "lucide-react";

export interface ResearchMetric {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
}

export interface ResearchSource {
  label: string;
  url: string;
}

export interface ResearchCaseStudy {
  slug: string;
  company: string;
  sourceType: "Medium" | "Google Cloud" | "Industry Press";
  category: string;
  title: string;
  description: string;
  metrics: ResearchMetric[];
  tags: string[];
  gradient: string;
  accentColor: string;
  image: string;
  publishedContext: string;
  sources: ResearchSource[];
  content: string;
}

export const researchCaseStudies: ResearchCaseStudy[] = [
  {
    slug: "klarna-ai-customer-service",
    company: "Klarna",
    sourceType: "Medium",
    category: "Customer Support AI",
    title: "What Klarna's AI Assistant Teaches Us About Scaling Support — and Where It Broke",
    description:
      "A research review of Klarna's OpenAI-powered support assistant: the 2.3M-conversation first month, the $40M profit claim, and the 2025 course-correction that's more instructive than the headline number.",
    metrics: [
      { icon: MessageSquare, value: "2.3M", label: "Conversations handled, month 1", color: "#8B5CF6" },
      { icon: Clock, value: "<2 min", label: "Resolution time (was 11 min)", color: "#10B981" },
      { icon: DollarSign, value: "$40M", label: "Estimated 2024 profit impact", color: "#FF6B00" },
    ],
    tags: ["OpenAI", "LLM Agents", "Customer Support", "Fintech"],
    gradient: "from-[#8B5CF6]/10 to-transparent",
    accentColor: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80",
    publishedContext: "Public case study · Feb 2024 launch, 2025 follow-up reporting",
    sources: [
      { label: "Klarna: \"AI assistant handles two-thirds of customer service chats\" (official press release)", url: "https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/" },
      { label: "Efi Pylarinou, \"Klarna's GenAI Journey: A Case Study Using the 'AI Native' Framework\" (Medium)", url: "https://efipm.medium.com/klarnas-genai-journey-a-case-study-using-the-ai-native-framework-0d741a193c8d" },
      { label: "LangChain, \"How Klarna's AI assistant redefined customer support at scale\"", url: "https://blog.langchain.com/customers-klarna/" },
    ],
    content: `
<h2>Why This Case Study Matters</h2>
<p>Klarna's AI assistant is one of the most cited — and most re-litigated — examples of enterprise generative AI in production. It's worth studying precisely because the story doesn't end at the impressive launch numbers. Read as a two-act case study, it tells you far more about deploying AI agents responsibly than either act alone.</p>

<h2>Act One: The Launch (Feb 2024)</h2>
<p>According to Klarna's own press release, the OpenAI-powered assistant handled <strong>2.3 million conversations</strong> in its first month — two-thirds of all customer service chats — doing the equivalent work of <strong>700 full-time agents</strong>. Resolution time dropped from 11 minutes to under 2. Customer satisfaction scores reportedly reached parity with human agents, and repeat inquiries fell 25%. Klarna estimated the assistant would drive <strong>$40M in profit improvement</strong> for 2024.</p>
<p>The architecture, as analyzed in Efi Pylarinou's Medium write-up on Klarna's "AI Native" framework, wasn't a single chatbot bolted onto a help desk — it was a systems-level rebuild: the assistant plugged into order data, refund logic, and policy documents so it could take action, not just answer FAQs.</p>

<h2>Act Two: The Correction (2025)</h2>
<p>This is the part most case studies skip. In May 2025, Klarna's CEO Sebastian Siemiatkowski publicly acknowledged the company had cut human support capacity too aggressively, and began rehiring agents after customers complained about generic answers on complex, nuanced cases. By Q3 2025, Klarna reported $60M in documented savings — a real number, but arrived at only after rebuilding some of the human-in-the-loop capacity it had removed.</p>

<h2>The Research Takeaway</h2>
<p>The lesson isn't "AI replaces support teams" — it's <strong>"AI absorbs tier-1 volume; humans move up the value chain."</strong> The failure mode wasn't the AI's accuracy on routine tickets (order status, refunds, policy questions) — it was removing the escalation path and institutional knowledge needed for the 10–15% of cases that are genuinely ambiguous.</p>
<p>For any team automating support, Klarna's experience argues for three design principles from day one:</p>
<ul>
  <li><strong>Keep a real escalation lane.</strong> Don't treat human agents as a cost to eliminate — treat them as the tier for the cases your confidence scoring flags as uncertain.</li>
  <li><strong>Measure resolution quality, not just resolution speed.</strong> A 2-minute wrong answer is worse than an 11-minute right one; CSAT parity metrics can mask degradation on the long tail.</li>
  <li><strong>Plan for reversibility.</strong> Klarna could rehire and recover because the AI layer was additive to their systems, not a replacement of the underlying support infrastructure.</li>
</ul>
<p>This is the same architecture RudraAI uses for support automation projects: autonomous resolution for deterministic categories, explicit confidence-based routing to humans for everything else — see our <a href="/case-studies/customer-support-ai-agent">Customer Support AI Agent case study</a> for how that plays out at a smaller scale.</p>
    `,
  },
  {
    slug: "google-cloud-vertex-ai-mortgage-underwriting",
    company: "United Wholesale Mortgage",
    sourceType: "Google Cloud",
    category: "Financial Services AI",
    title: "How Vertex AI Doubled Underwriter Productivity — A Look at Google Cloud's Own Numbers",
    description:
      "Google Cloud publishes United Wholesale Mortgage as a customer story on Vertex AI and Gemini. We break down what the published productivity gains actually imply about where document-heavy financial workflows are ripe for automation.",
    metrics: [
      { icon: TrendingUp, value: "2x", label: "Underwriter productivity", color: "#3B82F6" },
      { icon: Clock, value: "9 mo", label: "Time to measurable impact", color: "#10B981" },
      { icon: Users, value: "50K+", label: "Brokers affected downstream", color: "#F59E0B" },
    ],
    tags: ["Google Cloud", "Vertex AI", "Gemini", "Financial Services"],
    gradient: "from-[#3B82F6]/10 to-transparent",
    accentColor: "#3B82F6",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80",
    publishedContext: "Google Cloud published customer story",
    sources: [
      { label: "Google Cloud, \"Real-world gen AI use cases from the world's leading organizations\"", url: "https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders" },
      { label: "Google Cloud Customer Stories — Generative AI", url: "https://cloud.google.com/ai/generative-ai/stories" },
    ],
    content: `
<h2>Why This Case Study Matters</h2>
<p>Mortgage underwriting is one of the most document-dense, rules-heavy processes in financial services — thousands of pages of income verification, tax records, and property documentation per loan, reviewed against constantly shifting compliance rules. Google Cloud's published case on United Wholesale Mortgage (UWM) is a useful data point precisely because it's a regulated, high-stakes financial workflow, not a low-risk internal tool.</p>

<h2>What Google Cloud Reports</h2>
<p>Per Google Cloud's own customer-story reporting, UWM built its underwriting workflow on <strong>Vertex AI</strong>, <strong>Gemini</strong>, and <strong>BigQuery</strong>. Within roughly nine months, the company reported <strong>more than doubling underwriter productivity</strong> — translating into shorter loan closing times across a broker network exceeding 50,000 partners. Google's broader gen-AI use case roundup pairs this with adjacent enterprise examples: a 15% efficiency lift in contact-center agent assist, and a security operations deployment reaching 90% automation of tier-1 analyst triage.</p>

<h2>Reading Between the Numbers</h2>
<p>A "2x productivity" claim in underwriting almost always decomposes into the same three sub-gains, based on how these systems are typically architected on Vertex AI:</p>
<ul>
  <li><strong>Document extraction:</strong> structured data (income, assets, liabilities) pulled automatically from unstructured PDFs and scans, replacing manual re-keying.</li>
  <li><strong>Rules cross-checking:</strong> an LLM layer flags inconsistencies against underwriting guidelines before a human ever opens the file, so underwriters review exceptions rather than re-verify everything from scratch.</li>
  <li><strong>Contextual summarization:</strong> long borrower histories condensed into a reviewable brief, cutting the time underwriters spend reconstructing context per file.</li>
</ul>
<p>None of that requires replacing underwriter judgment — it removes the clerical layer around it, which is exactly why the gains show up as productivity rather than headcount reduction.</p>

<h2>The Research Takeaway</h2>
<p>For any regulated, document-heavy workflow — mortgage, insurance claims, trade finance, KYC — the pattern worth copying isn't "add a chatbot," it's <strong>extraction + rules-checking + summarization as three separate AI steps feeding one human review point.</strong> That's the same shape we use in RudraAI's own <a href="/case-studies/invoice-processing-automation">Invoice &amp; Accounts Payable Automation case study</a>, just applied to a different document type and compliance regime.</p>
    `,
  },
  {
    slug: "n8n-workflow-automation-roi-patterns",
    company: "Delivery Hero, Unbabel & Koralplay",
    sourceType: "Medium",
    category: "Workflow Automation ROI",
    title: "What 3 Published n8n Case Studies Reveal About Realistic Automation ROI",
    description:
      "n8n.io and Medium writers have documented dozens of production workflow-automation deployments. We reviewed three with disclosed numbers — Delivery Hero, Unbabel, and Koralplay — to find the pattern in what actually gets automated first.",
    metrics: [
      { icon: Clock, value: "200h", label: "Delivery Hero: hours saved/month", color: "#10B981" },
      { icon: Percent, value: "51%", label: "Unbabel: manual ops reduced", color: "#3B82F6" },
      { icon: DollarSign, value: "25:1", label: "Koralplay: reported ROI", color: "#FF6B00" },
    ],
    tags: ["n8n", "Workflow Automation", "ROI Analysis", "SMB Automation"],
    gradient: "from-[#10B981]/10 to-transparent",
    accentColor: "#10B981",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&q=80",
    publishedContext: "Published case studies, n8n.io and Medium, 2025",
    sources: [
      { label: "n8n.io — Case Studies", url: "https://n8n.io/case-studies/" },
      { label: "Tugui Dragos-Constantin, \"How Businesses Use n8n: Real-World Workflows and Case Studies\" (Medium)", url: "https://medium.com/@tuguidragos/how-businesses-use-n8n-real-world-workflows-and-case-studies-4f8268e84e06" },
      { label: "\"Supply Chain Automation with AI Agents Using n8n\" — Data Science Collective (Medium)", url: "https://medium.com/data-science-collective/supply-chain-automation-with-ai-agents-using-n8n-90ca371f70d1" },
    ],
    content: `
<h2>Why This Case Study Matters</h2>
<p>Vendor case studies are easy to dismiss as marketing. But when you line up several independently published n8n deployments side by side — different industries, different team sizes, written up separately on Medium and n8n's own case study library — a consistent shape emerges in <em>what</em> gets automated first and <em>why</em> the ROI lands where it does.</p>

<h2>Three Published Deployments</h2>
<p><strong>Delivery Hero</strong> reports saving <strong>200 hours per month</strong> from a single workflow — internal reporting suggests this came from consolidating a recurring, multi-system data-pull-and-report task that previously required manual cross-referencing across tools.</p>
<p><strong>Unbabel</strong>, a language-ops company, reduced manual operational work by <strong>51%</strong> by connecting internal tools, client systems, and QA processes through n8n — replacing what had been a set of disconnected manual handoffs between systems that didn't natively talk to each other.</p>
<p><strong>Koralplay</strong> automated <strong>70% of payment support tickets</strong>, saving 40+ hours weekly and reporting a <strong>25:1 ROI</strong> — a number achievable specifically because payment support tickets tend to be highly templated (refund status, failed payment retries, invoice requests).</p>

<h2>The Research Takeaway</h2>
<p>Across all three, the automated task shares three traits: <strong>high volume, low judgment variance, and multi-system data stitching.</strong> None of these teams started by automating their hardest or highest-stakes decision — they started with the workflow that was (a) repeated often enough to matter, (b) mostly rule-based, and (c) currently done manually because it required logging into 3+ separate systems, not because it required expert judgment.</p>
<p>That's the same prioritization logic RudraAI applies when scoping a new automation engagement: find the highest-volume, most system-fragmented manual process first — it's usually where the ROI shows up fastest, as in our own <a href="/case-studies/appointment-booking-automation">Appointment Booking Automation</a> and <a href="/case-studies/email-marketing-automation">Email Marketing Automation</a> case studies.</p>
    `,
  },
];

export function getResearchCaseStudyBySlug(slug: string): ResearchCaseStudy | undefined {
  return researchCaseStudies.find((c) => c.slug === slug);
}
