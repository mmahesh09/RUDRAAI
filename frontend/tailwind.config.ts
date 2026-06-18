import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FF6B00",
          hover: "#FF8533",
          dark: "#CC5500",
          foreground: "#FFFFFF",
        },
        surface: {
          DEFAULT: "#111117",
          hover: "#17171F",
          card: "rgba(255,255,255,0.03)",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.15)",
        },
        muted: {
          DEFAULT: "#71717A",
          foreground: "#A1A1AA",
        },
        accent: {
          orange: "#FF6B00",
          "orange-glow": "rgba(255,107,0,0.2)",
          purple: "#8B5CF6",
          blue: "#3B82F6",
          green: "#10B981",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        heading: ["var(--font-montserrat)", "sans-serif"],
        subheading: ["var(--font-raleway)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "orange-gradient": "linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%)",
        "dark-gradient": "linear-gradient(180deg, #09090B 0%, #111117 100%)",
        "hero-glow":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,107,0,0.15), transparent)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
        shimmer:
          "linear-gradient(90deg, transparent 0%, rgba(255,107,0,0.4) 50%, transparent 100%)",
      },
      backgroundSize: {
        "grid-sm": "24px 24px",
        "grid-md": "40px 40px",
        "grid-lg": "60px 60px",
        "shimmer-size": "200% 100%",
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "flow-line": "flow-line 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "fade-up": "fade-up 0.5s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        marquee: "marquee 30s linear infinite",
        "border-glow": "border-glow 3s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        "flow-line": {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(255,107,0,0.3)" },
          "50%": { borderColor: "rgba(255,107,0,0.8)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "glow-orange": "0 0 40px rgba(255,107,0,0.3)",
        "glow-orange-sm": "0 0 20px rgba(255,107,0,0.2)",
        "neo-dark":
          "8px 8px 16px rgba(0,0,0,0.6), -2px -2px 8px rgba(255,255,255,0.02)",
        "neo-card":
          "4px 4px 12px rgba(0,0,0,0.5), -2px -2px 8px rgba(255,255,255,0.02)",
        glass: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
    },
  },
  plugins: [animate],
};

export default config;
