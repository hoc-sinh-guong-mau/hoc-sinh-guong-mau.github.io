import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const require = createRequire(
  process.env.PLAYWRIGHT_PACKAGE_JSON || import.meta.url,
)
const { chromium } = require('playwright')
const output = resolve(
  process.env.PORTFOLIO_REVIEW_DIR || 'docs/review/sections',
)
const url = process.env.PORTFOLIO_PREVIEW_URL || 'http://127.0.0.1:5184/'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_EXECUTABLE_PATH
    ? { executablePath: process.env.CHROME_EXECUTABLE_PATH }
    : {}),
})
const order = [
  'about',
  'work',
  'skills',
  'experience',
  'education',
  'credentials',
  'contact',
]
const failures = []
const results = []
const heroComparisons = []
async function pause(page) {
  // Reveals are bounded to 690 ms including stagger. Also let scrub catch up.
  await page.waitForTimeout(900)
}
async function open(viewport, reducedMotion = 'no-preference') {
  const page = await browser.newPage({ viewport, reducedMotion })
  page.on('pageerror', (error) => failures.push(error.message))
  page.on('response', (response) => {
    if (response.status() >= 400)
      failures.push(`${response.status()} ${response.url()}`)
  })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => globalThis.document.fonts.ready)
  await page.locator('.hero-character img').evaluate((image) => image.decode())
  await pause(page)
  return page
}
async function noOverflow(page) {
  assert(
    await page.evaluate(
      () =>
        globalThis.document.documentElement.scrollWidth <=
        globalThis.innerWidth,
    ),
    'Horizontal page overflow',
  )
}
async function compareHero(page, name, label, height, width) {
  const afterPath = `${output}/hero-after-${name}-${label}.png`
  await page.screenshot({
    path: afterPath,
    clip: {
      x: 0,
      y: 140,
      width,
      height: Math.min(page.viewportSize().height, height) - 140,
    },
  })
  let before
  try {
    before = await readFile(`${output}/hero-before-${name}-${label}.png`)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    heroComparisons.push(
      `${name}/${label}: baseline unavailable; comparison not executed`,
    )
    return
  }
  const after = await readFile(afterPath)
  const different = await page.evaluate(
    async (sources) => {
      const images = await Promise.all(
        sources.map(
          (source) =>
            new Promise((resolve, reject) => {
              const image = new globalThis.Image()
              image.onload = () => resolve(image)
              image.onerror = reject
              image.src = source
            }),
        ),
      )
      const [a, b] = images
      if (a.width !== b.width || a.height !== b.height) return -1
      const canvas = globalThis.document.createElement('canvas')
      canvas.width = a.width
      canvas.height = a.height
      const context = canvas.getContext('2d')
      context.drawImage(a, 0, 0)
      const first = context.getImageData(0, 0, a.width, a.height).data
      context.clearRect(0, 0, a.width, a.height)
      context.drawImage(b, 0, 0)
      const second = context.getImageData(0, 0, a.width, a.height).data
      let count = 0
      for (let i = 0; i < first.length; i += 4)
        if (
          first[i] !== second[i] ||
          first[i + 1] !== second[i + 1] ||
          first[i + 2] !== second[i + 2] ||
          first[i + 3] !== second[i + 3]
        )
          count++
      return count
    },
    [before, after].map(
      (buffer) => `data:image/png;base64,${buffer.toString('base64')}`,
    ),
  )
  assert.equal(different, 0, `${name}/${label}: Hero pixels changed`)
  heroComparisons.push(`${name}/${label}: identical pixels below navigation`)
}
try {
  for (const [name, width, height] of [
    ['desktop', 1536, 1024],
    ['tablet', 768, 1024],
    ['mobile', 375, 812],
  ]) {
    const page = await open({ width, height })
    assert.deepEqual(
      await page
        .locator('.portfolio-content > section')
        .evaluateAll((sections) => sections.map((section) => section.id)),
      order,
    )
    const hero = await page.locator('.cinematic-hero').evaluate((root) => ({
      height: root.getBoundingClientRect().height,
      distance:
        parseFloat(
          globalThis.getComputedStyle(root.parentElement).paddingBottom,
        ) || 0,
    }))
    assert.equal(
      hero.distance,
      name === 'desktop' ? 1690 : name === 'tablet' ? 819.001 : 0,
    )
    await compareHero(page, name, 'initial', hero.height, width)
    if (name === 'desktop') {
      await page.evaluate((y) => globalThis.scrollTo(0, y), hero.distance * 0.5)
      await pause(page)
      await compareHero(page, name, 'middle', hero.height, width)
    }
    await page.evaluate(() => globalThis.scrollTo(0, 0))
    if (name !== 'desktop') {
      await page.locator('.navigation-disclosure summary').click()
      const mobileLinks = page
        .getByRole('navigation', { name: 'Mobile navigation' })
        .getByRole('link')
      assert.equal(await mobileLinks.count(), 8)
      await page.keyboard.press('Escape')
      assert.equal(
        await page.locator('.navigation-disclosure').getAttribute('open'),
        null,
      )
      await page.locator('.navigation-disclosure summary').click()
      await page
        .getByRole('navigation', { name: 'Mobile navigation' })
        .getByRole('link', { name: 'About' })
        .click()
      assert.equal(
        await page.locator('.navigation-disclosure').getAttribute('open'),
        null,
      )
    } else {
      await page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link', { name: 'About' })
        .click()
    }
    await page.waitForURL('**/#about')
    for (const id of order) {
      await page.goto(`${url}#${id}`, { waitUntil: 'networkidle' })
      await pause(page)
      const target = page.locator(`#${id}`)
      assert(
        await target.evaluate(
          (node) =>
            node.getBoundingClientRect().top < globalThis.innerHeight &&
            node.getBoundingClientRect().bottom > 0,
        ),
        `Unreachable section: ${id}`,
      )
      await noOverflow(page)
      const opacity = await target
        .locator('[data-reveal]')
        .first()
        .evaluate((node) => Number(globalThis.getComputedStyle(node).opacity))
      assert.equal(opacity, 1, `Unfinished reveal at #${id}`)
      assert.equal(
        await page.locator('.portfolio-content .pin-spacer').count(),
        0,
      )
      await page.screenshot({ path: `${output}/${name}-${id}.png` })
    }
    const contact = page.locator('#contact')
    assert.equal(await contact.getByRole('link').count(), 2)
    assert.equal(
      await contact
        .getByRole('link', { name: 'truongquyen0123@gmail.com' })
        .getAttribute('href'),
      'mailto:truongquyen0123@gmail.com',
    )
    assert.equal(
      await contact.getByRole('link', { name: /GitHub/ }).getAttribute('href'),
      'https://github.com/hoc-sinh-guong-mau',
    )
    assert(
      await contact
        .locator('.contact-icon')
        .evaluateAll((icons) =>
          icons.every(
            (icon) =>
              globalThis.getComputedStyle(icon).maskImage !== 'none' &&
              icon.getBoundingClientRect().width > 0,
          ),
        ),
    )
    await page
      .locator('#work')
      .evaluate((node) => node.scrollIntoView({ behavior: 'instant' }))
    await pause(page)
    const disclosure = page.locator('.architecture-disclosure')
    await disclosure.locator(':scope > summary').click()
    const answer = page.getByRole('button', { name: '05 Answer' })
    await answer.focus()
    await page.keyboard.press('Enter')
    assert.match(
      await page.getByLabel('Answer trace').textContent(),
      /3 tín chỉ/,
    )
    await noOverflow(page)
    await disclosure.locator(':scope > summary').click()
    await page
      .locator('#education')
      .evaluate((node) => node.scrollIntoView({ behavior: 'instant' }))
    await pause(page)
    const logo = page.getByRole('img', { name: 'HCMUT logo' })
    const logoGeometry = await logo.evaluate((image) => ({
      src: image.getAttribute('src'),
      natural: image.naturalWidth / image.naturalHeight,
      rendered:
        image.getBoundingClientRect().width /
        image.getBoundingClientRect().height,
      filter: globalThis.getComputedStyle(image).filter,
    }))
    assert.equal(logoGeometry.src, '/images/education/HCMCUT.svg')
    assert(Math.abs(logoGeometry.rendered - logoGeometry.natural) < 0.002)
    assert.equal(logoGeometry.filter, 'none')
    await page.goto(`${url}#architecture`, { waitUntil: 'networkidle' })
    await pause(page)
    assert.equal(
      await page.locator('.architecture-disclosure').getAttribute('open'),
      '',
    )
    assert(
      await page
        .locator('#architecture')
        .evaluate(
          (node) =>
            node.getBoundingClientRect().top < globalThis.innerHeight &&
            node.getBoundingClientRect().bottom > 0,
        ),
    )
    for (const path of [
      '/contact/github.svg',
      '/contact/facebook.svg',
      '/contact/linkedin.svg',
      '/contact/email.svg',
      '/contact/phone.svg',
      '/skills/code-xml.svg',
      '/skills/database.svg',
      '/skills/brain-circuit.svg',
      '/skills/wrench.svg',
    ]) {
      const response = await page.request.get(new URL(path, url).href)
      assert.equal(response.status(), 200)
      assert.match(await response.text(), /<svg/)
    }
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await pause(page)
    assert.equal(await page.locator('.pin-spacer-portfolio-hero').count(), 0)
    assert(
      await page
        .locator('.portfolio-content [data-reveal]')
        .evaluateAll((nodes) =>
          nodes.every(
            (node) => globalThis.getComputedStyle(node).opacity === '1',
          ),
        ),
    )
    await page
      .locator('#about')
      .evaluate((node) => node.scrollIntoView({ behavior: 'instant' }))
    await page.screenshot({ path: `${output}/${name}-reduced-motion.png` })
    await page.mouse.wheel(0, 500)
    await pause(page)
    await noOverflow(page)
    results.push(
      `${name}: section order, anchors, overflow, unpinned content, native scrolling, SVGs, logo proportions, contact links, keyboard trace, and reduced motion pass`,
    )
    await page.close()
  }
  const narrow = await open({ width: 320, height: 740 }, 'reduce')
  for (const id of order) {
    await narrow
      .locator(`#${id}`)
      .evaluate((node) => node.scrollIntoView({ behavior: 'instant' }))
    await noOverflow(narrow)
  }
  await narrow.close()
  results.push('320px viewport: no horizontal overflow')
  assert.deepEqual(failures, [])
  const report = {
    results,
    heroComparisons,
    failures,
    note: 'Local headless Chrome checks; physical devices and Safari not tested. Hero comparison excludes the navigation area updated by request.',
  }
  await writeFile(
    `${output}/browser-results.json`,
    `${JSON.stringify(report, null, 2)}\n`,
  )
  console.log(JSON.stringify(report, null, 2))
} finally {
  await browser.close()
}
