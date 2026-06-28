# Claude.md

## RudraAI — AI Automation Agency Website

RudraAI is an **AI automation agency** that builds n8n workflows, AI agents, and automation systems for businesses.

### Tech Stack

- **Frontend**: Next.js 15 (App Router), TailwindCSS, Framer Motion, Radix UI, TypeScript
- **Backend**: Express.js + TypeScript (Node.js 20)
- **Database**: Supabase (PostgreSQL)
- **Vector DB**: Qdrant (for AI chat RAG)
- **AI Chat**: Ollama (primary) → OpenRouter (fallback)
- **Email**: Resend
- **Booking**: Cal.com integration + custom weekend-only scheduler
- **Video calls**: Zoom (Server-to-Server OAuth)
- **Live chat**: Chatwoot widget + HMAC-secured webhook
- **Hosting**: Frontend → Vercel, Backend → Render/Railway

---

## Project Structure

```
frontend/   Next.js marketing site
backend/    Express.js API server
```

---

## Key Pages

- `/` — Home (hero, services, features, how it works, testimonials, founder, FAQ, CTA)
- `/services` — Service offerings with process roadmap
- `/pricing` — 4 pricing tiers
- `/about` — Founder story
- `/blog` + `/blog/[slug]` — 6 static blog posts
- `/booking` — Free consultation booking (Sat/Sun only, 15 min slots)
- `/contact` — Contact form
- `/industries` — Industry solutions
- `/automation-guide` — Educational guide
- `/case-studies` — Portfolio
- `/privacy`, `/terms` — Legal

---

## Backend API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/contact` | Contact form |
| POST | `/api/booking` | Book a 15-min consultation |
| GET | `/api/cal/slots` | Cal.com slot availability |
| POST | `/api/chat` | AI chat (Ollama → OpenRouter) |
| POST | `/api/rag/search` | Vector search (X-API-Key protected) |
| POST | `/api/newsletter` | Email signup |
| POST | `/api/chatwoot/webhook` | Chatwoot live chat webhook |
| GET | `/health` | Health check |

---

## Important Rules

- Booking is **Saturday and Sunday only**, **15 minute slots**
- No personal names hardcoded — use `NEXT_PUBLIC_CONSULTANT_NAME` env var or "Automation Consultant"
- OpenRouter API key must stay in backend only — never expose to frontend
- Use environment variables for all secrets
- Keep Express backend and Next.js frontend decoupled via API proxy in `next.config.ts`
