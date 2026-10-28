import { ExternalLink } from '../components/ui/ExternalLink'
import { TagList } from '../components/ui/TagList'
import { profile, projects } from '../data/portfolio'

export function Projects() {
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
        <ExternalLink href={profile.github} className="text-link">
          All repositories
        </ExternalLink>
      </div>
      <div className="project-list">
        {projects.map((project) => (
          <article
            className={`project project-${project.id}`}
            id={project.id}
            key={project.id}
            aria-labelledby={`${project.id}-heading`}
          >
            <div className="project-overview">
              <p className="project-category">{project.category}</p>
              <h3 id={`${project.id}-heading`}>{project.name}</h3>
              <p className="project-description">{project.description}</p>
              <ExternalLink
                className="text-link project-link"
                href={project.repository}
              >
                View repository{' '}
                <span className="sr-only"> for {project.name}</span>
              </ExternalLink>
            </div>
            <div className="project-details">
              <h4>Inside the project</h4>
              <p>{project.approach}</p>
              <TagList
                items={project.technologies}
                label={`${project.name} technologies`}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
