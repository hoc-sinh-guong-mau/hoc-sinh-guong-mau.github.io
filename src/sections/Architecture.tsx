import { useState } from 'react'
import { ExternalLink } from '../components/ui/ExternalLink'
import type { ArchitectureStage } from '../types/portfolio'

function ArchitectureScene({
  stages,
  repository,
}: {
  stages: readonly ArchitectureStage[]
  repository: string
}) {
  const [selected, setSelected] = useState(0)
  const stage = stages[selected]
  if (!stage) return null
  return (
    <section
      id="architecture"
      className="architecture"
      data-pinned="false"
      aria-labelledby="architecture-heading"
    >
      <div className="section-heading">
        <div>
          <h3 id="architecture-heading">From question to answer</h3>
          <p>A working trace through the NLP Course Assistant.</p>
        </div>
        <ExternalLink href={repository} className="text-link">
          Read the source
        </ExternalLink>
      </div>
      <div
        className="architecture-track"
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
      </div>
      <div id="architecture-detail" className="architecture-detail">
        <div>
          <p className="scene-label">NLP Course Assistant / processing trace</p>
          <h4>{stage.title}</h4>
          <p>{stage.description}</p>
        </div>
        <pre tabIndex={0} aria-label={`${stage.title} trace`}>
          <code>{stage.artifact}</code>
        </pre>
      </div>
      <p className="scene-note">
        Select any stage to explore the sequence. Captured from public code; no
        generative model involved.
      </p>
    </section>
  )
}
export function Architecture(props: {
  stages: readonly ArchitectureStage[]
  repository: string
}) {
  return props.stages.length ? <ArchitectureScene {...props} /> : null
}
