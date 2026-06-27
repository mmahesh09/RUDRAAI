"use client";

import { useEffect } from "react";

const TOKEN = process.env.NEXT_PUBLIC_CHATWOOT_TOKEN;
const BASE_URL = process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL || "https://app.chatwoot.com";
const CONSENT_KEY = "rudraai_cookie_consent";

declare global {
  interface Window {
    chatwootSettings?: Record<string, unknown>;
    chatwootSDK?: { run: (opts: { websiteToken: string; baseUrl: string }) => void };
  }
}

export default function ChatwootWidget() {
  useEffect(() => {
    if (!TOKEN) return;
    if (localStorage.getItem(CONSENT_KEY) !== "accepted") return;
    if (document.getElementById("chatwoot-script")) return;

    window.chatwootSettings = { hideMessageBubble: false, position: "right", locale: "en", type: "standard" };

    const script = document.createElement("script");
    script.id = "chatwoot-script";
    script.src = `${BASE_URL}/packs/js/sdk.js`;
    script.defer = true;
    script.async = true;
    script.onload = () => {
      window.chatwootSDK?.run({ websiteToken: TOKEN!, baseUrl: BASE_URL });
    };
    document.head.appendChild(script);
  }, []);

  return null;
}
