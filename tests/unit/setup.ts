import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach, beforeEach } from "vitest"

/**
 * jsdom has no matchMedia. This stub lets tests toggle media queries such as
 * prefers-reduced-motion via `setMediaQuery`.
 */
const mediaState = new Map<string, boolean>()

export function setMediaQuery(query: string, matches: boolean) {
  mediaState.set(query, matches)
}

beforeEach(() => {
  mediaState.clear()
  // Node-environment tests (e.g. the code compile check) have no window.
  if (typeof window === "undefined") return
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList => ({
      media: query,
      matches: mediaState.get(query) ?? false,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  })
})

afterEach(() => {
  cleanup()
})
