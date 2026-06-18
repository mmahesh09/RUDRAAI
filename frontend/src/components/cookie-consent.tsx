"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import Link from "next/link";

const CONSENT_KEY = "rudraai_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:right-6 md:max-w-sm"
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
        >
          <div className="relative rounded-2xl border border-white/[0.1] bg-[#111119] shadow-2xl p-5">
            {/* Close button */}
            <button
              onClick={decline}
              className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-md text-[#71717A] hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.2)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Cookie className="w-4 h-4 text-[#FF6B00]" />
              </div>
              <div>
                <p className="text-sm font-subheading font-semibold text-white mb-1">
                  We use cookies
                </p>
                <p className="text-xs font-body text-[#71717A] leading-relaxed">
                  We use one cookie to remember your consent preference. No tracking, no ads.{" "}
                  <Link href="/privacy" className="text-[#FF6B00] hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={decline}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-body text-[#A1A1AA] border border-white/[0.08] hover:border-white/[0.15] hover:text-white transition-all"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-heading font-semibold text-white bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] hover:shadow-[0_4px_16px_rgba(255,107,0,0.4)] transition-all"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
