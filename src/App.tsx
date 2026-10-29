import { MotionConfig } from 'motion/react'
import { useEffect, useRef } from 'react'
import { usePortfolioMotion } from './hooks/usePortfolioMotion'
import { Header } from './components/layout/Header'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { Experience } from './sections/Experience'
import { Skills } from './sections/Skills'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Education } from './sections/Education'
import { Credentials } from './sections/Credentials'
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
  credentials,
} from './data/portfolio'
import { githubRepositories } from './data/github'
import './styles/App.css'

function App() {
  const content = useRef<HTMLDivElement>(null)
  usePortfolioMotion(content)
  useEffect(() => {
    // Fragment targets do not exist until this client-rendered page mounts.
    const target = window.location.hash.slice(1)
    if (target) {
      const element = document.getElementById(target)
      // Existing shared trace anchors now live inside a native disclosure.
      // Open ancestor details before measuring the fragment's scroll position.
      let ancestor = element?.parentElement
      while (ancestor) {
        if (ancestor instanceof HTMLDetailsElement) ancestor.open = true
        ancestor = ancestor.parentElement
      }
      element?.scrollIntoView({ behavior: 'instant', block: 'start' })
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
        <div className="portfolio-content" ref={content}>
          <About content={about} />
          <Projects
            items={projects}
            repositoryIndexUrl={profile.github}
            metadata={githubRepositories}
            trace={{
              stages: architectureStages,
              repository: architectureRepository,
            }}
          />
          <Skills groups={skillGroups} />
          <Experience entries={experience} />
          <Education entries={education} />
          <Credentials entries={credentials} />
          <Contact profile={profile} />
        </div>
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
