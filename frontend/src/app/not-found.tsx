import Link from "next/link";
import { ArrowRight } from "lucide-react";

const LINKS = [
  { label: "Services", href: "/services" },
  { label: "Showcase", href: "/showcase" },
  { label: "Blog", href: "/blog" },
  { label: "Book a call", href: "/booking" },
];

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 -z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-hidden="true">
        <div className="h-full border-x border-white/[0.06]" />
      </div>
      <div className="container-wide py-24">
        <p className="eyebrow">
          <span className="text-[#2997FF]">404</span>&nbsp;&nbsp;Page not found
        </p>
        <h1 className="mt-8 max-w-[14ch] font-heading text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[#F5F5F7]">
          This step didn&apos;t <span className="text-[#2997FF]">run.</span>
        </h1>
        <p className="mt-8 max-w-[46ch] text-lg leading-[1.65] text-[#A1A1AA]">
          The page you&apos;re looking for has moved or never existed. Try one of these instead.
        </p>
        <ul className="mt-10 flex flex-wrap gap-2">
          <li>
            <Link
              href="/"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#0071E3] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#0077ED]"
            >
              Back to home
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </li>
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="inline-flex h-12 items-center rounded-full border border-white/[0.18] px-6 text-[15px] font-medium text-[#F5F5F7] transition-colors hover:border-white/40"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
