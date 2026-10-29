import type {
  Profile,
  NavigationItem,
  Project,
  ExperienceEntry,
  SkillGroup,
  EducationEntry,
  HeroContent,
  AboutContent,
  ArchitectureStage,
  Credential,
} from '../types/portfolio.ts'

export const profile: Profile = {
  name: 'Truong Hieu Quyen',
  shortName: 'Quyen',
  location: 'Ho Chi Minh City, Vietnam',
  role: 'Full-Stack JavaScript Developer',
  focus: 'Backend & AI Engineer',
  email: 'truongquyen0123@gmail.com',
  github: 'https://github.com/hoc-sinh-guong-mau',
  introduction:
    'I work across JavaScript applications, backend services, and AI integrations, with a focus on databases, reliable APIs, testing, and deployment.',
} as const

export const navigation: readonly NavigationItem[] = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Awards', href: '#credentials' },
  { label: 'Contact', href: '#contact' },
]

export const architectureRepository =
  'https://github.com/hoc-sinh-guong-mau/NLP_CourseAssistant'

export const projects: readonly Project[] = [
  {
    id: 'deep-research',
    media: {
      src: '/images/projects/research-workspace.png',
      alt: 'Deep Research Chat App initial research workspace',
      caption: 'Local capture / public React application / no API request',
      width: 2880,
      height: 1800,
    },
    featured: true,
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
    media: {
      src: '/images/projects/course-assistant.png',
      alt: 'NLP Course Assistant Streamlit interface with course question examples',
      caption: 'Local capture / public Streamlit application',
      width: 2880,
      height: 1800,
    },
    featured: true,
    name: 'NLP Course Assistant',
    category: 'Language processing',
    description:
      'A course-information assistant built with classical NLP, grammar parsing, and a structured knowledge base.',
    approach:
      'Grammar and semantic rules turn course questions into structured queries. SQLite retrieval feeds template-based answers through CLI and Streamlit interfaces.',
    technologies: ['Python', 'NLTK', 'SQLite', 'Streamlit', 'Docker'],
    repository: architectureRepository,
  },
  {
    id: 'warehouse',
    media: {
      src: '/images/projects/warehouse-source.png',
      alt: 'Public C++ inventory implementation on GitHub',
      caption: 'Public source capture / C++ inventory structures',
      width: 2880,
      height: 1800,
    },
    featured: true,
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

export const experience: readonly ExperienceEntry[] = [
  {
    id: 'dong-da',
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
    id: 'veron',
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

export const skillGroups: readonly SkillGroup[] = [
  {
    title: 'Full-stack JavaScript',
    icon: '/skills/code-xml.svg',
    skills: ['JavaScript', 'TypeScript', 'React', 'NestJS'],
  },
  {
    title: 'Backend & data',
    icon: '/skills/database.svg',
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
    icon: '/skills/brain-circuit.svg',
    skills: ['Python', 'FastAPI', 'Gemini API', 'NLTK', 'AI integration'],
  },
  {
    title: 'Engineering practice',
    icon: '/skills/wrench.svg',
    skills: [
      'Integration testing',
      'Debugging',
      'Docker',
      'Deployment',
      'Data structures & algorithms',
    ],
  },
] as const

export const education: readonly EducationEntry[] = [
  {
    id: 'hcmut',
    institution: 'Ho Chi Minh City University of Technology',
    abbreviation: 'HCMUT',
    program: 'Computer Science',
    graduation: '2027',
    status: 'Expected graduation',
    logo: {
      src: '/images/education/HCMCUT.svg',
      width: 400,
      height: 404,
    },
  },
] as const

export const about: AboutContent = {
  heading: 'About me',
  introduction: `I’m Quyen, a developer based in ${profile.location}.`,
  paragraphs: [
    'My work connects full-stack JavaScript, backend engineering, and AI integration. I’m interested in how applications handle data, expose clear APIs, and stay understandable through testing and debugging.',
    'Alongside my development work, I’m studying Computer Science at HCMUT, with graduation expected in 2027.',
  ],
  focusAreas: [
    {
      title: 'Backend engineering',
      description: 'Clear REST APIs, relational data, and integration testing.',
    },
    {
      title: 'Full-stack development',
      description:
        'JavaScript and TypeScript, from React interfaces to NestJS services.',
    },
    {
      title: 'AI engineering',
      description:
        'Document processing, language tools, and practical AI integrations.',
    },
  ],
}

// Publish only owner-confirmed credentials; an empty list is an intentional state.
export const credentials: readonly Credential[] = []

export const heroContent: HeroContent = {
  greeting: "Hello, I'm",
  role: 'Software Engineer · AI Engineer',
  introduction: [
    'Building useful things with code and AI.',
    'Turning ideas into real-world impact.',
  ],
  panelMessage: ['Turning', 'ideas into', 'real-world impact.'],
  technologies: ['LLM', 'RAG', 'Agents', 'Product', 'Open Source'],
  background: '/images/hero/workspace.png',
  character: {
    body: {
      src: '/images/hero/character.png',
      width: 1312,
      height: 1199,
      pivot: '50% 100%',
    },
  },
  context: [
    {
      label: 'Projects',
      value: `${projects.filter((project) => project.featured).length}+`,
    },
    { label: 'Focus Area', value: 'AI/Backend' },
    { label: 'Computer Science', value: 'HCMUT' },
  ],
}

export const architectureStages: readonly ArchitectureStage[] = [
  {
    title: 'Question',
    description:
      'A course question enters the assistant. This example was executed against the public repository.',
    artifact: 'Môn NLP có mấy tín chỉ?',
  },
  {
    title: 'Grammar',
    description:
      'NLTK tokenization and feature-based grammar parsing identify the structure of the question.',
    artifact: '["môn", "nlp", "có", "mấy", "tín", "chỉ"]',
  },
  {
    title: 'Meaning',
    description:
      'Semantic rules resolve the requested information and course identifier.',
    artifact:
      '{ "predicate": "GET_COURSE_INFO",\n  "arguments": { "course_id": "CO3085" },\n  "qtype": "CREDITS" }',
  },
  {
    title: 'Retrieval',
    description:
      'The structured query selects the credits field from the SQLite course collection.',
    artifact:
      '{ "collection": "course",\n  "filters": { "id": "CO3085" },\n  "select": ["credits"] }',
  },
  {
    title: 'Answer',
    description:
      'A template turns the retrieved record into a source-attributed answer.',
    artifact: 'Môn CO3085 có 3 tín chỉ.\nNguồn: course_info.txt.',
  },
] as const
