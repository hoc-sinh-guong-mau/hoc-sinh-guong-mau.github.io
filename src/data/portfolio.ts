export const profile = {
  name: 'Truong Hieu Quyen',
  location: 'Ho Chi Minh City, Vietnam',
  role: 'Full-Stack JavaScript Developer',
  focus: 'Backend & AI Engineer',
  email: 'truongquyen0123@gmail.com',
  github: 'https://github.com/hoc-sinh-guong-mau',
  introduction:
    'I work across JavaScript applications, backend services, and AI integrations, with a focus on databases, reliable APIs, testing, and deployment.',
} as const

export const navigation = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const

export interface Project {
  id: string
  name: string
  category: string
  description: string
  approach: string
  technologies: readonly string[]
  repository: string
}

export const projects: readonly Project[] = [
  {
    id: 'deep-research',
    name: 'Deep Research Chat App',
    category: 'AI integration',
    description:
      'A research-focused chat application that brings an iterative research workflow and sourced reports into one interface.',
    approach:
      'A split-screen workspace separates the conversation from the research report, with source links available alongside the findings.',
    technologies: ['React', 'TypeScript', 'Gemini API', 'Docker'],
    repository: 'https://github.com/hoc-sinh-guong-mau/Chatbot-deepsearch-RAG',
  },
  {
    id: 'course-assistant',
    name: 'NLP Course Assistant',
    category: 'Language processing',
    description:
      'A course-information assistant built with classical NLP, grammar parsing, and a structured knowledge base.',
    approach:
      'Grammar and semantic rules turn course questions into structured queries. SQLite retrieval feeds template-based answers through CLI and Streamlit interfaces.',
    technologies: ['Python', 'NLTK', 'SQLite', 'Streamlit', 'Docker'],
    repository: 'https://github.com/hoc-sinh-guong-mau/NLP_CourseAssistant',
  },
  {
    id: 'warehouse',
    name: 'Warehouse Management System',
    category: 'Data structures & algorithms',
    description:
      'A warehouse-data management project exploring how fundamental data structures support storage and retrieval.',
    approach:
      'Uses hash tables, heaps, and Huffman trees to manage warehouse data in C/C++.',
    technologies: ['C/C++', 'Hash tables', 'Heaps', 'Huffman trees'],
    repository: 'https://github.com/hoc-sinh-guong-mau/project-DSA',
  },
]

export const experience = [
  {
    company: 'Dong Da',
    role: 'Freelance Full-Stack Developer',
    start: '2026-02',
    end: null,
    startLabel: 'Feb 2026',
    endLabel: 'Present',
    description:
      'Full-stack development for financial workflows, with work spanning REST APIs, relational data, and integration testing.',
    technologies: [
      'NestJS',
      'PostgreSQL',
      'Prisma',
      'REST APIs',
      'Integration testing',
    ],
  },
  {
    company: 'Veron',
    role: 'AI Engineer Intern',
    start: '2025-07',
    end: '2025-12',
    startLabel: 'Jul 2025',
    endLabel: 'Dec 2025',
    description:
      'Worked on document processing and AI services using Python and FastAPI, with relational and vector databases and Docker-based environments.',
    technologies: [
      'Python',
      'FastAPI',
      'Document processing',
      'Vector databases',
      'Docker',
    ],
  },
] as const

export const skillGroups = [
  {
    title: 'Full-stack JavaScript',
    skills: ['JavaScript', 'TypeScript', 'React', 'NestJS'],
  },
  {
    title: 'Backend & data',
    skills: [
      'REST APIs',
      'PostgreSQL',
      'Prisma',
      'SQLite',
      'Relational & vector databases',
    ],
  },
  {
    title: 'AI & language',
    skills: ['Python', 'FastAPI', 'Gemini API', 'NLTK', 'AI integration'],
  },
  {
    title: 'Engineering practice',
    skills: [
      'Integration testing',
      'Debugging',
      'Docker',
      'Deployment',
      'Data structures & algorithms',
    ],
  },
] as const

export const education = {
  institution: 'Ho Chi Minh City University of Technology',
  abbreviation: 'HCMUT',
  program: 'Computer Science',
  graduation: '2027',
} as const
