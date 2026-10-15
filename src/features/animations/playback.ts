/**
 * Engine-agnostic handle returned by every adapter. Preview components only
 * talk to this interface, never to Motion or Anime.js directly.
 */
export interface PlaybackControls {
  play(): void
  pause(): void
  /** Stops the animation and releases engine resources. Must be idempotent. */
  dispose(): void
}

export type StartAnimation<Root extends Element, Config> = (
  root: Root,
  config: Config,
) => PlaybackControls

/** Query helper that keeps adapters free of repetitive null checks. */
export function queryTargets<T extends Element = HTMLElement>(
  root: Element,
  selector: string,
): T[] {
  return Array.from(root.querySelectorAll<T>(selector))
}

export function queryTarget<T extends Element = HTMLElement>(root: Element, selector: string): T {
  const target = root.querySelector<T>(selector)
  if (!target) throw new Error(`Animation target "${selector}" not found`)
  return target
}
