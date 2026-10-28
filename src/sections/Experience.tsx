import { useRef } from 'react'
import { motion, useScroll } from 'motion/react'
import { useEnhancedScroll } from '../hooks/useEnhancedScroll'
import { TagList } from '../components/ui/TagList'
import type { ExperienceEntry } from '../types/portfolio'

export function Experience({
  entries,
}: {
  entries: readonly ExperienceEntry[]
}) {
  const ref = useRef<HTMLOListElement>(null)
  const enhanced = useEnhancedScroll()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  })
  return (
    <section
      className="section container experience-section"
      id="experience"
      aria-labelledby="experience-heading"
    >
      <div className="section-heading">
        <div>
          <h2 id="experience-heading">Experience</h2>
          <p>Building across application and AI engineering.</p>
        </div>
      </div>
      <ol ref={ref} className="experience-list">
        <motion.li
          className="timeline-progress"
          aria-hidden="true"
          style={enhanced ? { scaleY: scrollYProgress } : {}}
        />
        {entries.map((job) => (
          <li className="experience-item" key={job.id}>
            <div className="experience-meta">
              <h3>{job.company}</h3>
              <p>
                <time dateTime={job.start}>{job.startLabel}</time>
                {' – '}
                {job.end ? (
                  <time dateTime={job.end}>{job.endLabel}</time>
                ) : (
                  'Present'
                )}
              </p>
            </div>
            <div className="experience-content">
              <h4>{job.role}</h4>
              <p>{job.description}</p>
              <TagList
                items={job.technologies}
                label={`${job.company} technical focus`}
              />
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
