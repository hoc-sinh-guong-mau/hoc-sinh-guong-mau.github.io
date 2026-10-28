import { MotionConfig } from 'motion/react'
import { Architecture } from './sections/Architecture'
import { useEffect } from 'react'
import { Header } from './components/layout/Header'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { Experience } from './sections/Experience'
import { Skills } from './sections/Skills'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import {
  profile,
  navigation,
  projects,
  experience,
  skillGroups,
  education,
  about,
  heroContent,
  architectureStages,
  architectureRepository,
} from './data/portfolio'
import { githubRepositories } from './data/github'
import './styles/App.css'

function App() {
  useEffect(() => {
    // Fragment targets do not exist until this client-rendered page mounts.
    const target = window.location.hash.slice(1)
    if (target) {
      document
        .getElementById(target)
        ?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header profile={profile} navigation={navigation} />
      <main id="main" tabIndex={-1}>
        <Hero profile={profile} content={heroContent} />
        <Projects
          items={projects}
          repositoryIndexUrl={profile.github}
          metadata={githubRepositories}
        />
        <Architecture
          stages={architectureStages}
          repository={architectureRepository}
        />
        <Experience entries={experience} />
        <Skills groups={skillGroups} />
        <About content={about} education={education} />
        <Contact profile={profile} />
      </main>
      <footer className="site-footer container">
        <p>{profile.name}</p>
        <a href="#top">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </MotionConfig>
  )
}

export default App
