# StoryForge Kids 📖✨

AI-powered personalized storybooks for children. Built with Expo/React Native + Express/tRPC + SQLite/PostgreSQL + Stripe.

## Stack

| Layer | Tech |
|-------|------|
| Web Frontend | React + Vite + TailwindCSS |
| Mobile | Expo / React Native (iOS + Android) |
| API | Express + tRPC |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | Session-based (HTTP-only cookies) |
| Payments | Stripe Subscriptions |
| AI | Google Gemini 1.5 Flash |
| Deployment | Vercel (web) + EAS (mobile) |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env

# 3. Start dev server (web + API)
npm run dev

# 4. Start mobile (Expo)
npm run android   # Android
npm run ios       # iOS
```

## Environment Variables

See `.env.example` for all required variables.

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite path or PostgreSQL URL |
| `SESSION_SECRET` | Random 32+ char string |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `GEMINI_API_KEY` | Google Gemini API key |

## Deployment

### Web (Vercel)
```bash
# Set GitHub secrets:
# VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
git push origin main  # Auto-deploys via GitHub Actions
```

### Mobile (EAS)
```bash
# Set GitHub secret: EXPO_TOKEN
eas build --platform android --profile production
eas build --platform ios --profile production
```

## Project Structure

```
storyforge-kids/
├── src/
│   ├── server/          # Express + tRPC backend
│   │   ├── routers/     # tRPC routers (auth, books, subscription)
│   │   ├── middleware/  # Context, security
│   │   ├── database/    # SQLite connection + schema
│   │   ├── lib/         # Auth helpers, AI, tRPC init
│   │   └── api/         # Stripe webhooks
│   ├── pages/           # React web pages
│   ├── components/      # Shared UI components
│   ├── providers/       # React context providers
│   └── lib/             # tRPC client
├── app/                 # Expo Router (mobile)
│   └── tabs/            # Tab screens
├── .github/workflows/   # CI/CD pipelines
├── vercel.json          # Vercel deployment config
└── eas.json             # EAS build config
```

## GitHub Secrets Required

| Secret | Where to get it |
|--------|----------------|
| `VERCEL_TOKEN` | vercel.com → Account Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel dashboard → Settings |
| `VERCEL_PROJECT_ID` | Vercel project → Settings |
| `EXPO_TOKEN` | expo.dev → Account → Access Tokens |