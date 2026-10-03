"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// Last-resort boundary for errors in the root layout itself (error.tsx can't catch those).
// It replaces the whole document, so it carries its own <html>/<body> and inline styles.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "flex", alignItems: "center", background: "#000", color: "#F5F5F7", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ padding: "0 24px", maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A1A1AA" }}>
            <span style={{ color: "#2997FF" }}>Error</span>&nbsp;&nbsp;RudraAI
          </p>
          <h1 style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", lineHeight: 1, letterSpacing: "-0.04em", margin: "24px 0" }}>Something went wrong.</h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "#A1A1AA", margin: "0 0 32px" }}>
            The site hit an unexpected error and we&apos;ve been notified. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ height: 48, padding: "0 24px", borderRadius: 999, border: 0, background: "#0071E3", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
