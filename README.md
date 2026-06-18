# RudraAI — AI Automation Agency Website

A premium, full-stack website for **RudraAI**, an AI automation agency that builds intelligent n8n workflows and AI agents for businesses.

**Live at:** `http://localhost:3000` (dev) · `http://localhost:3000` (prod)
**LinkedIn:** https://www.linkedin.com/company/rudrai

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS v3, custom design system |
| Animation | Framer Motion, SMIL SVG animations |
| Icons | Lucide React |
| UI Primitives | Radix UI (Dialog, Slot, Select, Tabs, etc.) |
| Backend | Express.js, Nodemailer, Zod, Helmet |
| Automation | n8n (self-hosted), webhook integration |

---

## Project Structure

```
RUDRAAI/
├── frontend/               # Next.js 15 app
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   │   ├── page.tsx            # Homepage
│   │   │   ├── booking/page.tsx    # Book free audit (CoachSchedulingCard)
│   │   │   ├── contact/page.tsx    # Contact form
│   │   │   ├── pricing/page.tsx    # Pricing tiers
│   │   │   ├── services/page.tsx   # Services + AnimatedRoadmap
│   │   │   ├── about/page.tsx      # Team & mission
│   │   │   ├── industries/page.tsx
│   │   │   ├── case-studies/page.tsx
│   │   │   ├── blog/page.tsx
│   │   │   └── not-found.tsx       # Custom 404 page
│   │   ├── components/
│   │   │   ├── ui/                 # Reusable UI components (shadcn-style)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── alert.tsx
│   │   │   │   ├── empty.tsx
│   │   │   │   ├── dot-pattern-1.tsx       # Dot grid background
│   │   │   │   ├── faq-5.tsx               # FAQ list component
│   │   │   │   ├── pricing-table.tsx       # Pricing cards
│   │   │   │   ├── coach-scheduling-card.tsx  # Booking scheduler
│   │   │   │   ├── hero-section-5.tsx      # AnimatedRoadmap
│   │   │   │   ├── animated-shiny-text.tsx
│   │   │   │   ├── animated-group.tsx
│   │   │   │   └── customers-section.tsx
│   │   │   ├── hero.tsx                    # Hero + n8n workflow animation
│   │   │   ├── workflow-animation.tsx      # n8n-style SVG canvas
│   │   │   ├── stats-section.tsx           # 6 stat cards (Lucide icons)
│   │   │   ├── services-section.tsx
│   │   │   ├── features-section.tsx
│   │   │   ├── case-studies-section.tsx
│   │   │   ├── how-it-works-section.tsx
│   │   │   ├── industries-section.tsx
│   │   │   ├── testimonials-section.tsx
│   │   │   ├── quote-section.tsx           # DotPattern famous quote
│   │   │   ├── faq-section.tsx             # RudraAI FAQ (8 Q&As)
│   │   │   ├── cta-section.tsx
│   │   │   ├── navbar.tsx
│   │   │   └── footer.tsx
│   │   └── lib/
│   │       ├── api.ts          # apiPost() utility for backend calls
│   │       └── utils.ts        # cn() Tailwind merge helper
│   ├── public/
│   │   └── avatars/
│   │       ├── avatar-boy.png   # Cartoon boy avatar
│   │       └── avatar-girl.png  # Cartoon girl avatar
│   └── .env.local              # NEXT_PUBLIC_API_URL=http://localhost:4000
│
└── backend/                # Express.js API
    ├── src/
    │   └── index.ts        # /api/contact, /api/booking endpoints
    └── .env                # SMTP, n8n webhook, port config
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Frontend

```bash
cd frontend
npm install
npm run dev       # dev server → http://localhost:3000
npm run build     # production build
npm run start     # serve production build
```

### Backend

```bash
cd backend
npm install
# fill in backend/.env (SMTP credentials, etc.)
npm run dev       # API server → http://localhost:4000
```

### Environment Variables

**`frontend/.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**`backend/.env`**
```
PORT=4000
CONTACT_TO=neuronhyd3@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
N8N_CONTACT_WEBHOOK=       # optional
N8N_BOOKING_WEBHOOK=       # optional
```

---

## Pages & Features

| Route | Description |
|---|---|
| `/` | Homepage — hero, stats, services, features, case studies, testimonials, quote, FAQ, CTA |
| `/booking` | Free audit booking — CoachSchedulingCard + detail form → backend API |
| `/contact` | Contact form → backend API (nodemailer) |
| `/pricing` | 4-tier pricing: Starter / Growth / Enterprise / Custom |
| `/services` | Services list + AnimatedRoadmap process section |
| `/about` | Team, mission, values |
| `/industries` | Industry verticals |
| `/case-studies` | Client case studies |
| `/blog` | Blog index |

---

## Design System

**Colors**
- Background: `#09090B`, `#0D0D14`
- Accent orange: `#FF6B00` → `#FF8C00`
- Green success: `#10B981`
- Purple: `#8B5CF6`
- Muted text: `#A1A1AA`, `#71717A`

**Fonts** (set in `globals.css`)
- Heading: DM Sans (black/bold weights)
- Body: Inter
- Subheading: Plus Jakarta Sans

**Utility classes** (defined in `globals.css`)
- `.neo-card` — dark glass card
- `.glass` — frosted glass surface
- `.grid-bg` — subtle dot grid background
- `.container-wide` — max-w-7xl centered
- `.section-padding` — py-20 md:py-28
- `.text-gradient-orange` — orange gradient text

---

## Third-Party Services to Connect

| Service | Purpose | Status |
|---|---|---|
| SMTP (Gmail / SendGrid) | Contact & booking confirmation emails | ⚠️ Needs credentials in `backend/.env` |
| n8n (self-hosted) | Workflow automation engine | Optional — webhook vars in `.env` |
| Google Analytics / Plausible | Traffic analytics | Not yet added |
| Stripe | Payment processing (for Starter plan checkout) | Not yet added |
| Calendly / Cal.com | Calendar sync for bookings | Optional integration |
| Crisp / Intercom | Live chat widget | Not yet added |

---

## Adding New Components

Paste the component code below this line and run the AI to integrate it into the codebase.

---

## Security Implementation

All items below have been implemented in the codebase.

### 01 — Legal & Privacy

| Item | Status | Implementation |
|---|---|---|
| Privacy Policy | ✅ Done | `/privacy` page — GDPR, CCPA, cookie policy, data retention |
| Terms of Service | ✅ Done | `/terms` page — payment, IP, liability, governing law |
| Cookie consent | ✅ Done | `CookieConsent` component in root layout, stores in `localStorage` |
| GDPR data minimisation | ✅ Done | Only name, email, company, message collected — no phone, no tracking |
| Data storage transparency | ✅ Done | Documented in Privacy Policy — email only, 24-month retention |

### 02 — Security Basics (OWASP Top 10)

| Item | Status | Implementation |
|---|---|---|
| Security headers | ✅ Done | `next.config.ts` — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| XSS prevention | ✅ Done | React JSX escaping + `escapeHtml()` on all user data in email bodies (backend routes) |
| SQL injection | ✅ N/A | No database — submissions go directly to email via nodemailer |
| Input validation | ✅ Done | Zod schemas on all backend routes; `required`/`minLength` on frontend |
| Session security | ✅ N/A | No authentication/sessions — stateless form submissions only |

### 03 — Secrets & API Keys

| Item | Status | Implementation |
|---|---|---|
| `.gitignore` files | ✅ Done | Root, `frontend/`, and `backend/` `.gitignore` created — covers `.env*`, `node_modules`, `.next` |
| No keys in frontend | ✅ Done | Only `NEXT_PUBLIC_API_URL` (a URL, not a secret) in frontend env |
| Sanitised error responses | ✅ Done | Backend never returns stack traces or internal details — generic 500 message only |
| Secrets in logs | ✅ Done | Only `err.message` logged, not full error objects or stack traces |
| All keys server-side | ✅ Done | SMTP, n8n webhook URLs all in `backend/.env` — never sent to client |

### 04 — Abuse Prevention

| Item | Status | Implementation |
|---|---|---|
| Global rate limiting | ✅ Done | `express-rate-limit`: 30 req/15min per IP on all `/api/` routes |
| Per-form rate limiting | ✅ Done | 5 submissions/hour per IP on `/api/contact` and `/api/booking` |
| Input validation | ✅ Done | Zod validates type, length, format on every backend field |
| Bot protection (honeypot) | ✅ Done | Hidden `website` field in both contact and booking forms — backend silently accepts and discards bot submissions |
| Body size limit | ✅ Done | Express body parser capped at 50KB (was 1MB) |
| Spend alert reminder | ⚠️ Manual | Set billing alerts on OpenAI/Anthropic dashboard before launch |

### Remaining Manual Steps

These require action outside the codebase:

- [ ] Add SMTP credentials to `backend/.env` (Gmail App Password or SendGrid API key)
- [ ] Set billing alerts on any paid AI API (OpenAI, Anthropic) dashboard
- [ ] Point `FRONTEND_URL` in `backend/.env` to your production domain before deploying
- [ ] Update CSP `connect-src` in `next.config.ts` with your production API URL
- [ ] Consider adding reCAPTCHA v3 if spam becomes a problem post-launch

