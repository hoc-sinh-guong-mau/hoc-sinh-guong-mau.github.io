export interface Profile {
  name: string
  shortName: string
  location: string
  role: string
  focus: string
  email: string
  github: string
  introduction: string
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
}

export interface EducationEntry {
  id: string
  institution: string
  abbreviation: string
  program: string
  graduation: string
  status: string
}

export interface AboutContent {
  heading: string
  introduction: string
  paragraphs: readonly string[]
}

export interface HeroContent {
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
