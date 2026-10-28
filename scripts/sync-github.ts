import { mkdir, rename, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { projects } from '../src/data/portfolio.ts'
import {
  readSnapshot,
  syncRepositories,
  validateProjects,
} from './lib/github.ts'

const root = new URL('../', import.meta.url)
const cachePath = fileURLToPath(new URL('.cache/github.json', root))
const fallbackPath = fileURLToPath(
  new URL('src/data/github.snapshot.json', root),
)
const warn = (message: string) => console.warn(message)
const flags = new Set(process.argv.slice(2))
for (const flag of flags) {
  if (!['--refresh', '--update-snapshot'].includes(flag))
    throw new Error(`Unknown sync option: ${flag}`)
}
validateProjects(projects)
const repositories = projects.map((project) => project.repository)
const snapshot = await syncRepositories({
  repositories,
  cache: readSnapshot(cachePath, repositories, warn),
  fallback: readSnapshot(fallbackPath, repositories, warn),
  refresh: flags.has('--refresh'),
  warn,
})
const output = JSON.stringify(snapshot, null, 2) + '\n'
await mkdir(new URL('.cache/', root), { recursive: true })
const temporaryPath = `${cachePath}.${process.pid}.tmp`
await writeFile(temporaryPath, output)
await rename(temporaryPath, cachePath)
if (flags.has('--update-snapshot')) await writeFile(fallbackPath, output)
console.info(
  `GitHub metadata ready for ${Object.keys(snapshot.repositories).length}/${repositories.length} repositories.`,
)
