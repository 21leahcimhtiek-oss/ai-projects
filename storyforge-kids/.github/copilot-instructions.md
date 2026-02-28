# GitHub Copilot Instructions for Story Forge Kids

## Project Overview
Story Forge Kids is an AI-powered children's book creation platform with automated story generation, illustration, and monetization capabilities. The platform generates complete 12-page stories from simple text prompts with real AI image generation and PDF export.

## Tech Stack
- **Frontend**: React 19, Tailwind CSS 4, shadcn/ui
- **Backend**: Express 4, tRPC 11
- **Database**: MySQL/TiDB with Drizzle ORM
- **Authentication**: Manus OAuth
- **AI/ML**: Built-in LLM, Image Generation, Text-to-Speech APIs
- **Payments**: Stripe
- **Storage**: S3 (for images, PDFs, audio files)
- **Testing**: Vitest
- **Package Manager**: pnpm (NOT npm)

## Project Structure
```
story-forge-kids/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Feature pages
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities (trpc client, etc)
│   │   ├── App.tsx           # Routes and layout
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Global styles
│   └── public/               # Static assets
├── server/                    # Express backend
│   ├── routers.ts            # tRPC procedures
│   ├── db.ts                 # Database queries
│   ├── auth.logout.test.ts   # Example test
│   └── _core/                # Framework internals
├── drizzle/                   # Database schema and migrations
│   └── schema.ts             # Table definitions
├── storage/                   # S3 helpers
├── shared/                    # Shared types and constants
├── package.json
├── tsconfig.json
├── vite.config.ts
├── drizzle.config.ts
└── todo.md                    # Project tracking
```

## Development Workflow

### Installation
```bash
pnpm install
```

### Development Server
```bash
pnpm dev
```

### Building
```bash
pnpm build
```

### Database Operations
```bash
pnpm db:push    # Generate and run database migrations
```

### Testing
```bash
pnpm test       # Run Vitest tests
```

### Code Quality
```bash
pnpm check      # Run TypeScript type checking
pnpm format     # Format code with Prettier
```

## Configuration

### Required Environment Variables
Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Manus OAuth & APIs
VITE_APP_ID=your_manus_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
JWT_SECRET=your_jwt_secret

# Built-in APIs (provided by Manus)
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Owner Info
OWNER_OPEN_ID=your_open_id
OWNER_NAME=your_name
```

## Key Features & Implementation

### Automated Book Creation
- Generate complete 12-page stories from simple prompts
- AI-powered story generation with age-appropriate content
- Character dialogue generation
- Plot development and refinement

### AI Image Generation
- Real AI image generation for book illustrations
- Automatic illustration for each page
- Consistent character and style across pages
- Watercolor and children's book style illustrations

### PDF Export
- Production-ready PDF export with KDP formatting
- Proper page sizing and margins
- High-quality image embedding
- Batch PDF export for multiple books

### Book Library
- View all created books
- Book detail views with pages, synopsis, and metadata
- Search and filter functionality
- Book management (edit, delete, export)

### Advanced Features
- LLM integration for story refinement
- Text-to-speech audio narration
- Marketing content generator for social media
- Stripe payment integration for monetization

## Development Guidelines

### Adding Features
1. **Update database schema** (if needed):
   - Edit `drizzle/schema.ts`
   - Run `pnpm db:push` to migrate

2. **Create backend procedures**:
   - Add query helpers in `server/db.ts`
   - Add tRPC procedures in `server/routers.ts`
   - Write tests in `server/*.test.ts`

3. **Build frontend UI**:
   - Create pages in `client/src/pages/`
   - Use shadcn/ui components from `client/src/components/ui/`
   - Call tRPC procedures with `trpc.*.useQuery()` or `trpc.*.useMutation()`

### API Integration Examples

#### LLM Integration
```typescript
import { invokeLLM } from "./server/_core/llm";

const response = await invokeLLM({
  messages: [
    { role: "system", content: "You are a children's book author." },
    { role: "user", content: "Create a story about potty training" }
  ]
});
```

#### Image Generation
```typescript
import { generateImage } from "./server/_core/imageGeneration";

const { url } = await generateImage({
  prompt: "A happy child learning to use the potty, watercolor style"
});
```

#### File Storage
```typescript
import { storagePut } from "./server/storage";

const { url } = await storagePut(
  `books/${bookId}/cover.jpg`,
  imageBuffer,
  "image/jpeg"
);
```

## Code Style Guidelines
- Use TypeScript for type safety
- Follow React 19 best practices
- Use functional components with hooks
- Maintain consistent naming conventions
- Use shadcn/ui components when possible
- Keep tRPC procedures organized and typed

## Design System
- **Aesthetic**: Vibrant Memphis-inspired design
- **Colors**: Soft peach background with pastel palette (mint, lilac, yellow)
- **Typography**: Bold uppercase sans-serif
- **Components**: Use shadcn/ui for consistent UI

## Common Issues & Solutions

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database credentials
- Ensure database server is running
- Run `pnpm db:push` to initialize schema

### OAuth Not Working
- Verify `VITE_APP_ID` matches your Manus app
- Check `OAUTH_SERVER_URL` is correct
- Clear browser cookies and try again

### Image Generation Failing
- Verify `BUILT_IN_FORGE_API_KEY` is valid
- Check API rate limits
- Ensure image prompts are descriptive
- Test with simpler prompts first

### Stripe Integration Issues
- Verify `STRIPE_SECRET_KEY` is correct
- Check Stripe account is in test/live mode appropriately
- Review Stripe dashboard for errors

### Build Errors
- Ensure you're using `pnpm` and not `npm`
- Check TypeScript compilation: `pnpm check`
- Verify all dependencies are installed
- Clear node_modules and reinstall if needed

## Testing
- Write tests for all tRPC procedures
- Test database queries
- Test API integrations (LLM, image generation)
- Test file upload/download
- Test PDF generation
- Run `pnpm test` before committing

## Deployment

### Manus Hosting
The project is designed to be deployed on Manus hosting:
1. Create a checkpoint in the Manus UI
2. Click the "Publish" button
3. Your app will be live at your configured domain

### Environment Setup
- Never commit `.env` to version control
- Each team member should create their own `.env` file
- Use shared credentials from your Manus account
- Verify all environment variables are set in production

## Team Collaboration

### GitHub Workflow
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

### Code Review
- Create pull requests for all changes
- Require at least one approval before merging
- Run tests and type checking before merging
- Review code for security issues

## Important Notes
- **Always use pnpm** - This project uses pnpm, not npm
- **Environment Variables** - Never commit `.env` files
- **Database Migrations** - Always run `pnpm db:push` after schema changes
- **Type Safety** - Maintain TypeScript strict mode
- **Testing** - Write tests for new features
- **API Keys** - Keep all API keys secure and never expose them
- **Children's Content** - Ensure all generated content is age-appropriate
- **Image Quality** - Test image generation thoroughly for children's book quality

## Additional Resources
- See `README.md` for comprehensive project documentation
- Check `todo.md` for ongoing tasks and improvements
- Consult Manus documentation for hosting and APIs
- Review Drizzle ORM documentation for database operations
- Check tRPC documentation for API procedures