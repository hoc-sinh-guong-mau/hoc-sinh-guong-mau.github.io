import { ExternalLink } from '../components/ui/ExternalLink'
import { ProjectCard } from '../components/ui/ProjectCard'
import type { GitHubRepositoryMetadata, Project } from '../types/portfolio'

interface ProjectsProps {
  items: readonly Project[]
  repositoryIndexUrl: string
  metadata: Readonly<Record<string, GitHubRepositoryMetadata>>
}

export function Projects({
  items,
  metadata,
  repositoryIndexUrl,
}: ProjectsProps) {
  const featured = items.filter((project) => project.featured)
  if (featured.length === 0) return null
  return (
    <section
      className="section container"
      id="work"
      aria-labelledby="work-heading"
    >
      <div className="section-heading">
        <div>
          <h2 id="work-heading">Selected work</h2>
          <p>From research interfaces to the structures underneath.</p>
        </div>
        <ExternalLink href={repositoryIndexUrl} className="text-link">
          All repositories
        </ExternalLink>
      </div>
      <div className="project-list">
        {featured.map((project, index) => (
          <ProjectCard
            project={project}
            index={index}
            total={featured.length}
            metadata={metadata[project.repository]}
            key={project.id}
          />
        ))}
      </div>
    </section>
  )
}
