# Reference-led cinematic hero

The supplied image is the visual source. Its six-frame strip is animation guidance only, as confirmed by the owner; it is not rendered on the public portfolio.

## Independent layers

- `Hero.tsx`: semantic identity, introduction, real anchor links, and data-driven context.
- `HeroCharacter.tsx`: decorative transparent portrait, with optional registered arm and hand image layers.
- `TechnologyPanels.tsx`: real HTML/CSS glass panels and inline SVG illustrations. The code panel is decorative reference artwork, not a working editor or project result.
- `Hero.css`: blue-lit environment, responsive composition, glass treatment, and reference typography.
- `useHeroAnimation.ts`: scoped GSAP 3.15.0 entrance and ScrollTrigger parallax. Cleanup reverts the scene; reduced motion restores the static composition. Tablet/mobile omit scroll parallax.

Existing Motion scenes below the hero, SEO, Vite root base, skills, AGENTS.md, and CI/CD are preserved. Existing package versions remain pinned. Playwright 1.64.1 was installed in a temporary directory for verification, rather than added to the project dependency tree. No installed Playwright SKILL.md was available; browser checks used the official Playwright library directly.

## Artwork and accuracy limits

`public/images/hero/workspace.png` (1823 × 863) and `character.png` (1312 × 1199, transparent) are AI-reconstructed approximations based on the owner-supplied reference. They are separate raster assets; no screenshot is embedded as the interface. The face, room details, laptop placement, and some icons differ from the reference. Original layered artwork is required for an exact reproduction.

Missing original assets:

1. Clean background/foreground artwork, including the desk and laptop, without character or interface.
2. Original full-resolution transparent character artwork.
3. Body artwork without the waving arm, plus separately registered upper arm, forearm, and hand assets, or an original character rig/pose sequence.
4. Original logo vectors and panel icon artwork for exact shape matching.

The current portrait already has a raised hand. Entrance/parallax move its outer layer only; this does not simulate an articulated wave. Future arm/hand parts must use the same canvas dimensions as the body and specify their pivot coordinates in `heroContent.character`. Replace the full raised-arm body with an arm-free body when supplying those parts. The independent wrappers provide animation targets without changing the hero layout.

## Visual review

Static screenshots were captured and compared visually with the supplied reference before animation was introduced. Refinements increased heading scale, corrected vertical rhythm and glass-panel proportions, and removed a tablet panel/face overlap.

- [Static hero](static-hero.png)
- [Final desktop](final-desktop.png), [tablet](final-tablet.png), [mobile](final-mobile.png), [320px layout](final-narrow.png)
- [Desktop scrolling](scroll-desktop.png), [reduced motion](reduced-motion.png)

Playwright checks exercised 1536 × 1024, 768 × 1024, 375 × 812, and 320 × 740 viewports; asset decoding, overflow, keyboard skip-link focus, work-anchor navigation, desktop transforms, and live reduced-motion changes. All project screenshots were decoded after scrolling to them, respecting their lazy loading. Initial checks incorrectly treated unloaded lazy images as failures; the check was corrected to load them before asserting. A scroll assertion also caught a missing hero ref, which was fixed before the successful run. No pixel-difference score, physical-device test, or screen-reader audit is claimed.

## Verification results

Node 24.22.1 / npm 11.12.1: clean `npm ci` succeeded with zero reported vulnerabilities. Formatting, lint, typechecking, 33 Vitest tests, and production build passed. Production Playwright checks passed all four viewports with no page errors or HTTP failures. The build-time metadata refresh was network-restricted and used the existing validated snapshots successfully. No existing dependency version, CI workflow, skills file, AGENTS.md, or Vite base setting changed.
