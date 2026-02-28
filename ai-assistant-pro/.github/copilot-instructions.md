# GitHub Copilot Instructions for AI Assistant Pro

## Project Overview
AI Assistant Pro is an Android mobile AI assistant built with React Native (Expo) featuring multi-model AI chat, web scraping, proxy rotation, and Tor network integration for privacy-focused browsing.

## Tech Stack
- **Frontend**: React Native (Expo)
- **Language**: TypeScript
- **AI Integration**: OpenRouter API (multi-model LLM support)
- **Storage**: AsyncStorage for chat history
- **Network**: Tor proxy integration, HTTP web scraping
- **UI**: React Native components with theme support

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

## Development Workflow

### Installation
```bash
npm install
```

### Development Server
```bash
npx expo start
```

### Building
```bash
npx expo build:android
```

## Key Features & Implementation

### Multi-Model AI Chat
- Uses OpenRouter API for LLM integration
- Supports multiple AI models through OpenRouter
- Chat history persistence via AsyncStorage
- Real-time streaming responses

### Tor Network Integration
- Anonymous browsing via Tor proxy
- Tor service management in `tor-service.ts`
- Enable/disable Tor in Web Tools screen
- Privacy-focused web scraping

### Web Scraping & Proxy Rotation
- HTTP request tools with proxy support
- Configurable proxy rotation
- Web scraping functionality in `web-scraper.ts`
- Support for custom proxy servers

### Permission Management
- Granular control over device permissions
- Android runtime permissions handling
- Permission request UI in `permissions.tsx`
- Permission state management

### Theme Support
- Light and dark mode
- Theme configuration in `theme.config.js`
- Persistent theme preferences
- System theme detection

## Configuration

### Required Environment Variables
- **OpenRouter API Key** - Required for AI chat functionality
  - Set in the Settings screen
  - Get from https://openrouter.ai/

### Optional Configuration
- **Tor Proxy** - Enable in Web Tools screen
- **Proxy Rotation** - Configure in Web Tools screen
- Custom proxy servers can be added

## Code Style Guidelines
- Use TypeScript for type safety
- Follow React Native best practices
- Use functional components with hooks
- Maintain consistent naming conventions
- Keep services modular and reusable

## Common Issues & Solutions

### OpenRouter API Issues
- Verify API key is valid
- Check API rate limits
- Ensure network connectivity
- Review OpenRouter dashboard for errors

### Tor Connection Issues
- Tor service may take time to start
- Check Tor service status in Web Tools
- Verify Tor proxy configuration
- Some networks may block Tor

### AsyncStorage Issues
- AsyncStorage has storage limits
- Implement proper error handling
- Consider data cleanup for old chats
- Test on actual devices (not just simulator)

### Permission Issues
- Android requires runtime permissions
- Handle permission denials gracefully
- Provide clear explanations for permission requests
- Test on various Android versions

## Testing
- Test on physical Android devices
- Test with different OpenRouter models
- Verify Tor connectivity
- Test permission flows
- Test theme switching
- Verify chat history persistence

## Deployment
- Use Expo EAS Build for production
- Configure app signing
- Set up proper API keys in production
- Test on multiple Android devices
- Follow Google Play Store guidelines

## Additional Resources
- See `docs/PROJECT_SUMMARY.md` for detailed project information
- See `docs/QUICK_START.md` for quick start guide
- See `docs/design.md` for design specifications
- Check `todo.md` for ongoing tasks and improvements

## Important Notes
- This is a mobile-first application
- Privacy and security are key features
- Tor integration requires careful testing
- OpenRouter API has rate limits
- AsyncStorage is not encrypted - consider encryption for sensitive data