# Hero scroll motion review

The approved artwork, typography, navigation, spacing, and component composition are unchanged. Only the hero motion hook was replaced; the other portfolio sections retain their existing Motion behavior. No dependency, lockfile, workflow, SEO, or deployment configuration changed.

## Timeline and ownership

`src/hooks/heroMotion.ts` builds one paused, normalized GSAP master timeline. `useHeroAnimation.ts` gives one ScrollTrigger exclusive playback ownership: `scrub`, `pin`, function-based end distance, and `invalidateOnRefresh`. There is no autoplay entrance competing with scrolling. Every phase seeks backward as well as forward.

| Progress | Implemented motion                                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 0–15%    | Background depth and a subtle portrait lift/scale from the approved resting pose.                                                    |
| 15–35%   | Small portrait translation; the supplied raised hand remains static.                                                                 |
| 35–65%   | Code, impact, and technology panels move independently; portrait parallax continues.                                                 |
| 65–85%   | Portrait returns to its resting transform; noninteractive typography fades upward. CTA links remain visible and keyboard accessible. |
| 85–100%  | Background, portrait, and panels dim before the pin releases into the next section.                                                  |

Only transforms and opacity are animated. `force3D: false` avoids forcing every target into a permanent GPU layer. No blanket `will-change` or layout-property animation was added. GSAP contexts revert inline styles and pins on cleanup. Active progress is remapped after resizing, including breakpoint changes; the refresh guard excludes ScrollTrigger's temporary zero scroll during pin measurement.

## Responsive configuration

Edit `heroMotionQueries` and `heroMotionSettings` together:

- Desktop: width ≥1200, height ≥720, aspect ratio ≤2:1. Pin for 1.65 viewport heights; scrub catch-up 0.35 seconds.
- Tablet: width 768–1199, height ≥740. Pin for 0.8 viewport heights; half-strength portrait/panel translation and 0.25-second catch-up.
- Mobile, short, or ultrawide windows: no pin, no copy fade, and small direct scroll-linked parallax.
- Reduced motion: no hero timeline or pin; all content stays in normal flow. Preference changes during the sequence clean up the scene.

Native scrolling was retained after evaluating Lenis. It is not installed, and the measured native-scroll checks did not establish a benefit that justified another input owner. GSAP scrub smooths visual catch-up without intercepting wheel, keyboard, touch, anchor navigation, or browser history. No independent animation-frame loop or global smooth-scroll override was introduced.

## Future character animation: required assets

**An articulated wave is not implemented.** The current transparent `character.png` is a single 1312 × 1199 canvas with the raised arm already painted into the body. Rotating this entire image would not animate its arm.

Supply artist-authored transparent PNG/WebP layers on that same 1312 × 1199 registration canvas:

1. Body with the waving arm removed and the obscured torso reconstructed, preserving the approved face, short crop haircut, black jacket, white T-shirt, and lighting.
2. Separate upper arm, forearm, and hand, with overlapping joint artwork so rotation exposes no gaps.
3. A manifest containing the measured shoulder, elbow, and wrist coordinates in canvas pixels; parent relationships; front/back draw order; neutral transforms; safe rotation ranges; and an idle reference composite matching the body.
4. Reference poses for idle, raised arm, both wave extremes, and lowered arm. Start/end idle must align exactly.

`HeroCharacter.tsx` already accepts optional registered arm/hand layers, but those sibling slots are not a complete elbow rig. Extend them into a nested joint hierarchy only when the actual assets and measured pivots arrive. Existing suggested pivots are not verified artist measurements. Allocate the two wave cycles to 35–65% of this same master timeline; do not add a separate autoplay loop.

## Verification and captures

Before captures were taken from the old hook with reduced motion to freeze the approved composition. `before-*.png` and `after-*.png` cover desktop, tablet, and mobile. `progress-15.png` through `progress-100.png` show the pinned sequence. Pin spacing intentionally delays the next section; full-viewport desktop images therefore differ below the hero. `after-reduced-desktop.png` matched its before capture pixel-for-pixel in the local comparison. Normal-motion rendering has small compositing differences, without geometry or artwork changes.

The optional `scripts/verify-hero-scroll.mjs` uses an isolated Playwright installation, keeping project dependencies unchanged:

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 5184
# In another terminal; use an isolated temporary directory of your choice:
npm install --prefix /tmp/portfolio-playwright --no-save playwright@1.64.1
PLAYWRIGHT_PACKAGE_JSON=/tmp/portfolio-playwright/package.json \
PORTFOLIO_PREVIEW_URL=http://127.0.0.1:5184/ \
CHROME_EXECUTABLE_PATH='/path/to/chrome' \
node scripts/verify-hero-scroll.mjs
```

Alternatively install Playwright's Chromium and omit `CHROME_EXECUTABLE_PATH`. The script asserts wheel, reverse, incremental, fast, touch, resize, keyboard, anchor, direct-fragment, history, and reduced-motion behavior. It saves screenshots and `browser-results.json`, including measured rAF intervals and observed long tasks. Measurements are one headless local Chrome run, not a physical-device FPS guarantee. Real trackpad hardware, mobile Safari, and lower-powered devices still need device testing.

Vitest regressions cover reversible timeline state, independent panel movement, visible CTA links, absence of whole-character rotation, style cleanup, and the mobile fallback. Run the repository's existing format, lint, typecheck, test, and build commands before changing phase timing.

### Recorded results

- Formatting, ESLint, typechecking, all 36 Vitest tests, and production build passed with Node 24.22.1/npm 11.12.1.
- The browser script passed against the production preview at desktop 1536 × 1024, resized desktop 1440 × 900, tablet 768 × 1024, mobile 375 × 812, and short-window 1440 × 600 sizes. No page errors or failed HTTP responses were recorded.
- During incremental wheel input, 96 sampled frame intervals had median/p95/max approximately 16.7 ms; no long tasks were observed during that sample. These figures measure headless rAF scheduling, not rendered-frame completeness or physical-device performance.
- Build-time GitHub requests could not reach the network; the existing validated fallback snapshots supplied all three repositories. No metadata content was changed.
- No deployment was performed.
