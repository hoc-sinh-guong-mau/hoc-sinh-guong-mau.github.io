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
}: {
  project: Project
  metadata: GitHubRepositoryMetadata | undefined
}) {
  return (
    <article
      className="project glass-surface"
      id={project.id}
      aria-labelledby={`${project.id}-heading`}
      data-reveal
    >
      <div className="project-composition">
        {project.media && (
          <figure className="project-media">
            <div className="project-image-frame" data-parallax>
              <img
                src={project.media.src}
                alt={project.media.alt}
                width={project.media.width}
                height={project.media.height}
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption>{project.media.caption}</figcaption>
          </figure>
        )}
        <div className="project-overview">
          <p className="project-category">{project.category}</p>
          <h3 id={`${project.id}-heading`}>{project.name}</h3>
          {project.role && <p className="project-role">Role: {project.role}</p>}
          <p className="project-description">{project.description}</p>
          <TagList
            items={project.technologies}
            label={`${project.name} technologies`}
          />
          <details>
            <summary>Inside the project</summary>
            <p>{project.approach}</p>
          </details>
          <div className="project-links">
            <ExternalLink
              className="text-link project-link"
              href={project.repository}
            >
              View repository{' '}
              <span className="sr-only">for {project.name}</span>
            </ExternalLink>
            {project.demo && (
              <ExternalLink className="text-link" href={project.demo}>
                Live demo <span className="sr-only">for {project.name}</span>
              </ExternalLink>
            )}
          </div>
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
    </article>
  )
}
