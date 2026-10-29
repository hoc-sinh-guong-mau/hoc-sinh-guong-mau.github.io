# Hero workspace compositing

The previous scene rendered the complete portrait above the desk and laptop, exposing the character's lap across the desk surface. The correction restores foreground occlusion using the existing workspace pixels. No artwork was regenerated or replaced, and character, copy, navigation, and panel coordinates are unchanged.

## Layer order

1. Original workspace and atmospheric lighting.
2. Character in the middle plane.
3. Desk, keyboard, laptop, and mug, revealed from the same workspace image by `public/images/hero/workspace-foreground-mask.svg`.
4. Existing text and floating technology panels.

The foreground repeats the workspace lighting and adds a restrained contact shadow across the desk. It is decorative and does not intercept pointer events.

## Registration contract

The mask uses the original workspace's **1823 × 863** coordinate system. Both workspace planes use identical `cover` sizing, background/mask positions, and transform origins. Mobile retains the original `62% center` crop. Both carry `data-hero-background`, so the existing master timeline moves them together in either scroll direction. Do not animate the foreground independently: that would separate the laptop contour from the underlying artwork.

If the workspace artwork changes, update its mask contours as well. The mask exposes only foreground objects; it does not replace or blur the room. The character's independently articulated asset contract remains unchanged.

## Review

- `before-desktop.png` / `after-desktop.png`: desk and laptop now correctly hide the lower portrait.
- `before-tablet.png` / `after-tablet.png`: unchanged copy and panel layout with the restored desk plane.
- `before-mobile.png` / `after-mobile.png`: full 375 × 1000 composition with foreground occlusion.
- `scroll/`: animation progress captures and browser regression results.

The before/after composition captures use reduced motion to compare a stable pose. Vitest additionally checks that workspace transforms and opacity remain identical through forward/reverse seeks. The Playwright script checks actual mask availability, stacking order, and matching transforms/crop positions throughout desktop scroll progress, tablet resizing, and mobile rendering.

To save future browser checks here without replacing the previous scroll review, run `scripts/verify-hero-scroll.mjs` with `HERO_REVIEW_DIR=docs/review/hero-compositing/scroll` and the isolated Playwright environment described in [the scroll review](../hero-scroll/README.md).

Verification passed: formatting, lint, typecheck, 38 Vitest tests, production build, and the Playwright regression suite against the local Vite server. Build-time GitHub requests used the existing validated fallback snapshots when network access failed. No deployment was performed.
