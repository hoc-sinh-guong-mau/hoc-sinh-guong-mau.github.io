import { Header } from './components/layout/Header'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { Experience } from './sections/Experience'
import { Skills } from './sections/Skills'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { profile } from './data/portfolio'
import './styles/App.css'

function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Projects />
        <Experience />
        <Skills />
        <About />
        <Contact />
      </main>
      <footer className="site-footer container">
        <p>{profile.name}</p>
        <a href="#top">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </>
  )
}

export default App
