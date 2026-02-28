# Story Forge Kids 📚✨

An AI-powered children's book creation platform with automated story generation, illustration, and monetization capabilities.

## Features

**Core Functionality:**
- Automated book creation from simple text prompts (generates complete 12-page stories)
- Book library with detail views showing pages, synopsis, and metadata
- Real AI image generation for book illustrations
- Production-ready PDF export with KDP formatting
- Batch operations for bulk image generation and PDF export
- Progress tracking with visual feedback

**Advanced Features:**
- Advanced LLM integration for story refinement and plot improvements
- Character dialogue generation and age-appropriate content variations
- Text-to-speech audio narration for read-aloud features
- Marketing content generator for social media promotion
- Stripe payment integration for monetization

**Design:**
- Vibrant Memphis-inspired aesthetic
- Soft peach background with geometric elements
- Pastel color palette (mint, lilac, yellow)
- Bold uppercase sans-serif typography

## Tech Stack

- **Frontend:** React 19, Tailwind CSS 4, shadcn/ui
- **Backend:** Express 4, tRPC 11
- **Database:** MySQL/TiDB with Drizzle ORM
- **Authentication:** Manus OAuth
- **AI/ML:** Built-in LLM, Image Generation, Text-to-Speech APIs
- **Payments:** Stripe
- **Storage:** S3 (for images, PDFs, audio files)
- **Testing:** Vitest

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

## Getting Started

### Prerequisites

- Node.js 22+ and pnpm
- MySQL/TiDB database
- Manus account (for OAuth and built-in APIs)
- Stripe account (for payment processing)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd story-forge-kids
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment variables:**
   
   Create a `.env` file in the project root with the following variables:
   
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

4. **Set up the database:**
   ```bash
   pnpm db:push
   ```

5. **Start development server:**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:3000`

## Development Workflow

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

4. **Run tests**:
   ```bash
   pnpm test
   ```

5. **Format code**:
   ```bash
   pnpm format
   ```

### Key Development Commands

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Run production server
- `pnpm test` - Run Vitest tests
- `pnpm db:push` - Generate and run database migrations
- `pnpm check` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier

## API Integration

### LLM Integration

Use the built-in LLM for story generation and refinement:

```typescript
import { invokeLLM } from "./server/_core/llm";

const response = await invokeLLM({
  messages: [
    { role: "system", content: "You are a children's book author." },
    { role: "user", content: "Create a story about potty training" }
  ]
});
```

### Image Generation

Generate illustrations automatically:

```typescript
import { generateImage } from "./server/_core/imageGeneration";

const { url } = await generateImage({
  prompt: "A happy child learning to use the potty, watercolor style"
});
```

### File Storage

Store images, PDFs, and audio files in S3:

```typescript
import { storagePut } from "./server/storage";

const { url } = await storagePut(
  `books/${bookId}/cover.jpg`,
  imageBuffer,
  "image/jpeg"
);
```

## Team Collaboration

### GitHub Setup

This project is configured to be exported to GitHub for team collaboration:

1. **Export to GitHub:**
   - Use the Management UI → Settings → GitHub panel
   - Select repository owner and name
   - Authorize and export

2. **Cloning for team members:**
   ```bash
   git clone <your-github-repo-url>
   cd story-forge-kids
   pnpm install
   ```

3. **Environment variables:**
   - Each team member should create their own `.env` file
   - Use shared credentials from your Manus account
   - Never commit `.env` to version control

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

### Code Review

- Create pull requests for all changes
- Require at least one approval before merging
- Run tests and type checking before merging

## Deployment

The project is designed to be deployed on Manus hosting with built-in support for:

- OAuth authentication
- Database connectivity
- S3 storage
- LLM and image generation APIs
- Stripe payment processing

### Publishing

1. Create a checkpoint in the Manus UI
2. Click the "Publish" button
3. Your app will be live at your configured domain

## Troubleshooting

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

### Stripe Integration Issues

- Verify `STRIPE_SECRET_KEY` is correct
- Check Stripe account is in test/live mode appropriately
- Review Stripe dashboard for errors

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -am 'Add your feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Create a pull request

## License

MIT

## Support

For issues or questions:
- Check the troubleshooting section
- Review the code comments in key files
- Consult the Manus documentation

---

**Ready to create amazing children's books with AI!** 🚀📚
