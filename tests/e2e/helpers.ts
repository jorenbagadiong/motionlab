import type { Locator, Page } from "@playwright/test"

export const ANIMATED_SELECTOR =
  "[data-anim-target], [data-anim-item], [data-anim-char], [data-anim-path], [data-anim-page]"

/**
 * True when an engine is driving the element: Motion may use WAAPI
 * (`getAnimations`) while Anime.js and Motion's JS driver write inline styles.
 * Resting markup in this app never carries inline styles.
 */
export function isEngineDriven(locator: Locator): Promise<boolean> {
  return locator.evaluate(
    (element) => element.getAnimations().length > 0 || (element.getAttribute("style") ?? "") !== "",
  )
}

/** Collects uncaught errors and console errors for the lifetime of the page. */
export function trackErrors(page: Page): string[] {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  return errors
}

/**
 * Navigates and waits until the page's scripts have loaded. Clicks that land
 * before React hydrates are silently dropped, which is most likely on the first
 * request to a freshly started server.
 */
export async function gotoHydrated(page: Page, path: string) {
  await page.goto(path)
  await page.waitForLoadState("networkidle")
}
