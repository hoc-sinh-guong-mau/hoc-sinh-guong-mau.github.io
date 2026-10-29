import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  createHeroTimeline,
  heroMotionQueries,
  heroMotionSettings,
} from './heroMotion'

export function useHeroAnimation(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const media = gsap.matchMedia()
    let resumeProgress: number | null = null
    let restoreScene: ((progress: number) => void) | null = null

    media.add(heroMotionQueries, ({ conditions }) => {
      if (!conditions?.motion) {
        restoreScene = (progress) => {
          const top = root.getBoundingClientRect().top + window.scrollY
          window.scrollTo({
            top: top + progress * root.offsetHeight,
            behavior: 'instant',
          })
        }
        return
      }
      gsap.registerPlugin(ScrollTrigger)
      const mode = conditions.desktop
        ? 'desktop'
        : conditions.tablet
          ? 'tablet'
          : 'mobile'
      const settings = heroMotionSettings[mode]
      let visibleProgress = 0
      const scene = gsap.context(() => {
        const master = createHeroTimeline(root, mode)
        // ScrollTrigger suppresses onUpdate during its temporary pin revert.
        // Retain normalized scene progress across that internal reset.
        let refreshProgress: number | null = null
        let refreshing = false
        const trigger = ScrollTrigger.create({
          id: 'portfolio-hero',
          onUpdate: (self) => {
            if (!refreshing) visibleProgress = self.progress
          },
          trigger: root,
          animation: master,
          start: 'top top',
          end: settings.pin
            ? () => `+=${Math.round(window.innerHeight * settings.distance)}`
            : 'bottom top',
          pin: settings.pin,
          pinSpacing: true,
          scrub: settings.scrub,
          anticipatePin: settings.pin ? 1 : 0,
          invalidateOnRefresh: true,
          onRefreshInit: (self) => {
            refreshing = true
            const scroll = window.scrollY
            // A pinned start can be -0.001. The temporary zero scroll used by
            // refresh must not overwrite a restored breakpoint position.
            refreshProgress =
              resumeProgress === null &&
              scroll > self.start + 1 &&
              scroll < self.end - 1
                ? (scroll - self.start) / (self.end - self.start)
                : null
          },
          onRefresh: (self) => {
            if (refreshProgress !== null) {
              self.scroll(
                self.start + refreshProgress * (self.end - self.start),
              )
              self.getTween()?.progress(1)
              master.progress(refreshProgress)
              refreshProgress = null
            }
            refreshing = false
          },
        })
        restoreScene = (progress) => {
          trigger.scroll(
            trigger.start + progress * (trigger.end - trigger.start),
          )
          trigger.update()
          trigger.getTween()?.progress(1)
          master.progress(progress)
        }
      }, root)
      return () => {
        resumeProgress =
          visibleProgress > 0.001 && visibleProgress < 0.999
            ? visibleProgress
            : null
        restoreScene = null
        scene.revert()
      }
    })

    // ScrollTrigger restores recorded scroll positions during a media change.
    // Remap only after that refresh, rather than fighting its restoration.
    const restoreAfterMediaChange = () => {
      if (resumeProgress !== null && restoreScene) {
        restoreScene(resumeProgress)
        resumeProgress = null
      }
    }
    ScrollTrigger.addEventListener('refresh', restoreAfterMediaChange)
    return () => {
      ScrollTrigger.removeEventListener('refresh', restoreAfterMediaChange)
      media.revert()
    }
  }, [ref])
}
