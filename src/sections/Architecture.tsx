import { useRef, useState } from 'react'
import { useMotionValueEvent, useScroll, motion } from 'motion/react'
import { useEnhancedScroll } from '../hooks/useEnhancedScroll'
import { ExternalLink } from '../components/ui/ExternalLink'
import type { ArchitectureStage } from '../types/portfolio'
function ArchitectureScene({
  stages,
  repository,
}: {
  stages: readonly ArchitectureStage[]
  repository: string
}) {
  const ref = useRef<HTMLElement>(null)
  const enhanced = useEnhancedScroll()
  const [selected, setSelected] = useState(0)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (enhanced)
      setSelected(
        Math.min(
          stages.length - 1,
          Math.max(0, Math.floor(progress * stages.length)),
        ),
      )
  })
  const stage = stages[selected]
  if (!stage) return null
  return (
    <section
      ref={ref}
      id="architecture"
      className="architecture section"
      data-pinned={enhanced}
      aria-labelledby="architecture-heading"
    >
      <div className="architecture-stage container">
        <div className="section-heading">
          <div>
            <h2 id="architecture-heading">
              From question
              <br /> to answer.
            </h2>
            <p>A working trace through the NLP Course Assistant.</p>
          </div>
          <ExternalLink href={repository} className="text-link">
            Read the source
          </ExternalLink>
        </div>
        <div
          className="architecture-track"
          style={{
            gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))`,
          }}
          role="group"
          aria-label="Explore the processing stages"
        >
          {stages.map((item, index) => (
            <button
              key={item.title}
              type="button"
              aria-label={`${String(index + 1).padStart(2, '0')} ${item.title}`}
              aria-pressed={selected === index}
              aria-controls="architecture-detail"
              onClick={() => setSelected(index)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {item.title}
            </button>
          ))}
          <div
            className="architecture-rail"
            aria-hidden="true"
            style={{ width: `${((stages.length - 1) / stages.length) * 100}%` }}
          >
            <motion.div
              animate={{ scaleX: selected / Math.max(1, stages.length - 1) }}
              transition={{ duration: enhanced ? 0.25 : 0 }}
            />
          </div>
        </div>
        <div id="architecture-detail" className="architecture-detail">
          <div>
            <p className="scene-label">
              NLP Course Assistant / processing trace
            </p>
            <h3>{stage.title}</h3>
            <p>{stage.description}</p>
          </div>
          <pre tabIndex={0} aria-label={`${stage.title} trace`}>
            <code>{stage.artifact}</code>
          </pre>
        </div>
        <p className="scene-note">
          {enhanced
            ? 'Scroll through the sequence, or select any stage.'
            : 'Select any stage to explore the sequence.'}{' '}
          Captured from public code; no generative model involved.
        </p>
      </div>
    </section>
  )
}

export function Architecture(props: {
  stages: readonly ArchitectureStage[]
  repository: string
}) {
  return props.stages.length ? <ArchitectureScene {...props} /> : null
}
