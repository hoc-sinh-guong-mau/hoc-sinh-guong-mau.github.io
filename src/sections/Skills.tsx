import type { SkillGroup } from '../types/portfolio'

export function Skills({ groups }: { groups: readonly SkillGroup[] }) {
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
          {groups.map((group) => (
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
