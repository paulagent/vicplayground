# VIC Playground Monorepo (Nx)

Chinese-first Vancouver Island community MVP with Next.js + NestJS + PostgreSQL.

## Workspace layout

- `apps/web`: Next.js frontend (App Router)
- `apps/api`: NestJS API backend
- `libs/ui`: shared UI components
- `libs/types`: shared TypeScript types
- `libs/api-client`: typed web API wrappers
- `libs/auth`: shared auth constants/helpers
- `libs/validation`: shared Zod schemas
- `prisma`: schema and seed scripts
- `docs`: architecture + API notes
- `infra`: deployment notes and templates

## Local setup

1. Install dependencies
   - `pnpm install`
2. Configure env
   - `cp .env.example .env`
   - Fill OAuth and storage values
3. Create DB and run migrations
   - `pnpm prisma:migrate`
4. Seed categories
   - `pnpm prisma:seed`
5. Start apps
   - API: `pnpm dev:api`
   - Web: `pnpm dev:web`

## Security defaults included

- Google OAuth only (no local passwords)
- HttpOnly cookie session placeholder
- DTO validation on write endpoints
- Role guard scaffold for moderator/admin actions
- App-level throttling with `@nestjs/throttler`
- Upload file size/type validation
- Soft-delete/status-based moderation states

## First milestone checklist

- [x] Nx monorepo structure with web + api
- [x] Prisma schema with moderation-aware models
- [x] Google OAuth scaffolding + `/api/me`
- [x] Posts/comments/categories/report/admin endpoints
- [x] Category seed data
- [x] Production-minded env + docs skeleton
