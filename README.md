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
  data/portfolio.ts      # Reviewed editorial content and manual featured flags
  data/github.snapshot.json # Versioned public metadata fallback
  types/portfolio.ts     # Explicit content and metadata models
  sections/              # Hero, projects, architecture, experience, skills, about, contact
  hooks/                 # Responsive/reduced-motion scroll enhancement gate
  assets/                # Bundled images and SVGs
  styles/                # Global and page styles
  test/setup.ts          # Shared test cleanup
scripts/                 # Build-time GitHub sync, validation, and tests
public/                  # Fonts, favicon, robots.txt, sitemap.xml
.agents/skills/          # Installed Codex skills and their resources
```

Add `components/layout`, `data`, or `utils` only when concrete code needs them. Keep state near its consumers, use direct imports, and avoid speculative abstractions. The design uses Be Vietnam Pro, locally hosted under `public/fonts/` with its SIL Open Font License. It uses a graphite palette with ice-blue and copper accents, flexible grids, visible keyboard focus, and reduced-motion support. Motion is pinned for scroll-linked transforms; CSS owns layout and sticky positioning.

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

Edit `src/data/portfolio.ts`; its explicit models live in `src/types/portfolio.ts`. Sections receive typed props from `App.tsx`, and `ProjectCard`, `TagList`, and `ExternalLink` handle reusable presentation.

- **Projects:** append an entry with a unique anchor-safe `id`, `featured` flag, title, category, factual description, technical approach, technologies, and an exact public GitHub repository URL. Array order sets display order; only `featured: true` entries appear. Metadata never selects projects or replaces editorial descriptions.
- **Experience:** append an entry with a stable `id`, company, role, ISO start/end months (`end: null` for current work), display labels, description, and technologies. Keep newest first.
- **Skills:** add a group or items to its `skills` array; the grid adapts automatically.
- **Education:** append entries with unique IDs; all entries render in the Education panel.
- **Profile and biography:** update `profile`, `about`, and `heroContent` together when career facts change. The architecture stages are an executed public-code trace, not a live demo. Update the trace and its evidence together. Update matching identity metadata in `index.html` when appropriate.

Use only approved public information. Do not add client internals, unverified outcomes, metrics, invented screenshots, unsupported live demos, or certifications. Adding entries requires no component changes or GitHub credentials.

## GitHub metadata sync and fallbacks

`npm run build` runs `prebuild`, which invokes `npm run sync:github` under Node 24. The script fetches only repositories explicitly listed in local content, using GitHub’s unauthenticated public REST API. There is no token or API call in the browser. The existing CI build performs this sync without a new workflow or service.

Metadata is validated for repository identity, public visibility, text types, nonnegative integer counts, and valid timestamps. The UI uses primary language and source-update dates; hand-written titles, descriptions, technical choices, and featured selection remain authoritative.

A one-hour cache lives in ignored `.cache/github.json`. Requests have a five-second timeout and at most three run concurrently. Fresh entries avoid requests. Valid stale entries remain usable when offline, rate-limited, or given malformed responses. Missing or invalid caches fall back to `src/data/github.snapshot.json`; if neither has valid metadata for a project, its full editorial content still renders without a metadata row. Failures produce build warnings rather than a broken page. Vite embeds the newest validated entries into the bundle at startup/build time.

```sh
# Refresh even if the local cache is fresh:
npm run sync:github -- --refresh

# Deliberately update the versioned fallback, then review its diff:
npm run sync:github -- --refresh --update-snapshot
```

Restart `npm run dev` after an explicit sync to see new metadata. Builds do not modify the versioned snapshot unless `--update-snapshot` is supplied. No scheduled workflow is required; the data refreshes on deployments. The site intentionally keeps showing the last deployed snapshot between builds.

Tests use injected fetch functions and fixed timestamps, covering validation, identity checks, cache reuse/expiry, rate limits, offline and timeout fallbacks, manual curation, and rendering new entries. Run `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` after updates, and inspect desktop/mobile layouts.

## Scroll scenes and project captures

The hero, project chapters, NLP sequence, timeline, and contact scene are composed independently. `useEnhancedScroll` enables pinning and scroll transforms only at ≥1024px wide, ≥720px tall, with no reduced-motion preference. Smaller/shorter windows and reduced motion use normal document flow and manual stage buttons. There is no scroll interception, autoplay, or continuous animation loop. Native project disclosures release their pin while expanded.

Add an optional `media` object to a project with a root-relative `src`, descriptive `alt`, factual `caption`, and intrinsic `width`/`height`. Store approved captures in `public/images/projects/`; projects without media still render their editorial content. Keep captions explicit about local application versus public source captures. Record repository revision, capture procedure, and limitations in [the visual review](docs/review/immersive/README.md). Never manufacture reports or dashboard screens.

`architectureStages` controls the interactive trace; stage buttons adapt to the entry count. Keep the verified trace in `docs/review/immersive/nlp-trace.json` aligned with the data. Review scroll transitions, keyboard selection, expanded details, anchor navigation, and contact links at desktop, tablet, mobile, and reduced motion after layout changes. Before/after captures and the storyboard are in `docs/review/immersive/`.
