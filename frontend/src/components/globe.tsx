"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

interface GlobeProps {
  className?: string;
}

export default function Globe({ className }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    let globeInstance: ReturnType<typeof createGlobe> | null = null;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use offsetWidth; fall back to 400 if not yet laid out
    const size = canvas.offsetWidth > 0 ? canvas.offsetWidth : 400;

    globeInstance = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 5,
      baseColor: [0.15, 0.15, 0.2],
      markerColor: [1, 0.42, 0],
      glowColor: [1, 0.42, 0],
      markers: [
        { location: [37.7749, -122.4194], size: 0.05 },
        { location: [40.7128, -74.006], size: 0.05 },
        { location: [51.5074, -0.1278], size: 0.04 },
        { location: [48.8566, 2.3522], size: 0.04 },
        { location: [35.6762, 139.6503], size: 0.05 },
        { location: [1.3521, 103.8198], size: 0.05 },
        { location: [19.076, 72.8777], size: 0.05 },
        { location: [-33.8688, 151.2093], size: 0.04 },
        { location: [55.7558, 37.6176], size: 0.04 },
        { location: [25.2048, 55.2708], size: 0.04 },
        { location: [-23.5505, -46.6333], size: 0.04 },
        { location: [52.52, 13.405], size: 0.04 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.004;
      },
    });

    return () => {
      globeInstance?.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "auto", aspectRatio: "1 / 1", display: "block" }}
    />
  );
}
