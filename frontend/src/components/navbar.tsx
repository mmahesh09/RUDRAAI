"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Showcase", href: "/showcase" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Close the menu on Escape
  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  // The blog is for reading — no booking prompts there
  const showBooking = !isActive("/blog");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        isScrolled || isMobileOpen
          ? "bg-black/75 backdrop-blur-xl backdrop-saturate-150 border-b border-white/[0.08]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container-wide flex h-14 items-center justify-between gap-6">
        {/* Wordmark */}
        <Link href="/" className="font-heading text-[17px] font-semibold tracking-[-0.02em] text-[#F5F5F7]" aria-label="RudraAI home">
          Rudra<span className="text-[#BF5AF2]">AI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:block" aria-label="Main">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors",
                    isActive(link.href) ? "text-[#F5F5F7]" : "text-[#A1A1AA] hover:text-[#F5F5F7]"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {showBooking && (
            <Link
              href="/booking"
              className="hidden sm:inline-flex h-8 items-center rounded-full bg-[#8944AB] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#7A3A9A]"
            >
              Book a call
            </Link>
          )}
          <button
            type="button"
            onClick={() => setIsMobileOpen((o) => !o)}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            className="md:hidden -mr-2 flex h-11 w-11 items-center justify-center rounded-full text-[#F5F5F7]"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — full-width sheet under the bar */}
      {isMobileOpen && (
        <nav id="mobile-menu" aria-label="Main" className="md:hidden border-t border-white/[0.08] bg-black">
          <ul className="container-wide ledger py-2">
            {[...navLinks, { label: "Feedback", href: "/feedback" }].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between py-4 font-heading text-2xl font-semibold tracking-[-0.02em]",
                    isActive(link.href) ? "text-[#BF5AF2]" : "text-[#F5F5F7]"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {showBooking && (
            <div className="container-wide pb-6">
              <Link
                href="/booking"
                className="flex h-12 w-full items-center justify-center rounded-full bg-[#8944AB] text-[15px] font-semibold text-white"
              >
                Book a free call · {SITE.call.short}
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
