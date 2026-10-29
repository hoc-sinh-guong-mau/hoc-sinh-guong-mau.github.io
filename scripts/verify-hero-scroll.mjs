import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// Keep Playwright optional: run with an isolated installation, documented in the review.
const require = createRequire(
  process.env.PLAYWRIGHT_PACKAGE_JSON || import.meta.url,
)
const { chromium } = require('playwright')
const output = resolve('docs/review/hero-scroll')
const url = process.env.PORTFOLIO_PREVIEW_URL || 'http://127.0.0.1:5183/'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_EXECUTABLE_PATH
    ? { executablePath: process.env.CHROME_EXECUTABLE_PATH }
    : {}),
})
const errors = []
const results = []
async function open(viewport, options = {}) {
  const page = await browser.newPage({ viewport, ...options })
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('response', (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`)
  })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => globalThis.document.fonts.ready)
  await page.locator('.hero-character img').evaluate((image) => image.decode())
  return page
}
async function settle(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        let previous = '',
          stable = 0,
          frames = 0
        function sample() {
          const value = [
            globalThis.scrollY,
            ...['[data-hero-character]', '[data-hero-panels]'].map(
              (selector) =>
                globalThis.getComputedStyle(
                  globalThis.document.querySelector(selector),
                ).transform,
            ),
          ].join('|')
          stable = value === previous ? stable + 1 : 0
          previous = value
          if (stable >= 12 || ++frames > 240) resolve()
          else globalThis.requestAnimationFrame(sample)
        }
        globalThis.requestAnimationFrame(sample)
      }),
  )
}
async function state(page) {
  return page.locator('.cinematic-hero').evaluate((root) => ({
    y: root.getBoundingClientRect().top,
    height: root.getBoundingClientRect().height,
    scroll: globalThis.scrollY,
    distance:
      parseFloat(
        globalThis.getComputedStyle(root.parentElement).paddingBottom,
      ) || 0,
    pins: globalThis.document.querySelectorAll('.pin-spacer-portfolio-hero')
      .length,
    character: new globalThis.DOMMatrix(
      globalThis.getComputedStyle(root.querySelector('[data-hero-character]'))
        .transform,
    ).m42,
    headline: Number(
      globalThis.getComputedStyle(root.querySelector('h1')).opacity,
    ),
    overflow:
      globalThis.document.documentElement.scrollWidth > globalThis.innerWidth,
  }))
}
async function seek(page, progress, distance) {
  await page.evaluate(
    (y) => globalThis.scrollTo(0, y),
    Math.round(progress * distance),
  )
  await settle(page)
}
try {
  const page = await open({ width: 1536, height: 1024 })
  const initial = await state(page)
  assert.equal(initial.pins, 1)
  assert.equal(initial.distance, 1690)
  assert.equal(initial.overflow, false)
  await page.screenshot({ path: `${output}/after-desktop.png` })
  await page
    .locator('.cinematic-hero')
    .screenshot({ path: `${output}/hero-initial.png` })
  for (const progress of [0.15, 0.35, 0.5, 0.65, 0.85, 1]) {
    await seek(page, progress, initial.distance)
    const current = await state(page)
    assert(Math.abs(current.y) < 2, `Pin drift at ${progress}: ${current.y}`)
    await page.screenshot({
      path: `${output}/progress-${Math.round(progress * 100)}.png`,
    })
  }
  await seek(page, 0.5, initial.distance)
  const forward = await state(page)
  await page.mouse.wheel(0, -initial.distance * 0.3)
  await page.waitForFunction(
    (y) => globalThis.scrollY < y,
    initial.distance * 0.3,
  )
  await settle(page)
  await page.mouse.wheel(0, initial.distance * 0.3)
  await settle(page)
  const reversed = await state(page)
  assert(
    Math.abs(reversed.character - forward.character) < 0.1,
    'Reverse scroll must restore the same pose',
  )
  results.push(
    'Desktop wheel and reverse scrolling restore the same timeline state',
  )

  await seek(page, 0, initial.distance)
  await page.evaluate(() => {
    globalThis.heroFrameSamples = []
    globalThis.heroLongTasks = []
    const observer = new PerformanceObserver((list) =>
      globalThis.heroLongTasks.push(
        ...list.getEntries().map((entry) => entry.duration),
      ),
    )
    observer.observe({ type: 'longtask', buffered: false })
    let previous = performance.now()
    const start = previous
    function frame(now) {
      globalThis.heroFrameSamples.push(now - previous)
      previous = now
      if (now - start < 1600) globalThis.requestAnimationFrame(frame)
      else observer.disconnect()
    }
    globalThis.requestAnimationFrame(frame)
  })
  for (let step = 0; step < 40; step++) {
    await page.mouse.wheel(0, 12)
    // Deliberate input cadence emulates incremental trackpad deltas.
    await page.waitForTimeout(16)
  }
  await settle(page)
  await page.waitForFunction(() => globalThis.heroFrameSamples.length > 40)
  const timing = await page.evaluate(() => {
    const values = globalThis.heroFrameSamples.slice(1).sort((a, b) => a - b)
    return {
      frames: values.length,
      medianMs: values[Math.floor(values.length * 0.5)],
      p95Ms: values[Math.floor(values.length * 0.95)],
      maxMs: values.at(-1),
      longTasksMs: globalThis.heroLongTasks,
    }
  })
  assert((await state(page)).scroll > 400)
  results.push('Trackpad-like incremental wheel input advances the scene')

  await page.mouse.wheel(0, 5000)
  await page.waitForFunction((y) => globalThis.scrollY > y, initial.distance)
  await settle(page)
  assert((await state(page)).y < 0, 'Fast scroll releases the pin')
  await page.mouse.wheel(0, -10000)
  await page.waitForFunction(() => globalThis.scrollY === 0)
  await settle(page)
  assert.equal((await state(page)).headline, 1)
  results.push('Fast forward/reverse scrolling releases and restores the scene')

  await seek(page, 0.75, initial.distance)
  const beforeResize = await state(page)
  // Native wheel animation can still be settling at the viewport boundary.
  // Preserve the position the reader actually reached, not the seek request.
  const capturedProgress = beforeResize.scroll / beforeResize.distance
  assert(capturedProgress > 0.25 && capturedProgress < 0.85)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.waitForFunction(
    () =>
      parseFloat(
        globalThis.getComputedStyle(
          globalThis.document.querySelector('.cinematic-hero').parentElement,
        ).paddingBottom,
      ) === 1485,
  )
  await settle(page)
  const afterResize = await state(page)
  assert(
    Math.abs(afterResize.scroll / afterResize.distance - capturedProgress) <
      0.025,
    `Same-mode resize preserves progress: ${JSON.stringify({ beforeResize, afterResize })}`,
  )
  assert(Math.abs(afterResize.headline - beforeResize.headline) < 0.04)
  await page.setViewportSize({ width: 768, height: 1024 })
  await page.waitForFunction(
    () =>
      Math.abs(
        parseFloat(
          globalThis.getComputedStyle(
            globalThis.document.querySelector('.cinematic-hero').parentElement,
          ).paddingBottom,
        ) - 819,
      ) < 0.01,
  )
  await settle(page)
  const tablet = await state(page)
  assert.equal(tablet.pins, 1)
  assert(
    Math.abs(tablet.scroll / tablet.distance - capturedProgress) < 0.025,
    `Tablet resize reset: ${JSON.stringify(tablet)}`,
  )
  await seek(page, 0, tablet.distance)
  await page.screenshot({ path: `${output}/after-tablet.png` })
  results.push(
    'Resizing within desktop and across the tablet breakpoint preserves progress without duplicate pins',
  )

  await seek(page, 0.5, tablet.distance)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForFunction(
    () => !globalThis.document.querySelector('.pin-spacer-portfolio-hero'),
  )
  await settle(page)
  assert.equal((await state(page)).headline, 1)
  await page.evaluate(() => globalThis.scrollTo(0, 0))
  await page.screenshot({ path: `${output}/after-reduced-tablet.png` })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.waitForFunction(
    () =>
      globalThis.document.querySelectorAll('.pin-spacer-portfolio-hero')
        .length === 1,
  )
  await seek(page, 0, 819)
  await page.keyboard.press('Tab')
  assert(
    await page
      .locator('.skip-link')
      .evaluate((node) => node === globalThis.document.activeElement),
  )
  await page.keyboard.press('PageDown')
  await page.waitForFunction(
    () => globalThis.scrollY > globalThis.innerHeight * 0.75,
  )
  await settle(page)
  await seek(page, 0, 819)
  assert.equal((await state(page)).scroll, 0)
  await page.locator('.cinematic-actions a').first().click()
  await page.waitForURL('**/#work')
  await settle(page)
  assert(
    await page
      .locator('#work')
      .evaluate(
        (node) =>
          node.getBoundingClientRect().top < globalThis.innerHeight &&
          node.getBoundingClientRect().bottom > 0,
      ),
  )
  await page.goBack()
  await settle(page)
  assert(
    (await state(page)).scroll < 2,
    `Browser Back restores top: ${JSON.stringify(await state(page))}`,
  )
  await page.goForward()
  await settle(page)
  assert.equal(new URL(page.url()).hash, '#work')
  await page.goto(`${url}#work`, { waitUntil: 'networkidle' })
  await settle(page)
  assert(
    await page
      .locator('#work')
      .evaluate((node) => Math.abs(node.getBoundingClientRect().top - 110) < 3),
    'Initial fragment must account for pin spacing',
  )
  results.push(
    'Reduced motion, keyboard navigation, native anchors, Back/Forward, and direct section fragments pass',
  )
  await page.close()

  const mobile = await open(
    { width: 375, height: 812 },
    { hasTouch: true, isMobile: true },
  )
  assert.equal((await state(mobile)).pins, 0)
  await mobile.screenshot({ path: `${output}/after-mobile.png` })
  const cdp = await mobile.context().newCDPSession(mobile)
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 180, y: 700 }],
  })
  for (let y = 660; y >= 340; y -= 40) {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: 180, y }],
    })
    await mobile.waitForTimeout(16)
  }
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  })
  await mobile.waitForFunction(() => globalThis.scrollY > 100)
  await settle(mobile)
  assert.equal((await state(mobile)).pins, 0)
  assert.equal((await state(mobile)).headline, 1)
  assert.equal((await state(mobile)).overflow, false)
  await mobile.screenshot({ path: `${output}/mobile-touch.png` })
  results.push(
    'CDP touch swipe scrolls mobile natively, without pinning or hiding copy',
  )
  await mobile.close()

  const reduced = await open(
    { width: 1536, height: 1024 },
    { reducedMotion: 'reduce' },
  )
  assert.equal((await state(reduced)).pins, 0)
  await reduced.screenshot({ path: `${output}/after-reduced-desktop.png` })
  await reduced.close()
  const short = await open({ width: 1440, height: 600 })
  assert.equal((await state(short)).pins, 0)
  await short.close()
  assert.deepEqual(errors, [])
  const report = {
    results,
    timing,
    errors,
    note: 'Headless Chrome rAF timing in one local run; not physical-device FPS or a performance guarantee.',
  }
  await writeFile(
    `${output}/browser-results.json`,
    `${JSON.stringify(report, null, 2)}\n`,
  )
  console.log(JSON.stringify(report, null, 2))
} finally {
  await browser.close()
}
