import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useEnhancedScroll } from '../hooks/useEnhancedScroll'
import type { HeroContent, Profile } from '../types/portfolio'

export function Hero({
  profile,
  content,
}: {
  profile: Profile
  content: HeroContent
}) {
  const [firstName, ...remainingNames] = profile.name.split(' ')
  const ref = useRef<HTMLElement>(null)
  const enhanced = useEnhancedScroll()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 24])
  return (
    <section
      ref={ref}
      className="hero container"
      aria-labelledby="hero-heading"
    >
      <div className="hero-topline">
        <p>{profile.location}</p>
        <span>Independent portfolio / 2026</span>
      </div>
      <motion.div className="hero-title" style={enhanced ? { y } : {}}>
        <h1 id="hero-heading">
          {firstName}
          <br />
          <span>{remainingNames.join(' ')}.</span>
        </h1>
        <motion.div
          className="engineering-orbit"
          aria-hidden="true"
          style={enhanced ? { rotate } : {}}
        >
          <svg viewBox="0 0 320 320" fill="none">
            <circle cx="160" cy="160" r="138" />
            <ellipse
              cx="160"
              cy="160"
              rx="58"
              ry="138"
              transform="rotate(45 160 160)"
            />
            <ellipse
              cx="160"
              cy="160"
              rx="58"
              ry="138"
              transform="rotate(-45 160 160)"
            />
            <path d="M0 160h320M160 0v320" />
            <circle cx="160" cy="160" r="12" className="orbit-core" />
          </svg>
          <span>Interface / Logic / Data</span>
        </motion.div>
      </motion.div>
      <div className="hero-bottom">
        <div>
          <p className="hero-role">
            {profile.role}
            <br />
            <span>{profile.focus}</span>
          </p>
          <p className="hero-introduction">{profile.introduction}</p>
        </div>
        <a className="button" href="#work">
          Explore the work <span aria-hidden="true">↓</span>
        </a>
      </div>
      <div className="hero-context">
        {content.context.map((item) => (
          <p key={item.label}>
            <span>{item.label}</span>
            {item.value}
          </p>
        ))}
      </div>
    </section>
  )
}
