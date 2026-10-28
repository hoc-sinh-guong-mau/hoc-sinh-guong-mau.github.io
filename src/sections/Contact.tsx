import { useRef } from 'react'
import { motion, useScroll } from 'motion/react'
import { useEnhancedScroll } from '../hooks/useEnhancedScroll'
import { ExternalLink } from '../components/ui/ExternalLink'
import type { Profile } from '../types/portfolio'

export function Contact({ profile }: { profile: Profile }) {
  const ref = useRef<HTMLElement>(null)
  const enhanced = useEnhancedScroll()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })
  return (
    <section
      ref={ref}
      className="section container contact-section"
      id="contact"
      aria-labelledby="contact-heading"
    >
      <motion.div
        className="contact-rule"
        aria-hidden="true"
        style={enhanced ? { scaleX: scrollYProgress } : {}}
      />
      <div>
        <h2 id="contact-heading">Let’s connect.</h2>
        <p>
          For a project conversation or an engineering opportunity,
          <br className="desktop-break" /> email is the best place to start.
        </p>
      </div>
      <div className="contact-links">
        <a className="contact-email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <ExternalLink className="text-link" href={profile.github}>
          Find me on GitHub
        </ExternalLink>
      </div>
    </section>
  )
}
