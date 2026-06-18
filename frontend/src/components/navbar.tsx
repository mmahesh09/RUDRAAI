"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Industries", href: "/industries" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.21, 1.02, 0.73, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "py-2"
            : "py-4"
        )}
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div
            className={cn(
              "flex items-center justify-between rounded-2xl px-5 h-14 transition-all duration-500",
              isScrolled
                ? "shadow-glass border border-white/10"
                : "border border-white/06",
              "bg-[rgba(9,9,11,0.75)] backdrop-blur-xl"
            )}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF8C00] flex items-center justify-center shadow-[0_0_15px_rgba(255,107,0,0.4)] group-hover:shadow-[0_0_25px_rgba(255,107,0,0.6)] transition-shadow duration-300">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-heading font-black text-lg text-white tracking-tight">
                Rudra<span className="text-[#FF6B00]">AI</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-subheading font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "text-white"
                        : "text-[#A1A1AA] hover:text-white hover:bg-white/05"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="active-nav"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#FF6B00] rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/contact"
                className="text-sm font-subheading font-medium text-[#A1A1AA] hover:text-white transition-colors px-3 py-2"
              >
                Contact
              </Link>
              <Button asChild size="sm" className="h-9 px-5 text-sm font-heading font-bold">
                <Link href="/booking">
                  Book Free Call
                </Link>
              </Button>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/05 transition-colors"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 z-40 rounded-2xl glass-strong shadow-glass border border-white/10 p-4 md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-subheading font-medium transition-colors",
                      isActive
                        ? "bg-[rgba(255,107,0,0.1)] text-[#FF6B00] border border-[rgba(255,107,0,0.2)]"
                        : "text-[#A1A1AA] hover:text-white hover:bg-white/05"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/contact"
                className="px-4 py-3 rounded-xl text-sm font-subheading font-medium text-[#A1A1AA] hover:text-white hover:bg-white/05 transition-colors"
              >
                Contact
              </Link>
              <div className="pt-2 border-t border-white/08 mt-1">
                <Button asChild className="w-full font-heading font-bold">
                  <Link href="/booking">Book Free Automation Call</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
