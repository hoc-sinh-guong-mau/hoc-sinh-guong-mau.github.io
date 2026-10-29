import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** Scoped below the Hero: no pins, scroll interception, or Hero timeline access. */
export function usePortfolioMotion(ref: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 1024px)',
      },
      ({ conditions }) => {
        if (!conditions?.motion) return
        const scene = gsap.context(() => {
          const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]', root)
          reveals.forEach((element, index) => {
            gsap.fromTo(
              element,
              { y: 18, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                delay: (index % 3) * 0.045,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: element,
                  start: 'top 94%',
                  toggleActions: 'play none none none',
                  once: true,
                  invalidateOnRefresh: true,
                },
              },
            )
          })
          const timeline = root.querySelector('.timeline')
          const progress = root.querySelector('.timeline-progress')
          if (timeline && progress)
            gsap.fromTo(
              progress,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: timeline,
                  start: 'top 80%',
                  end: 'bottom 60%',
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            )
          if (conditions.desktop) {
            gsap.utils
              .toArray<HTMLElement>('[data-parallax] img', root)
              .forEach((image) => {
                gsap.fromTo(
                  image,
                  { y: -3 },
                  {
                    y: 3,
                    ease: 'none',
                    scrollTrigger: {
                      trigger: image,
                      start: 'top bottom',
                      end: 'bottom top',
                      scrub: true,
                      invalidateOnRefresh: true,
                    },
                  },
                )
              })
          }
        }, root)
        return () => scene.revert()
      },
    )
    // Native disclosures change later section positions. Refresh only this
    // content's triggers; the approved Hero owns its refresh lifecycle.
    let pendingRefresh: gsap.core.Tween | undefined
    const refreshContent = () => {
      pendingRefresh?.kill()
      pendingRefresh = gsap.delayedCall(0.05, () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger && root.contains(trigger.trigger))
            trigger.refresh()
        })
      })
    }
    root.addEventListener('toggle', refreshContent, true)
    return () => {
      root.removeEventListener('toggle', refreshContent, true)
      pendingRefresh?.kill()
      media.revert()
    }
  }, [ref])
}
