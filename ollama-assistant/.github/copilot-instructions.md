# GitHub Copilot Instructions for Ollama AI Assistant

## Project Overview
This is a full-stack AI assistant application built with TypeScript, React, and Node.js. The application is deployed on Vercel and uses Ollama for local AI model inference.

## Tech Stack
- **Frontend**: React with TypeScript, Vite
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Package Manager**: pnpm (NOT npm)
- **Deployment**: Vercel
- **AI Runtime**: Ollama (local LLM inference)

## Project Structure
```
ollama-ai-assistant/
├── client/          # React frontend application
├── server/          # Node.js backend API
├── drizzle/         # Database schema and migrations
├── shared/          # Shared utilities and types
└── .webdev/         # Web development tools and configurations
```

## Development Workflow

### Installation
```bash
pnpm install
```

### Building
```bash
pnpm build
```

### Development Server
```bash
pnpm dev
```

## Vercel Deployment Configuration

### Build Settings (vercel.json)
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`
- **Framework**: None (custom configuration)
- **Runtime**: Node.js 20.x for API functions

### Routing Rules
- API routes (`/api/*`) are served as serverless functions
- All other routes are rewritten to `/index.html` for SPA support
- Security headers are configured for all routes

### Important Notes
1. **Always use pnpm** - This project uses pnpm, not npm. Using npm will cause dependency issues.
2. **Environment Variables** - Ensure all required environment variables are configured in Vercel:
   - Database connection strings
   - API keys
   - Ollama configuration
3. **API Functions** - Server-side code in `server/` directory is deployed as Vercel serverless functions
4. **Static Assets** - Frontend builds to `dist/` directory and is served as static content

## Code Style Guidelines
- Use TypeScript for type safety
- Follow the existing code structure and patterns
- Maintain consistency with existing components and utilities
- Use Drizzle ORM for database operations
- Keep API routes in the `server/` directory

## Common Issues & Solutions

### Build Failures
- Ensure you're using `pnpm` and not `npm`
- Check that all dependencies are properly installed
- Verify TypeScript compilation passes before building

### Deployment Issues
- Verify `vercel.json` is valid JSON
- Check that environment variables are set in Vercel dashboard
- Ensure build command produces output in `dist/` directory

### API Routes
- API functions must be in `server/` directory
- Use Node.js 20.x runtime compatibility
- Handle errors gracefully with proper HTTP status codes

## Testing
- Run tests with: `pnpm test`
- Ensure all tests pass before committing
- Test API endpoints locally before deploying

## Git Workflow
- Create feature branches from `main`
- Write descriptive commit messages
- Ensure all tests pass before pushing
- Use pull requests for code review

## Additional Resources
- See `PROJECT_SUMMARY.md` for detailed project information
- See `USER_GUIDE.md` for usage instructions
- Check `todo.md` for ongoing tasks and improvements