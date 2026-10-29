import { gsap } from 'gsap'

export type HeroMotionMode = 'desktop' | 'tablet' | 'mobile'

export const heroMotionQueries = {
  motion: '(prefers-reduced-motion: no-preference)',
  // Pin only when the approved composition fits in the viewport.
  desktop:
    '(min-width: 1200px) and (min-height: 720px) and (max-aspect-ratio: 2/1)',
  tablet: '(min-width: 768px) and (max-width: 1199px) and (min-height: 740px)',
} as const

export const heroMotionSettings = {
  desktop: { pin: true, distance: 1.65, scrub: 0.35 },
  tablet: { pin: true, distance: 0.8, scrub: 0.25 },
  mobile: { pin: false, distance: 0, scrub: true },
} as const

/** One normalized, paused timeline. ScrollTrigger is its only playback owner. */
export function createHeroTimeline(root: HTMLElement, mode: HeroMotionMode) {
  const select = gsap.utils.selector(root)
  const timeline = gsap.timeline({
    paused: true,
    defaults: { ease: 'none', force3D: false },
  })
  // Both workspace planes share the camera transform to keep occlusion aligned.
  const background = select('[data-hero-background]')
  const character = select('[data-hero-character]')
  const panels = select('[data-hero-panels]')
  const copy = select(
    '.hero-greeting, .cinematic-copy h1, .cinematic-role, .cinematic-introduction, .cinematic-context',
  )
  const intensity = mode === 'desktop' ? 1 : 0.5

  // Preserve the approved resting composition, including its glass compositing.
  gsap.set(select('.cinematic-copy > *'), { y: 0, opacity: 1, force3D: false })
  gsap.set(character, { x: 0, y: 0, scale: 1, opacity: 1, force3D: false })
  gsap.set(panels, { x: 0, y: 0, force3D: false })

  timeline.addLabel('depth', 0)
  if (mode === 'mobile') {
    return timeline
      .to(background, { scale: 1.025, duration: 1 }, 0)
      .to(character, { y: -10, duration: 1 }, 0)
      .to(panels, { y: -8, duration: 1 }, 0)
  }

  return (
    timeline
      .to(background, { scale: 1.04, yPercent: -1.5, duration: 0.85 }, 0)
      .to(
        character,
        { scale: 1 + 0.008 * intensity, y: -4 * intensity, duration: 0.15 },
        0,
      )
      .addLabel('character', 0.15)
      // The supplied PNG has a raised hand. These are camera/portrait movements,
      // not an arm animation. No whole-character rotation substitutes for a rig.
      .to(
        character,
        { x: 2 * intensity, y: -10 * intensity, duration: 0.2 },
        0.15,
      )
      .to(panels, { y: -12 * intensity, duration: 0.65 }, 0)
      .addLabel('panels', 0.35)
      .to(character, { y: -14 * intensity, duration: 0.3 }, 0.35)
      .to(
        select('.glass-code'),
        { y: -10 * intensity, x: 4 * intensity, duration: 0.15 },
        0.35,
      )
      .to(
        select('.glass-impact'),
        { y: 7 * intensity, x: -3 * intensity, duration: 0.15 },
        0.35,
      )
      .to(
        select('.technology-stack li'),
        { y: -5 * intensity, duration: 0.2, stagger: 0.02 },
        0.35,
      )
      .to(
        select('.glass-code'),
        { y: -4 * intensity, x: 0, duration: 0.15 },
        0.5,
      )
      .to(
        select('.glass-impact'),
        { y: 2 * intensity, x: 0, duration: 0.15 },
        0.5,
      )
      .addLabel('settle', 0.65)
      .to(character, { x: 0, y: 0, scale: 1, duration: 0.2 }, 0.65)
      .to(copy, { y: -14 * intensity, opacity: 0, duration: 0.2 }, 0.65)
      .addLabel('transition', 0.85)
      .to(background, { opacity: 0.45, duration: 0.15 }, 0.85)
      .to(character, { y: 10 * intensity, opacity: 0.35, duration: 0.15 }, 0.85)
      .to(panels, { opacity: 0.2, duration: 0.15 }, 0.85)
      .addLabel('complete', 1)
  )
}
