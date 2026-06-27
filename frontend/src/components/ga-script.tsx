"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CONSENT_KEY = "rudraai_cookie_consent";

export default function GaScript() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const check = () =>
      setConsented(localStorage.getItem(CONSENT_KEY) === "accepted");
    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  if (!consented || !GA_ID) return null;
  return <GoogleAnalytics gaId={GA_ID} />;
}
