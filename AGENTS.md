# Repository Guidelines

## Project Structure & Module Organization

This is a React 19 + Vite 8 + TypeScript application. `src/main.tsx` mounts React; `src/App.tsx` composes the page. Keep UI primitives in `src/components/ui/`, page sections in `src/sections/`, bundled images in `src/assets/`, and CSS in `src/styles/`. `public/` contains assets served directly. Shared test cleanup lives in `src/test/setup.ts`.

Create `components/layout`, `data`, or `utils` only when required by concrete code. Avoid empty directories, feature frameworks, barrel exports, and unnecessary dependencies.

## Build, Test, and Development Commands

Use Node 24.22.1 and npm 11.12.1, as recorded in `.nvmrc` and `package.json`. Run `nvm use` when available, then `npm ci`.

- `npm run dev`: start Vite locally.
- `npm run lint`: type-aware ESLint; warnings fail.
- `npm run typecheck`: check application, tests, and Vite configuration.
- `npm test`: run Vitest once; `npm run test:watch` enables watch mode.
- `npm run format:check`: verify Prettier formatting; `npm run format` applies it.
- `npm run build`: typecheck and produce `dist/`.
- `npm run preview`: inspect the production build locally.

Run formatting, lint, typecheck, tests, and build before reporting completion. CI also checks a clean `npm ci` installation.

## Coding Style & Architecture

Use two-space indentation, single quotes, and no semicolons; Prettier owns formatting. Use PascalCase for React components and camelCase for functions and variables. Preserve strict TypeScript settings and existing behavior. Keep state local, components focused, and imports direct. Prefer simple, accessible solutions; respect keyboard interaction, responsive layouts, and reduced motion when relevant.

## Testing Guidelines

Colocate `*.test.ts` or `*.test.tsx` files with source. Use Vitest, React Testing Library, and user-event to test observable behavior, edge cases, and regressions. Avoid implementation-coupled tests and unnecessary mocking. No coverage threshold is configured. Report any checks that could not run.

## Commit & Pull Request Guidelines

No Git history is currently available. Use concise imperative commit messages. Pull requests should explain purpose, checks performed, related issues, and screenshots for visual changes. Do not commit, push, or deploy without authorization.

## Configuration & Skills

Pin direct dependencies and update `package-lock.json` through npm; never use `--force` or `--legacy-peer-deps`. Never commit secrets; `VITE_*` values are public. Preserve `.agents/skills/` and `skills-lock.json`.

Read relevant `SKILL.md` instructions before use: `vercel-react-best-practices` for React, `frontend-design` and `ui-ux-pro-max` for design, and `web-design-guidelines` for UI audits. Do not invoke unrelated skills. Make focused changes, preserve user edits, verify results, and report limitations honestly.
