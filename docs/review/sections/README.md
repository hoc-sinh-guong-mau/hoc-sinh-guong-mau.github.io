# Portfolio section redesign

## Scope and design

The page now follows **Hero → About → Projects → Technical Skills → Experience → Education → Certificates & Awards → Contact**. The existing NLP processing trace remains inside an accessible Projects disclosure. Featured projects still come only from manually curated data, with their original screenshots, descriptions, technical approaches, and repository metadata.

The content design continues the approved Hero's navy and blue lighting through restrained glass surfaces, thin borders, and generous spacing. `App.css` scopes the content palette to `.portfolio-content`: background `#050a15`, surface `#0e192b`, ink `#f4f6fc`, muted text `#b4c1d9`, accent `#8ac7ff`. The existing 1200 px container is retained. Section spacing scales from 76 to 128 px; headings from 32 to 54 px. Below-Hero typography uses the existing locally hosted Be Vietnam Pro.

About uses an editorial two-column introduction with focus-area rows. Projects use one lead card and a two-column secondary grid, collapsing to one column on mobile. Skills form four desktop groups and two mobile columns. Experience uses a vertical timeline. Education has its own card; credentials support a responsive data-driven grid and an honest empty state. Contact publishes working channels only.

## Hero preservation

The Hero component, artwork, compositing mask, stylesheet, character/panel components, motion configuration, and master timeline were not changed by this task. File hashes were checked against the working tree at the start of the section redesign, including the prior approved compositing changes. Package files, CI, SEO, Vite configuration, AGENTS.md, and skill configuration were preserved.

Navigation was updated as requested: eight section anchors on desktop, with a native disclosure on smaller screens. The Hero screenshot comparison therefore excludes the navigation area (top 140 px). Initial desktop, tablet, and mobile captures and the desktop 50% scroll capture match pixel-for-pixel against an isolated pre-change **production** build. Development-to-production comparisons showed tiny colour-minification differences, so final comparisons used equivalent production builds.

## Motion and interaction

`usePortfolioMotion` operates only inside the below-Hero wrapper. It adds short transform/opacity reveals with small stagger offsets, stable once revealed; a reversible experience rail; and ±3 px desktop image parallax. No other sections pin or add artificial scroll distance. Reduced motion reverts all content animation styles. Native anchors, keyboard controls, scrolling, and browser history remain in use.

Disclosure changes refresh only content triggers, leaving Hero refresh ownership alone. Match-media contexts, listeners, and delayed callbacks clean up on unmount. The retained NLP trace is fully operable through native buttons without scroll-driven stage selection.

## Content and SVG updates

Edit `src/data/portfolio.ts`; typed models are in `src/types/portfolio.ts`:

- Projects may provide verified `role` and `demo` fields. Neither is invented when missing.
- Education supports optional `startYear` and an explicit `logo` asset/dimensions.
- `credentials` accepts confirmed title, issuer, kind, ISO date, display date, and optional verification URL. It is currently empty.
- Profile contact fields `facebook`, `linkedin`, and `phone` are optional. Only email and GitHub are currently supplied.
- Place new SVGs under `public/<page>/<name>.svg`; use root-relative `/<page>/<name>.svg` paths. Skill icons and education logo paths are data-driven. Contact icon filenames follow their channel names under `public/contact/`.

The supplied `public/images/education/HCMCUT.svg` is displayed unchanged, without colour filters, distortion, or cropping. It is the blue version without a white border, so it sits on a white inset with clear space. [HCMUT's brand guidance](https://portal.hcmut.edu.vn/gioi-thieu/nhan-dien-thuong-hieu?lang=en) distinguishes the standard white-background logo from the white-bordered version for dark backgrounds. No verified white-bordered SVG was supplied; the asset was not redrawn or claimed to be a newly downloaded official file.

Social SVGs are copied from [Simple Icons 13.21.0](https://github.com/simple-icons/simple-icons/tree/13.21.0/icons) (GitHub, Facebook, LinkedIn). Email, phone, and skill-category SVGs are from [Lucide 0.468.0](https://github.com/lucide-icons/lucide/tree/0.468.0/icons). Copies of the upstream licenses are in `public/contact/`. These are local static assets, without an icon-library dependency or third-party runtime request. All icons have adjacent accessible text and are decorative to screen readers.

Missing details remain unclaimed: Facebook/LinkedIn URLs, public phone, certificates/awards, education start year and formal degree title, project-specific ownership/roles, and live demos.

## Verification and screenshots

`hero-before-*.png` / `hero-after-*.png` compare approved Hero states; `*-full.png` includes the complete Hero and the changed navigation. `desktop-*.png`, `tablet-*.png`, and `mobile-*.png` cover each new section; `*-reduced-motion.png` records the static alternative. PNGs and `browser-results.json` are local review artifacts ignored by Git.

Representative local captures: `desktop-work.png`, `desktop-education.png`, and `mobile-contact.png`. Regenerate these with the browser script; they are not included in repository clones.

The optional browser script reuses an isolated Playwright installation (no dependency changes):

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 5184
# In another terminal, using the isolated Playwright setup from the Hero review:
PLAYWRIGHT_PACKAGE_JSON=/tmp/portfolio-playwright/package.json \
PORTFOLIO_PREVIEW_URL=http://127.0.0.1:5184/ \
CHROME_EXECUTABLE_PATH='/path/to/chrome' \
node scripts/verify-portfolio-sections.mjs
```

The script checks section order, anchors, native scrolling, keyboard menus/trace controls, overflow at 1536/768/375/320 px widths, absence of content pins, SVG responses, logo dimensions/proportions, real contact actions, and reduced motion. Hero pixel comparisons run only when local before captures are present; otherwise the report explicitly records the missing baseline. Physical devices and Safari still require device testing. Nothing is deployed by the script.

### Recorded results

- Formatting, lint, typecheck, all **46 Vitest tests**, and production build passed with the configured Node 24/npm 11 runtime.
- Production Playwright checks passed at desktop, tablet, mobile, and 320 px widths, including navigation clicks and legacy `#architecture` disclosure links. No page errors or failed HTTP responses were recorded.
- All four matched-production Hero comparisons reported identical pixels below the updated navigation area. Protected Hero, logo, dependencies, CI, AGENTS.md, and skills-lock hashes matched their start-of-task values.
- The existing Hero scroll suite also passed wheel/incremental/reverse/fast scrolling, breakpoint resizing, native anchors/history, touch emulation, and reduced motion with the new content in place. Its local captures are under `hero-scroll/`.
- Live build-time GitHub requests could not reach the network; the existing validated snapshots supplied all three featured repositories. No dependency installation, workflow change, or deployment was performed.
