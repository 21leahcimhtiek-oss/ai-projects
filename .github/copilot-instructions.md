# 🤖 Copilot Instructions — AI Projects (concise, high-signal summary)

## Project Overview
Monorepo of AI-focused apps and utilities:
- **storyforge-kids**: AI-generated children’s books with illustrations and payments.
- **ai-assistant-pro**: React Native (Expo) Android assistant with OpenRouter, Tor, scraping, and permissions control.
- **mindspace**: Mental health app (design/docs only).
- **ollama-assistant**: Local Ollama + MCP-based assistant.
- **tools**: Android debloat helper (Tkinter) and Python utilities.
- **resources/docs**: Reference guides, media assets, and general notes.

## Tech Stack
- TypeScript/React 19, Tailwind CSS, Vite-style app structure (StoryForge docs).
- Express 4 + tRPC 11 + Drizzle ORM + MySQL/TiDB; Stripe + S3 (StoryForge docs).
- React Native (Expo), TypeScript, AsyncStorage, OpenRouter API, Tor proxy (AI Assistant Pro).
- Node.js/Ollama + MCP tooling (Ollama Assistant docs).
- Python 3 ecosystem (see `requirements.txt` for the web stack; includes Tkinter-based GUI tools).

## Project Structure (key paths)
```
ai-projects/
├── storyforge-kids/
│   ├── src/ (App.tsx, storage.ts, config/README.md)
│   ├── payments/ (stripe-products.ts, stripe-webhook.ts)
│   ├── marketing/
│   └── docs/
├── ai-assistant-pro/
│   ├── src/
│   │   ├── services/ (tor-service.ts, web-scraper.ts, openrouter.ts, chat-storage.ts, permissions.ts)
│   │   ├── screens/ (_layout.tsx, index.tsx, settings.tsx, permissions.tsx, web-tools.tsx, icon-symbol.tsx)
│   │   └── config/ (app.config.ts, theme.config.js)
│   └── docs/ (design.md, PROJECT_SUMMARY.md, QUICK_START.md)
├── mindspace/ (docs/)
├── ollama-assistant/ (docs/QUICK_START.md, README.md)
├── tools/
│   ├── android/android-debloat-helper.py
│   └── python/{client.py, server.py, obfuscated.py, original.py}
├── resources/ (ai-models/, audio/, images/)
├── docs/ (general notes)
├── requirements.txt
└── .github/ (workflows/, copilot-instructions.md)
```

## Commands (from project docs)
- **StoryForge Kids** (`storyforge-kids/`):
  - Install: `pnpm install`
  - Dev: `pnpm dev`
  - Build/serve: `pnpm build` / `pnpm start`
  - DB: `pnpm db:push`
  - Quality: `pnpm test` (Vitest), `pnpm check`, `pnpm format`
- **AI Assistant Pro** (`ai-assistant-pro/`):
  - Install: `npm install`
  - Dev: `npx expo start` (OpenRouter key set via Settings screen)
- **Ollama Assistant** (`ollama-assistant/`):
  - Install & run: `npm install && npm start` (requires `ollama pull <model>`)
- **Python tools** (`tools/android`, `tools/python`):
  - GUI debloat helper: `python tools/android/android-debloat-helper.py`
  - Utilities: `python tools/python/client.py`, `python tools/python/server.py`

## Dependencies (high-level)
- StoryForge: React 19, Tailwind CSS 4, Express 4, tRPC 11, Drizzle ORM, MySQL/TiDB, Stripe SDK, S3 client, Manus OAuth (per README).
- AI Assistant Pro: React Native (Expo), TypeScript, AsyncStorage, OpenRouter API, Tor/proxy libraries.
- Ollama Assistant: Node.js with Ollama runtime + MCP toolchain (models pulled via `ollama`).
- Python: Flask, Gunicorn (see root `requirements.txt`); Tkinter for GUI tools.

## Development Guidelines
- Keep env secrets out of the repo; use `.env` (OpenRouter keys, Manus/Stripe, DB URLs, S3 keys).
- Follow service-first design in `ai-assistant-pro/src/services` and functional screens in `src/screens`.
- For StoryForge, align with tRPC + Drizzle patterns described in its README (schemas in `drizzle/schema.ts` per docs) and run `pnpm db:push` after schema edits.
- Prefer type safety (TypeScript) and reusable UI components; keep stateful logic in hooks or services.
- For Python scripts, keep CLI/GUI entrypoints thin and isolate logic into functions; avoid blocking I/O in GUIs.

## Code Style
- TypeScript/React & React Native: functional components, camelCase for variables/functions, PascalCase for components; run `pnpm format` / Prettier; `pnpm check` for types.
- Testing (where available): Vitest (`*.test.ts`/`*.test.tsx`).
- Python: PEP 8, docstrings for public functions, avoid global state; lint manually if adding logic.

## Notes for Copilot
- Pick the correct project scope before suggesting changes; many files at repo root are exports/previews of app code—edit inside project folders when possible.
- Do not surface or reuse any API keys found in docs; treat them as placeholders and keep them out of commits.
- When adding features, mirror existing patterns: service classes in `ai-assistant-pro`, config-driven setup in StoryForge, and documented flows in each project README.
- Reference project-specific docs (`storyforge-kids/README.md`, `ai-assistant-pro/docs/*`, `mindspace/docs/*`, `ollama-assistant/docs/QUICK_START.md`) for behavior and commands.
- Favor small, isolated changes and keep documentation updates concise and action-oriented.
