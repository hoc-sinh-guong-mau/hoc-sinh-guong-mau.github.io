import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useEnhancedScroll } from '../../hooks/useEnhancedScroll'
import type { GitHubRepositoryMetadata, Project } from '../../types/portfolio'
import { ExternalLink } from './ExternalLink'
import { TagList } from './TagList'
const updatedDate = new Intl.DateTimeFormat('en', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})
export function ProjectCard({
  project,
  metadata,
  index = 0,
  total = 1,
}: {
  project: Project
  metadata: GitHubRepositoryMetadata | undefined
  index?: number
  total?: number
}) {
  const ref = useRef<HTMLElement>(null)
  const enhanced = useEnhancedScroll()
  const [expanded, setExpanded] = useState(false)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75, 1],
    [0.94, 1, 1, 0.97],
  )
  return (
    <article
      ref={ref}
      className="project"
      data-pinned={enhanced && !expanded}
      id={project.id}
      aria-labelledby={`${project.id}-heading`}
    >
      <div className="project-stage">
        <div className="project-chapter">
          <span>
            Project {String(index + 1).padStart(2, '0')} /{' '}
            {String(total).padStart(2, '0')}
          </span>
          <span>{project.category}</span>
        </div>
        <div className="project-composition">
          {project.media && (
            <motion.figure
              className="project-media"
              style={enhanced && !expanded ? { scale } : {}}
            >
              <img
                src={project.media.src}
                alt={project.media.alt}
                width={project.media.width}
                height={project.media.height}
                loading="lazy"
                decoding="async"
              />
              <figcaption>{project.media.caption}</figcaption>
            </motion.figure>
          )}
          <div className="project-overview">
            <h3 id={`${project.id}-heading`}>{project.name}</h3>
            <p className="project-description">{project.description}</p>
            <TagList
              items={project.technologies}
              label={`${project.name} technologies`}
            />
            <ExternalLink
              className="text-link project-link"
              href={project.repository}
            >
              View repository{' '}
              <span className="sr-only">for {project.name}</span>
            </ExternalLink>
            <details
              onToggle={(event) => setExpanded(event.currentTarget.open)}
            >
              <summary>Inside the project</summary>
              <p>{project.approach}</p>
            </details>
            {metadata && (
              <p className="project-source">
                {metadata.language && <span>{metadata.language} / </span>}Source
                updated{' '}
                <time dateTime={metadata.updatedAt}>
                  {updatedDate.format(new Date(metadata.updatedAt))}
                </time>
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
