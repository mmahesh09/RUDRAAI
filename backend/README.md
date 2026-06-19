---
title: RudraAI Backend
emoji: ⚡
colorFrom: orange
colorTo: red
sdk: docker
pinned: false
app_port: 7860
---

# RudraAI Backend API

Express.js + TypeScript backend for the RudraAI automation agency platform.

## Endpoints

- `POST /api/contact` — Contact form
- `POST /api/booking` — Booking form (Cal.com + Zoom + Notion)
- `GET /api/cal/slots` — Live Cal.com availability
- `GET /health` — Health check

## Environment Variables

Set these in the Hugging Face Space **Settings → Variables and secrets**:

| Variable | Description |
|---|---|
| `CONSULTANT_NAME` | Your display name |
| `FRONTEND_URL` | Your Vercel frontend URL |
| `SMTP_HOST` | Gmail SMTP host |
| `SMTP_PORT` | 587 |
| `SMTP_USER` | Gmail address |
| `SMTP_PASS` | Gmail app password |
| `SMTP_FROM` | From address |
| `CONTACT_TO` | Where to receive emails |
| `CALCOM_API_KEY` | Cal.com API key |
| `CALCOM_EVENT_SLUG` | Cal.com event slug (e.g. 15min) |
| `ZOOM_ACCOUNT_ID` | Zoom Server-to-Server OAuth |
| `ZOOM_CLIENT_ID` | Zoom Client ID |
| `ZOOM_CLIENT_SECRET` | Zoom Client Secret |
| `NOTION_TOKEN` | Notion integration token |
| `NOTION_DATABASE_ID` | Notion booking database ID |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google Sheets service account |
| `GOOGLE_PRIVATE_KEY` | Google Sheets private key |
| `GOOGLE_SHEETS_ID` | Google Sheets spreadsheet ID |
