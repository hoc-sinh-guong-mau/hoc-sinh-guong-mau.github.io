import { skillGroups } from '../data/portfolio'

export function Skills() {
  return (
    <section
      className="section skills-section"
      id="skills"
      aria-labelledby="skills-heading"
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <h2 id="skills-heading">Technical skills</h2>
            <p>The tools and practices behind the work.</p>
          </div>
        </div>
        <div className="skills-grid">
          {skillGroups.map((group) => (
            <div className="skill-group" key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
