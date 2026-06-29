# RudraAI Backend API

Express.js + TypeScript backend for the RudraAI automation agency platform.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/contact` | Contact form submission |
| `POST` | `/api/booking` | Booking form (Cal.com + Zoom + Notion) |
| `GET`  | `/api/cal/slots` | Live Cal.com availability |
| `POST` | `/api/chat` | AI chat (OpenRouter primary, Ollama fallback) |
| `GET`  | `/health` | Health check |

## Local Development

```bash
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev            # runs on http://localhost:4000
```

## Connecting Frontend to Backend

The Next.js frontend proxies all `/api/*` calls to this backend via `next.config.ts` rewrites — no CORS issues, no secrets in client JS.

**Local dev:** `frontend/.env.local` → `BACKEND_URL=http://localhost:4000`

**Production (Vercel):** In Vercel dashboard → Settings → Environment Variables, set:
```
BACKEND_URL=https://<your-render-or-railway-url>
```
Your backend URL is available in the Render/Railway dashboard after deploying.

## Environment Variables

Set these in your deployment platform (Render → Environment, Railway → Variables):

### Required

| Variable | Description |
|---|---|
| `FRONTEND_URL` | Vercel frontend URL for CORS (e.g. `https://rudraai.vercel.app`) |
| `OPENROUTER_API_KEY` | OpenRouter API key — powers the chat widget |

### Email (SMTP)

| Variable | Description |
|---|---|
| `CONSULTANT_NAME` | Your display name in emails |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Gmail address |
| `SMTP_PASS` | Gmail app password (not your real password) |
| `SMTP_FROM` | `"RudraAI <noreply@rudraai.io>"` |
| `CONTACT_TO` | Where contact/booking notifications are sent |

### Cal.com

| Variable | Description |
|---|---|
| `CALCOM_API_KEY` | Cal.com API key (backend-only, never in frontend) |
| `CALCOM_EVENT_SLUG` | Event type slug e.g. `15min` |

### Optional integrations

| Variable | Description |
|---|---|
| `ZOOM_ACCOUNT_ID` | Zoom Server-to-Server OAuth account ID |
| `ZOOM_CLIENT_ID` | Zoom Client ID |
| `ZOOM_CLIENT_SECRET` | Zoom Client Secret |
| `NOTION_TOKEN` | Notion integration token |
| `NOTION_DATABASE_ID` | Notion booking database ID |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google Sheets service account email |
| `GOOGLE_PRIVATE_KEY` | Google Sheets private key |
| `GOOGLE_SHEETS_ID` | Google Sheets spreadsheet ID |
| `OLLAMA_BASE_URL` | Ollama URL if running locally e.g. `http://localhost:11434` |
| `OLLAMA_MODEL` | Ollama model name e.g. `llama3.2:3b` |
| `N8N_WEBHOOK_CHAT` | n8n webhook URL for logging chat messages |
| `N8N_WEBHOOK_CONTACT` | n8n webhook URL for contact form |
| `N8N_WEBHOOK_BOOKING` | n8n webhook URL for bookings |

## Chat AI — How it works

`/api/chat` tries providers in order:

1. **OpenRouter** (primary) — model: `meta-llama/llama-3.1-8b-instruct:free`, 20s timeout — requires `OPENROUTER_API_KEY`
2. **Ollama** (optional local fallback) — 8s timeout — requires `OLLAMA_BASE_URL` + model pulled locally

If both fail, returns a friendly offline message directing users to email.
