export interface RendererProps<Config> {
  config: Config
  /** Start the animation on mount; otherwise render the resting (final) frame. */
  autoplay: boolean
  paused: boolean
  /** Whether gesture demos should be reachable by keyboard. */
  interactive: boolean
}
