import { fileURLToPath } from 'node:url'
import { projects } from './src/data/portfolio.ts'
import {
  readSnapshot,
  validateProjects,
  mergeSnapshots,
} from './scripts/lib/github.ts'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

validateProjects(projects)
const repositories = projects.map((project) => project.repository)
const warn = (message: string) => console.warn(message)
const root = new URL('./', import.meta.url)
const fallback = readSnapshot(
  fileURLToPath(new URL('src/data/github.snapshot.json', root)),
  repositories,
  warn,
)
const cache = readSnapshot(
  fileURLToPath(new URL('.cache/github.json', root)),
  repositories,
  warn,
)

export default defineConfig({
  define: {
    __GITHUB_REPOSITORIES__: JSON.stringify(
      mergeSnapshots(fallback, cache).repositories,
    ),
  },
  base: '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    clearMocks: true,
  },
})
