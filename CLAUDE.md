# Claude.md

## RudraAI — AI Services Studio Website

RudraAI is an **AI services studio** (Hyderabad) offering three services: **websites** (Next.js), **AI agents**, and **n8n automations**. Service facts (names, deliverables, timelines, call length) live in `frontend/src/lib/site.ts` — reuse them instead of retyping copy.

### Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TailwindCSS 3, Framer Motion, Lenis (smooth scroll), Three.js (hero tornado), Radix UI, TypeScript
- **Backend**: Express.js + TypeScript (Node.js 20)
- **Database / Auth**: Supabase (PostgreSQL + Auth for portal/admin)
- **Vector DB**: Qdrant (for AI chat RAG)
- **AI Chat**: Next route → OpenRouter (multi-model fallback); Express route → Ollama → OpenRouter
- **Email**: Resend
- **Booking**: Cal.com live slots + Google Sheets ledger, weekend-only scheduler
- **Video calls**: Zoom (Server-to-Server OAuth)
- **Automations**: n8n webhooks (`N8N_WEBHOOK_CHAT/CONTACT/NEWSLETTER`), Notion, Slack
- **Live chat**: Chatwoot widget + HMAC-secured webhook
- **Rate limiting**: Redis sliding-window limiter (backend)
- **Monitoring**: Sentry
- **Hosting**: Frontend → Vercel project `rudraai`, Backend → Vercel project `backend` (both auto-deploy from `main`); Docker images via `docker-compose.yml` + GitHub Actions

---

## Project Structure

```
package.json          `npm run dev` runs backend + frontend together; `npm run install:all`
docker-compose.yml    redis + backend (:4000) + frontend (:3000)

frontend/src/
  app/                pages + Next route handlers (app/api/*)
  components/         home-page sections, navbar, footer, chat/chatwoot widgets
    site/             motion primitives (reveal, magnetic, marquee, scramble-text…)
    ui/               shadcn/Radix primitives
    originkit/ui/     Originkit components (tornado — has local patches)
    admin/, portal/   UI for those areas
  lib/
    booking/          weekend slot logic, Cal.com client, Sheets ledger
    supabase/         browser + server clients
    posts.ts, showcase.ts, site.ts, service-pages.ts   static content + site config
  middleware.ts       Supabase session; guards /portal (login) and /admin (role=admin)

backend/src/
  index.ts            Express app, middleware + route mounting
  routes/             booking, cal, chat, chatwoot, contact, metrics, newsletter, rag
  lib/                service clients: calcom, email, qdrant, redis, sheets, slack, supabase, logger, metrics
  middleware/         apiKey.ts, rateLimit/ (Redis sliding window, abuse guard)
backend/knowledge/    markdown RAG source docs
backend/scripts/ingest-knowledge.ts   embeds knowledge/ into Qdrant
backend/supabase/schema.sql
```

---

## Key Pages

- `/` — Home (hero, scroll statement, problem, services, velocity marquee, features, how it works, FAQ, CTA)
- `/services` — Service offerings with process roadmap + contact form
- `/services/[slug]` — Per-service pages (`websites`, `ai-agents`, `automations`), statically generated from `lib/service-pages.ts` + `SERVICES` in `lib/site.ts`
- `/showcase` — Gallery of built n8n workflows / AI agents (`/pricing` and `/case-studies/*` 308-redirect here)
- `/about` — Founder story
- `/blog` + `/blog/[slug]` — static posts from `lib/posts.ts`
- `/booking` — Free consultation booking (Sat/Sun only, 15 min slots)
- `/industries` — Industry solutions
- `/automation-guide` — Educational guide
- `/feedback` — Client feedback
- `/privacy`, `/terms` — Legal
- `/login`, `/auth/callback` — Supabase auth
- `/portal/*` — Client portal (dashboard, deliverables, profile, project/[id])
- `/admin/*` — Admin (dashboard, bookings, clients/[id])

---

## API Routes

`next.config.ts` rewrites `/api/*` to the Express backend, but Next.js route handlers in `frontend/src/app/api/` take precedence. **A path that exists in the frontend never reaches Express through the site.**

### Handled by Next.js (`frontend/src/app/api/`)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/contact` | Contact form (Supabase, Resend, n8n) |
| POST | `/api/booking` | Book a 15-min consultation (Zoom, Sheets, Notion, Resend) |
| GET | `/api/cal/slots` | Live Cal.com weekend slots |
| POST | `/api/cal/webhook` | Cal.com booking webhook → Sheets/Supabase |
| POST | `/api/chat` | AI chat via OpenRouter |
| POST | `/api/newsletter` | Email signup |
| * | `/api/admin/*` | deliverables, invite, metrics, projects |
| * | `/api/portal/*` | projects, updates |

### Reached on Express (`backend/src/routes/`)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/rag/search` | Vector search (X-API-Key protected) |
| POST | `/api/chatwoot/webhook` | Chatwoot live chat webhook |
| GET | `/metrics` | Metrics (X-API-Key protected) |
| GET | `/health` | Health check |

Express also has `contact`, `booking`, `cal`, `chat`, `newsletter` routes. They are shadowed for site traffic but kept for direct callers — don't delete them without confirming.

---

## Important Rules

- Booking is **Saturday and Sunday only**, **15 minute slots**
- No personal names hardcoded — use `NEXT_PUBLIC_CONSULTANT_NAME` env var or "Automation Consultant"
- OpenRouter and other API keys stay server-side (route handlers / backend) — never in client code or `NEXT_PUBLIC_*`
- Use environment variables for all secrets
- Keep Express backend and Next.js frontend decoupled via API proxy in `next.config.ts`
