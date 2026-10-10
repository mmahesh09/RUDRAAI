"use client";

import "lenis/dist/lenis.css";
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Fixed navbar is h-14 (56px); anchors land a little below it
export const NAV_OFFSET = -72;

// Admin and portal scroll inside their own <main>, so window smoothing does nothing useful there
const NATIVE_SCROLL_PREFIXES = ["/admin", "/portal"];

function RouteReset() {
  const pathname = usePathname();
  const lenis = useLenis();

  // Client navigation keeps the old scroll target alive; start each page at the top
  useEffect(() => {
    if (!lenis || window.location.hash) return;
    lenis.scrollTo(0, { immediate: true, force: true });
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const enabled = !reducedMotion && !NATIVE_SCROLL_PREFIXES.some((p) => pathname?.startsWith(p));

  // Root mode publishes the instance globally, so useLenis() works in children rendered
  // beside it — toggling Lenis never remounts the page tree.
  return (
    <>
      {enabled && (
        <ReactLenis
          root
          options={{
            autoRaf: true,
            duration: 1.1,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            anchors: { offset: NAV_OFFSET },
          }}
        >
          <RouteReset />
        </ReactLenis>
      )}
      {children}
    </>
  );
}
