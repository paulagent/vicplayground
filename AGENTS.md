# AGENTS

## Project Overview

Project: Vic playground, a website to allow victoria residents to share their outdoor experiences and build a community
Target user: outdoor enthusiast
My skill level: intermediate
Stack: Next.js, NestJS, Prisma, Nx monorepo, pnpm

## Commands

Install: `docker compose up --build`
Dev: `docker compose up`
Build: `docker compose run --rm web pnpm build`
Test: `docker compose run --rm web pnpm test`
Lint: `docker compose run --rm web pnpm lint`

## Do

- Read existing code before modifying anything
- Match existing patterns, naming, and style
- Handle errors gracefully - no silent failures
- Keep changes small and scoped to what was asked
- Use containers with OrbStack or Docker for local work instead of starting the app directly on the host machine
- Run containerized dev/build after changes to verify nothing broke
- Ask clarifying questions before guessing

## Don't

- Install new dependencies without asking
- Start the app directly on the host machine when the container setup can be used
- Delete or overwrite files without confirming
- Hardcode secrets, API keys, or credentials
- Rewrite working code unless explicitly asked
- Push, deploy, or force-push without permission
- Make changes outside the scope of the request

## When Stuck

- If a task is large, break it into steps and confirm the plan first
- If you can't fix an error in 2 attempts, stop and explain the issue

## Testing

- Run existing tests after any change
- Add at least one test for new features
- Never skip or delete tests to make things pass

## Git

- Small, focused commits with descriptive messages
- Never force push

## Response Style

- always respond with clear & concise messages
- use plain English when explaining to the User
- avoid long sentences, complex words, or long paragraphs
