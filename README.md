# Portfolio

A React 19 + Vite 8 + TypeScript application. A responsive portfolio for Truong Hieu Quyen, featuring selected projects, experience, technical skills, education, and contact information. It uses typed local content and native anchor navigation without routing, state libraries, or backend services.

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
  App.tsx                # Compose semantic page sections
  App.test.tsx           # User interaction and navigation tests
  main.tsx               # React entrypoint
  components/ui/         # External links and technology lists
  components/layout/     # Site header and navigation
  data/portfolio.ts      # Profile, projects, experience, skills, education
  sections/              # Hero, projects, experience, skills, about, contact
  assets/                # Bundled images and SVGs
  styles/                # Global and page styles
  test/setup.ts          # Shared test cleanup
public/                  # Fonts, favicon, robots.txt, sitemap.xml
.agents/skills/          # Installed Codex skills and their resources
```

Add `components/layout`, `data`, or `utils` only when concrete code needs them. Keep state near its consumers, use direct imports, and avoid speculative abstractions. The design uses Be Vietnam Pro, locally hosted under `public/fonts/` with its SIL Open Font License. It uses a cool light palette, flexible grids, visible keyboard focus, and reduced-motion support.

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

The GitHub Actions workflow runs these checks after `npm ci` on the configured runtime. A successful push to `main` (or manual run on `main`) uploads `dist/` and deploys it with the `github-pages` environment. Pull requests run verification without deploying. Deployment permissions are limited to the deployment job.

In repository Settings → Pages, select **GitHub Actions** as the publishing source. The site is hosted at https://hoc-sinh-guong-mau.github.io/ with Vite `base: '/'`. Native fragment links avoid client-route 404s. Static metadata, Person JSON-LD, `robots.txt`, and `sitemap.xml` use this canonical root URL; the page content is rendered by React in the browser.

## Configuration and dependency safety

The app currently requires no environment variables. `.env` and `.env.*` are ignored; only a sanitized `.env.example` may be tracked when configuration is needed. Vite exposes `VITE_*` values in the browser bundle: never put secrets in them. See the [Vite environment documentation](https://vite.dev/guide/env-and-mode).

Direct dependencies are pinned; TypeScript 5.9.3 satisfies the installed typescript-eslint peer range. For deliberate dependency updates, use `npm install --save-exact <package>@<version>` (add `-D` for development tooling), review the manifest and lockfile together, and repeat clean-install validation. Never use `--force` or `--legacy-peer-deps`. Keep `package-lock.json` committed and keep installed skills and `skills-lock.json` intact.

Use concise imperative commit messages; describe the change, checks, linked issues, and visual evidence where relevant in pull requests.

## Updating portfolio content

Edit `src/data/portfolio.ts` to update profile details, curated projects, experience, skills, and education. Projects need a stable unique `id`, name, category, factual description, technical approach, technology list, and repository URL. Keep experience ordered newest first, with ISO month values for semantic dates and readable date labels.

Use only approved public information. Do not add client internals, unverified outcomes, metrics, screenshots, live demos, or certifications. This version intentionally uses a labeled NLP pipeline schematic rather than simulated product screenshots. Keep the hero’s diagram consistent with the source project if its pipeline changes.

After content updates, run the quality checks above and review desktop/mobile layouts. Update matching metadata in `index.html` if the public identity or canonical URL changes. No GitHub token, CMS, live API fetch, or environment variables are needed to display the portfolio.
