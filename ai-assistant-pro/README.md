# 🤖 AI Assistant Pro

An Android mobile AI assistant built with React Native (Expo) featuring multi-model AI chat, web scraping, proxy rotation, and Tor network integration for privacy-focused browsing.

## Features

- **Multi-Model AI Chat** – Supports multiple LLMs via OpenRouter API
- **Permission Management** – Granular control over device permissions
- **Web Scraping** – Built-in HTTP request tools with proxy support
- **Tor Integration** – Anonymous browsing via Tor network
- **Chat History** – Persistent conversation storage via AsyncStorage
- **Theme Support** – Light and dark mode

## Tech Stack

- React Native (Expo)
- TypeScript
- OpenRouter API
- AsyncStorage
- Tor Proxy

## Project Structure

```
ai-assistant-pro/
├── src/
│   ├── services/         # Core service classes
│   │   ├── tor-service.ts        # Tor network management
│   │   ├── web-scraper.ts        # HTTP/proxy scraping
│   │   ├── openrouter.ts         # OpenRouter API client
│   │   ├── chat-storage.ts       # Chat persistence
│   │   └── permissions.ts        # Permission management
│   ├── screens/          # UI screens
│   │   ├── index.tsx             # Main chat screen
│   │   ├── settings.tsx          # Settings screen
│   │   ├── permissions.tsx       # Permissions screen
│   │   ├── web-tools.tsx         # Web tools screen
│   │   ├── _layout.tsx           # Tab layout
│   │   └── icon-symbol.tsx       # Icon component
│   └── config/           # App configuration
│       ├── app.config.ts         # Expo config
│       └── theme.config.js       # Theme colors
└── docs/                 # Documentation
    ├── design.md                 # App design spec
    ├── design.pdf                # Design PDF
    ├── PROJECT_SUMMARY.md        # Project summary
    └── QUICK_START.md            # Quick start guide
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set your OpenRouter API key in the Settings screen

3. Start the development server:
   ```bash
   npx expo start
   ```

## Configuration

- **OpenRouter API Key** – Required for AI chat functionality
- **Tor Proxy** – Optional, enable in Web Tools screen
- **Proxy Rotation** – Optional, configure in Web Tools screen