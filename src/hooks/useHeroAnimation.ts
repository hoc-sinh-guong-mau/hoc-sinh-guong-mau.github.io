import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useHeroAnimation(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const media = gsap.matchMedia()
    media.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 1024px)',
      },
      ({ conditions }) => {
        if (!conditions?.motion) return
        gsap.registerPlugin(ScrollTrigger)
        const scene = gsap.context(() => {
          const entrance = gsap.timeline({ defaults: { ease: 'power2.out' } })
          entrance
            .from('.cinematic-copy > *', {
              opacity: 0,
              y: 18,
              duration: 0.65,
              stagger: 0.09,
            })
            .from(
              '[data-hero-character]',
              { opacity: 0, y: 26, duration: 0.9 },
              0.12,
            )
            .from(
              '[data-hero-panels]',
              { opacity: 0, x: 22, duration: 0.75 },
              0.35,
            )
          if (conditions.desktop) {
            // Separate outer layers keep future arm/hand motion independent.
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: root,
                  start: 'top top',
                  end: 'bottom top',
                  scrub: 0.7,
                  invalidateOnRefresh: true,
                },
              })
              .to('[data-hero-background]', { yPercent: 10, ease: 'none' }, 0)
              .to('[data-hero-character]', { yPercent: 6, ease: 'none' }, 0)
              .to('[data-hero-panels]', { y: -30, ease: 'none' }, 0)
          }
        }, root)
        return () => scene.revert()
      },
    )
    return () => media.revert()
  }, [ref])
}
