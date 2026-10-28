# Immersive engineering portfolio

## Art direction

Technical editorial typography on a graphite canvas. Existing self-hosted Be Vietnam Pro carries the display and body text; a system monospace is reserved for actual technical artifacts. Named colors: graphite `#080C12`, slate surface `#111A26`, paper `#EFF3F8`, secondary text `#A5B3C7`, ice blue `#8BC9E8`, and muted copper `#D6A67A`.

The subject is Quyen's work across interfaces, backend services, and AI integration. Real captures and a verified NLP trace carry the storytelling. No fabricated product interfaces, generated research results, metrics, or employer internals.

## Scroll storyboard

| Scene         | Desktop behavior                                                | Mobile and reduced motion                       |
| ------------- | --------------------------------------------------------------- | ----------------------------------------------- |
| Hero          | Large name, technical stack motif, scroll-linked exit           | Static composition and direct project link      |
| Selected work | Three sticky project chapters; image moves subtly with progress | Normal stacked articles, no pinning or parallax |
| Architecture  | Pinned NLP sequence; scroll and explicit controls select stages | Keyboard/touch controls and a normal-flow panel |
| Experience    | Confirmed roles and dates alongside a progress line             | Plain readable timeline                         |
| Contact       | Large invitation with restrained scroll-linked graphic          | Static email and GitHub actions                 |

Native scrolling remains intact. No scroll hijacking, autoplay video, infinite loops, or GSAP. Motion handles scroll values; CSS handles sticky positioning. Enhanced scenes require both a sufficiently large viewport and no reduced-motion preference. Text, source links, and contact actions stay operable throughout.

## Source audit

The previous layout exposes all prose at once, repeats identical project panels, and gives project evidence little visual weight. It has no scroll storytelling beyond the introductory transition. Its typed content, GitHub metadata cache, semantic navigation, SEO, and CI checks are retained as the engineering foundation.

## Evidence plan

- Before/after viewport captures are saved alongside this document.
- Research app: actual local empty workspace; no AI requests or generated results.
- NLP assistant: actual local Streamlit conversation using public course data.
- Warehouse system: public C++ implementation capture, explicitly labeled as source rather than a graphical application.
- Record source revisions and capture conditions in `captures.md`.
