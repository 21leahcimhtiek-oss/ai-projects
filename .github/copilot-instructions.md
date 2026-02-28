# 🤖 Copilot Instructions for AI Projects Repository

This document provides context and guidelines for AI assistants (GitHub Copilot, SuperNinja, etc.) working with this repository.

---

## 📚 Repository Overview

This is a **monorepo** containing multiple AI-powered projects organized by domain:

| Project | Purpose | Tech Stack |
|---------|---------|------------|
| `storyforge-kids/` | AI-powered children's book creation platform | React 19, Tailwind CSS 4, Express, tRPC, MySQL, Stripe |
| `ai-assistant-pro/` | Android AI assistant with privacy tools | React Native (Expo), TypeScript, OpenRouter API |
| `mindspace/` | AI mental health & wellness app | React Native, AI/LLM integration |
| `ollama-assistant/` | Local Ollama AI assistant | Ollama, Node.js |
| `tools/` | Utility scripts & tools | Python, Tkinter |
| `resources/` | Shared resources (AI models, audio, images) | Various |

---

## 🏗️ Project Structure

```
ai-projects/
├── storyforge-kids/          # Children's book platform
│   ├── src/                  # Source code
│   │   ├── App.tsx           # Main app component
│   │   ├── storage.ts        # Data persistence
│   │   ├── components/       # Reusable components
│   │   ├── screens/          # Page components
│   │   └── config/           # Configuration files
│   ├── payments/             # Stripe integration
│   │   ├── stripe-products.ts
│   │   └── stripe-webhook.ts
│   ├── marketing/            # Marketing materials
│   │   └── tiktok-ads/       # TikTok ad campaigns
│   └── docs/                 # Documentation
│       ├── BUILD_INSTRUCTIONS.md
│       ├── roadmap.pdf
│       └── todo.md
│
├── ai-assistant-pro/         # Android AI assistant
│   ├── src/
│   │   ├── services/         # Core service classes
│   │   │   ├── tor-service.ts        # Tor network management
│   │   │   ├── web-scraper.ts        # HTTP/proxy scraping
│   │   │   ├── openrouter.ts         # OpenRouter API client
│   │   │   ├── chat-storage.ts       # Chat persistence
│   │   │   └── permissions.ts        # Permission management
│   │   ├── screens/          # UI screens
│   │   │   ├── index.tsx             # Main chat screen
│   │   │   ├── settings.tsx          # Settings screen
│   │   │   ├── permissions.tsx       # Permissions screen
│   │   │   ├── web-tools.tsx         # Web tools screen
│   │   │   ├── _layout.tsx           # Tab layout
│   │   │   └── icon-symbol.tsx       # Icon component
│   │   └── config/           # App configuration
│   │       ├── app.config.ts         # Expo config
│   │       └── theme.config.js       # Theme colors
│   └── docs/                 # Documentation
│       ├── design.md
│       ├── PROJECT_SUMMARY.md
│       └── QUICK_START.md
│
├── mindspace/                # Mental health app
│   └── docs/
│       ├── mindspace-design.md
│       └── MindSpace_-_TODO.md
│
├── ollama-assistant/         # Local Ollama assistant
│   └── docs/
│       └── QUICK_START.md
│
├── tools/                    # Utility tools
│   ├── android/
│   │   ├── android-debloat-helper.py
│   │   └── README.md
│   └── python/
│       ├── client.py
│       ├── server.py
│       ├── obfuscated.py
│       ├── original.py
│       └── python-obfuscation-guide.pdf
│
├── resources/                # Shared resources
│   ├── ai-models/            # AI model guides
│   ├── audio/                # Generated audio
│   └── images/               # Generated images
│
├── assets/                   # Shared UI assets
│   └── icons/                # SVG icons
│
└── docs/                     # General documentation
    ├── a1-revolution-todo.md
    ├── app-structure-notes.md
    ├── automated-book-creation-notes.md
    └── ... (various project notes)
```

---

## 💻 Coding Standards

### TypeScript/React Native (ai-assistant-pro)

```typescript
// Service classes should be organized with clear method separation
class ExampleService {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  // Public methods for external use
  public async fetchData(): Promise<Data> {
    // Implementation
  }
  
  // Private helper methods
  private async makeRequest(url: string): Promise<Response> {
    // Implementation
  }
}
```

### React Components

```tsx
// Use functional components with hooks
import React, { useState, useEffect } from 'react';

export const ExampleScreen: React.FC = () => {
  const [data, setData] = useState<string>('');
  
  useEffect(() => {
    // Effect logic
  }, []);
  
  return (
    <View>
      <Text>{data}</Text>
    </View>
  );
};
```

### Python Tools

```python
# Use clear function names and docstrings
def process_data(input_data: dict) -> dict:
    """
    Process input data and return formatted output.
    
    Args:
        input_data: Dictionary containing raw data
        
    Returns:
        Dictionary containing processed data
    """
    # Implementation
    pass
```

---

## 🔑 Key Patterns & Conventions

### 1. Service Layer Pattern (ai-assistant-pro)

All business logic is encapsulated in service classes:
- `TorService` - Manages Tor network connections
- `WebScraperService` - Handles HTTP requests with proxy support
- `OpenRouterService` - OpenRouter API integration
- `ChatStorageService` - AsyncStorage wrapper for chat persistence
- `PermissionService` - Device permission management

### 2. Screen Organization (ai-assistant-pro)

Each screen is a separate file in `src/screens/`:
- Exported as named components
- Use React Native components
- Include haptic feedback for interactions
- Follow consistent styling patterns

### 3. Configuration Management

- `app.config.ts` - Expo app configuration
- `theme.config.js` - Theme color definitions (light/dark modes)
- Environment variables should be stored in `.env` files (not committed)

### 4. Documentation Standards

- Each project has its own `README.md`
- Technical docs go in `docs/` subdirectories
- Use Markdown for documentation
- Include code examples where helpful

---

## 🚀 Common Tasks

### Adding a New Service (ai-assistant-pro)

1. Create service file in `src/services/`
2. Export a class with clear method names
3. Use TypeScript interfaces for type safety
4. Include error handling
5. Update relevant screens to use the service

### Adding a New Screen (ai-assistant-pro)

1. Create screen file in `src/screens/`
2. Export as named component
3. Use React Native components
4. Add to tab layout in `_layout.tsx`
5. Include icon in `icon-symbol.tsx` mapping

### Adding Documentation

1. Place docs in appropriate `docs/` folder
2. Use clear, descriptive filenames
3. Include table of contents for longer docs
4. Update project README if needed

---

## 📦 Dependencies

### storyforge-kids
- React 19
- Tailwind CSS 4
- Express 4
- tRPC 11
- Drizzle ORM
- Stripe SDK

### ai-assistant-pro
- React Native (Expo)
- TypeScript
- AsyncStorage
- OpenRouter API

### tools/python
- Python 3.x
- Tkinter (for GUI tools)
- requests (for HTTP)

---

## 🔐 Security Notes

- **Never commit** API keys, tokens, or sensitive credentials
- Use `.env` files for environment variables
- `.gitignore` is configured to exclude sensitive files
- Stripe backup codes should never be committed
- Chrome cookie files should never be committed

---

## 🎯 When Working on This Repository

1. **Identify the project** you're working with (storyforge-kids, ai-assistant-pro, etc.)
2. **Read the project README** for context
3. **Follow existing patterns** in that project
4. **Check related documentation** in the `docs/` folder
5. **Maintain consistency** with existing code style
6. **Update documentation** if you make significant changes

---

## 📝 Example Prompts

### For Code Generation
> "Create a new service class for managing user authentication in ai-assistant-pro/src/services/. Use AsyncStorage for persistence and include methods for login, logout, and checking auth status."

### For Bug Fixes
> "Review the tor-service.ts file and identify potential issues with the Tor connection management. Suggest fixes for connection stability."

### For Documentation
> "Create a README.md for the tools/python directory explaining each script and how to use them."

### For Feature Addition
> "Add a new screen to ai-assistant-pro/src/screens/ for managing API keys. Include input fields, save functionality using AsyncStorage, and validation."

---

## 🔄 Git Workflow

1. Create a new branch for changes: `git checkout -b feature/your-feature-name`
2. Make changes following the coding standards
3. Commit with descriptive messages
4. Push to remote: `git push https://x-access-token:$GITHUB_TOKEN@github.com/21leahcimhtiek-oss/ai-projects.git your-branch-name`
5. Create a pull request if needed

---

## 📞 Getting Help

- Check project-specific README files
- Review documentation in `docs/` folders
- Examine existing similar code for patterns
- Refer to tech stack documentation

---

*Last updated: 2025-02-28*