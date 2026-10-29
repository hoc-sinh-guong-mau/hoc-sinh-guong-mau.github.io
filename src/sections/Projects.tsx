import { ExternalLink } from '../components/ui/ExternalLink'
import { ProjectCard } from '../components/ui/ProjectCard'
import { Architecture } from './Architecture'
import type {
  ArchitectureStage,
  GitHubRepositoryMetadata,
  Project,
} from '../types/portfolio'

interface ProjectsProps {
  items: readonly Project[]
  repositoryIndexUrl: string
  metadata: Readonly<Record<string, GitHubRepositoryMetadata>>
  trace?: { stages: readonly ArchitectureStage[]; repository: string }
}

export function Projects({
  items,
  metadata,
  repositoryIndexUrl,
  trace,
}: ProjectsProps) {
  const featured = items.filter((project) => project.featured)
  if (featured.length === 0) return null
  return (
    <section
      className="section container"
      id="work"
      aria-labelledby="work-heading"
    >
      <div className="section-heading" data-reveal>
        <div>
          <h2 id="work-heading">Selected work</h2>
          <p>From research interfaces to the structures underneath.</p>
        </div>
        <ExternalLink href={repositoryIndexUrl} className="text-link">
          All repositories
        </ExternalLink>
      </div>
      <div className="project-list">
        {featured.map((project) => (
          <ProjectCard
            project={project}
            metadata={metadata[project.repository]}
            key={project.id}
          />
        ))}
      </div>
      {trace && trace.stages.length > 0 && (
        <details className="architecture-disclosure glass-surface" data-reveal>
          <summary>Explore the NLP Course Assistant pipeline</summary>
          <Architecture {...trace} />
        </details>
      )}
    </section>
  )
}
