# Copilot Instructions for AI Agents

## Project Overview
- **Framework**: React Router 7 (not Remix)
- **UI**: Shadcn UI components (in `app/components/ui/`), icons from Lucide React
- **Data Layer**: Prisma ORM (with Turso/libSQL as the database)
- **App Structure**: All main app code is in `app/`, with features in `app/features/`, routes in `app/routes/`, and reusable UI in `app/components/ui/`
- **Database Models**: Defined in `prisma/schema.prisma`, generated client in `app/generated/prisma/`

## Key Conventions & Patterns
- **Imports**: Use `~` for root imports (e.g., `import { Button } from '~/components/ui/button'`)
- **Data Loading**: Always load data in route modules (`app/routes/`), not in feature or UI components
- **UI**: Only use Shadcn UI and Lucide React for new components/icons
- **No Remix**: Do not use Remix packages; only React Router 7 is supported

## Developer Workflows
- **Install dependencies**: `npm install`
- **Start dev server**: `npm run dev` (Vite, HMR enabled)
- **Build for production**: `npm run build`
- **Docker**: `docker build -t my-app .` then `docker run -p 3000:3000 my-app`
- **Prisma workflows**:
  - Initialize: `npx prisma init --output ../app/generated/prisma`
  - Migrate: `npx prisma migrate dev --name <desc>`
  - Generate client: `npx prisma generate`
  - Push schema: `npx prisma db push`
  - Seed: `npx prisma db seed`
- **Turso workflows**:
  - List DBs: `turso db list`
  - Create DB: `turso db create <name>`
  - Show DB info: `turso db show <name>`
  - Shell: `turso db shell <name>`

## Integration Points
- **Prisma Client**: Import from `~/generated/prisma/client`
- **Turso Client**: See example in README for `@libsql/client` usage
- **Environment**: DB credentials in `.env` (see README for example)

## Examples
- **Route data loading**: See `app/routes/tasks.tsx`
- **Feature component**: See `app/features/tasks/tasks-list.tsx`
- **UI component**: See `app/components/ui/button.tsx`
- **Prisma usage**: See `app/lib/utils.ts` or `prisma/prisma.ts`

## References
- [React Router Docs](https://reactrouter.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Turso Docs](https://docs.turso.tech/)

---

**AI agents:** Follow these conventions and reference the above files for examples. When in doubt, prefer patterns already present in the codebase.
