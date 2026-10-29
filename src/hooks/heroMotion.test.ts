import { afterEach, describe, expect, it } from 'vitest'
import { gsap } from 'gsap'
import { createHeroTimeline, heroMotionSettings } from './heroMotion'

let scene: gsap.Context | undefined
function fixture(mode: 'desktop' | 'tablet' | 'mobile') {
  const root = document.createElement('section')
  root.innerHTML = `<div data-hero-background></div><div data-hero-character></div><div data-hero-panels><div class="glass-code"></div><div class="glass-impact"></div><ul class="technology-stack"><li></li></ul></div><div class="cinematic-copy"><h1>Quyen</h1><div class="cinematic-actions"><a href="#work">View my work</a></div></div>`
  document.body.append(root)
  let timeline!: gsap.core.Timeline
  scene = gsap.context(() => {
    timeline = createHeroTimeline(root, mode)
  }, root)
  return { root, timeline }
}
afterEach(() => {
  scene?.revert()
  document.body.replaceChildren()
})
describe('Hero scroll sequence', () => {
  it('reverses to the approved resting composition and keeps actions visible', () => {
    const { root, timeline } = fixture('desktop')
    expect(timeline.duration()).toBe(1)
    timeline.progress(0.95)
    expect(Number(gsap.getProperty(root.querySelector('h1'), 'opacity'))).toBe(
      0,
    )
    expect(
      gsap.getProperty(root.querySelector('[data-hero-character]'), 'rotation'),
    ).toBe(0)
    expect(
      root.querySelector<HTMLElement>('.cinematic-actions')?.style.opacity,
    ).toBe('1')
    timeline.progress(0)
    expect(gsap.getProperty(root.querySelector('h1'), 'opacity')).toBe(1)
    expect(
      gsap.getProperty(root.querySelector('[data-hero-character]'), 'y'),
    ).toBe(0)
    expect(
      gsap.getProperty(root.querySelector('[data-hero-character]'), 'scaleX'),
    ).toBe(1)
  })
  it('moves panels independently and restores styles on teardown', () => {
    const { root, timeline } = fixture('desktop')
    timeline.progress(0.5)
    expect(
      Number(gsap.getProperty(root.querySelector('.glass-code'), 'y')),
    ).toBeLessThan(0)
    expect(
      Number(gsap.getProperty(root.querySelector('.glass-impact'), 'y')),
    ).toBeGreaterThan(0)
    scene?.revert()
    expect(root.querySelector<HTMLElement>('h1')?.style.cssText).toBe('')
    expect(
      root.querySelector<HTMLElement>('[data-hero-character]')?.style.cssText,
    ).toBe('')
  })
  it('keeps all mobile copy readable and uses shorter tablet pinning', () => {
    const { root, timeline } = fixture('mobile')
    timeline.progress(1)
    expect(gsap.getProperty(root.querySelector('h1'), 'opacity')).toBe(1)
    expect(heroMotionSettings.mobile.pin).toBe(false)
    expect(heroMotionSettings.tablet.distance).toBeLessThan(
      heroMotionSettings.desktop.distance,
    )
  })
})
