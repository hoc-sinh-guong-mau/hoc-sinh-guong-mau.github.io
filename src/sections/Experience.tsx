import { TagList } from '../components/ui/TagList'
import { experience } from '../data/portfolio'

export function Experience() {
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
      <ol className="experience-list">
        {experience.map((job) => (
          <li className="experience-item" key={job.company}>
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
