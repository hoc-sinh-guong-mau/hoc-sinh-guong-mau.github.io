# Immersive portfolio visual review

## Art direction and evidence

[Storyboard](storyboard.md): technical editorial typography, graphite surfaces, ice-blue interactions, and restrained copper markers. Existing local Be Vietnam Pro fonts remain. The orbit is a decorative engineering motif, not a project diagram or claimed architecture.

Project screenshots are unaltered browser captures of public material, taken on 28 October 2026 at 1440 × 900 CSS pixels (DPR 2). The application serves copies from `public/images/projects/` with intrinsic dimensions and lazy loading. No confidential work, fabricated outputs, AI-generated imagery, or invented graphical interfaces are included.

| Capture                  | Public source revision                                                                                                                           | Procedure and limits                                                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `research-workspace.png` | [Chatbot-deepsearch-RAG / 4e7685f](https://github.com/hoc-sinh-guong-mau/Chatbot-deepsearch-RAG/tree/4e7685fe7ca46365acb490cd9109bcdf5a881413)   | Run the public React app locally. Initial workspace only. A dummy API key permitted initialization; no AI request or research result was generated. |
| `course-assistant.png`   | [NLP_CourseAssistant / df2ec01](https://github.com/hoc-sinh-guong-mau/NLP_CourseAssistant/tree/df2ec019059e739100ba2c7bef2e2ad14fcec9e8)         | Build its local SQLite knowledge base and run the public Streamlit app. Capture its initial interface and example prompts.                          |
| `warehouse-source.png`   | [project-DSA / 4ca38da](https://github.com/hoc-sinh-guong-mau/project-DSA/blob/4ca38da8f314679c4f13d69227eb402e664ba408/include/app/inventory.h) | Capture GitHub’s public `inventory.h` view. This is source code, not a warehouse dashboard.                                                         |

The architecture sequence uses [an actual DialogueSession execution](nlp-trace.json) from the pinned NLP revision: “Môn NLP có mấy tín chỉ?” → `GET_COURSE_INFO`, `CO3085`, `CREDITS` → SQLite course credits → source-attributed three-credit answer. It is a recorded trace, not a live API integration.

## Before and after

Before images show the published portfolio. After images show the local feature branch. Native Chrome responsive mode was used; these are viewport captures, not physical-device tests.

| Viewport                   | Before                       | After                                                                                                           |
| -------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Desktop, 1440 × 900        | [Before](before-desktop.png) | [Hero](after-desktop.png), [project](after-project-desktop.png), [architecture](after-architecture-desktop.png) |
| Tablet, 768 × 1024         | —                            | [Hero](after-tablet.png)                                                                                        |
| Mobile, 375 × 812          | [Before](before-mobile.png)  | [Hero](after-mobile.png), [project](after-project-mobile.png), [architecture](after-architecture-mobile.png)    |
| Reduced motion, 1440 × 900 | —                            | [Normal flow](after-reduced-motion.png)                                                                         |

Review checks: desktop project pinning through scroll; expanded native disclosure; scroll-driven architecture stage changes; click and Tab/Enter stage selection; stacked tablet/mobile projects; readable mobile trace; reduced-motion manual controls and normal flow. Screenshots document sampled states; automated tests cover content, navigation, trace selection, preference changes, and metadata failure paths. No screen-reader audit or physical-device performance claim is made.

## Verification results

Verified with Node 24.22.1 and npm 11.12.1: clean `npm ci` (zero reported vulnerabilities), formatting, ESLint, TypeScript, 31 tests, and production build. The restricted-network build exercised snapshot fallbacks for all three repositories and completed successfully. An explicit refresh with network access then fetched validated metadata for all three. Existing dependency pins, AGENTS.md, skills configuration, CI workflow, canonical SEO URL, and Vite root base remain intact. Motion 14.7.1 is the only added direct dependency.
