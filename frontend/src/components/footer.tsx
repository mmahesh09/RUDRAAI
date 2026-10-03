import Link from "next/link";
import { SITE } from "@/lib/site";

const COLUMNS = [
  {
    title: "Work",
    links: [
      { label: "Services", href: "/services" },
      { label: "Showcase", href: "/showcase" },
      { label: "Industries", href: "/industries" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Automation guide", href: "/automation-guide" },
      { label: "Feedback", href: "/feedback" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/privacy#cookies" },
      { label: "DPDP Act 2023", href: "/privacy#dpdp" },
    ],
  },
];

// X (Twitter) mark — the bird logo was retired
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.733-8.835L2.25 2.25h6.961l4.263 5.632 4.77-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SOCIAL = [
  { icon: XIcon, label: "RudraAI on X", href: "https://x.com/Rudraai2" },
  { icon: InstagramIcon, label: "RudraAI on Instagram", href: "https://www.instagram.com/rudraai.online/" },
  { icon: LinkedInIcon, label: "RudraAI on LinkedIn", href: "https://www.linkedin.com/company/rudrai" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.08] bg-black">
      <div className="container-wide pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5">
            <p className="max-w-[30ch] font-heading text-2xl font-medium leading-snug tracking-[-0.02em] text-[#F5F5F7]">
              Websites, AI agents and automations — built properly, owned by you.
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-6 inline-block text-[15px] text-[#F5F5F7] underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-[#BF5AF2]"
            >
              {SITE.email}
            </a>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">
              {SITE.location} · Working worldwide
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7" aria-label="Footer">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">{col.title}</h2>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[14px] text-[#A1A1AA] transition-colors hover:text-[#F5F5F7]">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Oversized wordmark — the footer's one bold move */}
        <p
          className="mt-20 select-none font-heading font-semibold leading-[0.8] tracking-[-0.06em] text-[#F5F5F7] text-[clamp(3.5rem,20vw,19rem)]"
          aria-hidden="true"
        >
          Rudra<span className="text-[#BF5AF2]">AI</span>
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-[#8A8A93]">© {new Date().getFullYear()} RudraAI. All rights reserved.</p>
          <ul className="flex gap-1">
            {SOCIAL.map(({ icon: Icon, label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-[#A1A1AA] transition-colors hover:text-[#F5F5F7]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
