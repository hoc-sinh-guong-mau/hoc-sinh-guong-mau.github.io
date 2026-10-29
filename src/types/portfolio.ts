export interface Profile {
  name: string
  shortName: string
  location: string
  role: string
  focus: string
  email: string
  github: string
  introduction: string
  facebook?: string
  linkedin?: string
  phone?: string
}

export interface NavigationItem {
  label: string
  href: `#${string}`
}

export interface ProjectMedia {
  src: string
  alt: string
  caption: string
  width: number
  height: number
}

export interface ArchitectureStage {
  title: string
  description: string
  artifact: string
}

export interface Project {
  id: string
  media?: ProjectMedia
  featured: boolean
  name: string
  category: string
  description: string
  approach: string
  technologies: readonly string[]
  repository: string
  role?: string
  demo?: string
}

export interface ExperienceEntry {
  id: string
  company: string
  role: string
  start: string
  end: string | null
  startLabel: string
  endLabel: string
  description: string
  technologies: readonly string[]
}

export interface SkillGroup {
  title: string
  skills: readonly string[]
  icon?: string
}

export interface EducationEntry {
  id: string
  institution: string
  abbreviation: string
  program: string
  graduation: string
  status: string
  startYear?: string
  logo?: { src: string; width: number; height: number }
}

export interface Credential {
  id: string
  kind: 'Certificate' | 'Award'
  title: string
  issuer: string
  date: string
  dateLabel: string
  verificationUrl?: string
}

export interface AboutContent {
  heading: string
  introduction: string
  paragraphs: readonly string[]
  focusAreas: readonly { title: string; description: string }[]
}

export interface CharacterLayer {
  src: string
  width: number
  height: number
  pivot: string
}

export interface CharacterArtwork {
  body: CharacterLayer
  arm?: CharacterLayer
  hand?: CharacterLayer
}

export interface HeroContent {
  greeting: string
  role: string
  introduction: readonly string[]
  panelMessage: readonly string[]
  technologies: readonly string[]
  background: string
  character: CharacterArtwork
  context: readonly { label: string; value: string }[]
}

export interface GitHubRepositoryMetadata {
  repository: string
  description: string | null
  language: string | null
  stars: number
  forks: number
  updatedAt: string
  fetchedAt: string
}

export interface GitHubSnapshot {
  version: 1
  repositories: Record<string, GitHubRepositoryMetadata>
}
