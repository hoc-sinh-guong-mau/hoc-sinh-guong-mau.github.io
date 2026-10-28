# Portfolio

A React 19 + Vite 8 + TypeScript application. The current UI is the Vite starter; the repository provides a baseline for building the portfolio without introducing routing, state libraries, or backend services.

## Requirements and setup

Use Node **24.22.1** (24 LTS) and npm **11.12.1**. `.nvmrc`, `engines`, and `packageManager` record these conventions; `.npmrc` rejects incompatible runtimes and saves exact package versions.

```sh
nvm install
nvm use
npm install --global npm@11.12.1
npm ci
npm run dev
```

If you do not use nvm, install the same versions through your preferred runtime manager. The repository configuration does not switch your shell's Node version automatically.

## Commands

| Command                | Purpose                                                                     |
| ---------------------- | --------------------------------------------------------------------------- |
| `npm ci`               | Install the exact dependency tree from `package-lock.json`.                 |
| `npm run dev`          | Start Vite with hot module replacement.                                     |
| `npm run lint`         | Run ESLint, including type-aware TypeScript and React rules; warnings fail. |
| `npm run lint:fix`     | Apply available ESLint fixes.                                               |
| `npm run typecheck`    | Check application, tests, and Vite configuration with TypeScript.           |
| `npm test`             | Run Vitest tests once in jsdom.                                             |
| `npm run test:watch`   | Run tests interactively during development.                                 |
| `npm run format:check` | Check formatting with Prettier.                                             |
| `npm run format`       | Apply Prettier formatting.                                                  |
| `npm run build`        | Typecheck and create the production bundle in `dist/`.                      |
| `npm run preview`      | Serve the built bundle locally for inspection.                              |

## Source organization

```text
src/
  App.tsx                # Compose the page sections
  App.test.tsx           # User interaction and navigation tests
  main.tsx               # React entrypoint
  components/ui/         # Small UI components (currently Counter)
  sections/              # GettingStarted and NextSteps page sections
  assets/                # Bundled images and SVGs
  styles/                # Global and page styles
  test/setup.ts          # Shared test cleanup
public/                  # Files served without bundling
.agents/skills/          # Installed Codex skills and their resources
```

Add `components/layout`, `data`, or `utils` only when concrete code needs them. Keep state near its consumers, use direct imports, and avoid speculative abstractions. The current layout and starter content are preserved.

## Quality and testing

TypeScript uses strict checking, checked indexed access, and exact optional properties. ESLint handles correctness; Prettier handles formatting separately. Tests use Vitest, React Testing Library, and user-event, with explicit cleanup between tests. Colocate tests as `*.test.ts` or `*.test.tsx`, assert visible behavior, and cover relevant failure paths when adding features. No arbitrary coverage target is imposed.

Before submitting changes, run:

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

The GitHub Actions workflow runs these checks after `npm ci` on the configured runtime. It becomes active when this workspace is hosted in a GitHub repository. No deployment workflow is included.

## Configuration and dependency safety

The app currently requires no environment variables. `.env` and `.env.*` are ignored; only a sanitized `.env.example` may be tracked when configuration is needed. Vite exposes `VITE_*` values in the browser bundle: never put secrets in them. See the [Vite environment documentation](https://vite.dev/guide/env-and-mode).

Direct dependencies are pinned; TypeScript 5.9.3 satisfies the installed typescript-eslint peer range. For deliberate dependency updates, use `npm install --save-exact <package>@<version>` (add `-D` for development tooling), review the manifest and lockfile together, and repeat clean-install validation. Never use `--force` or `--legacy-peer-deps`. Keep `package-lock.json` committed and keep installed skills and `skills-lock.json` intact.

This workspace currently has no `.git` metadata or commit history. When contributing through Git, use concise imperative commit messages; describe the change, checks, linked issues, and visual evidence where relevant in pull requests.
