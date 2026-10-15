"use client"

import { animate as animeAnimate, createDrawable, stagger } from "animejs"
import {
  animate,
  type AnimationPlaybackControls,
  motion,
  type MotionValue,
  type PanInfo,
  useMotionValue,
  useTransform,
} from "motion/react"
import {
  Children,
  type ComponentProps,
  createContext,
  type KeyboardEvent,
  type ReactNode,
  use,
  useEffect,
  useEffectEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import { NumberTicker } from "@/components/ui/number-ticker"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils/cn"

/*
 * Engine split: Motion moves the blocks (track, drag, snapping, indicators);
 * Anime.js animates SVG and text (arrow strokes, the rolling slide counter).
 */

export type CarouselOrientation = "horizontal" | "vertical"
export type CarouselAlign = "start" | "center"
export type CarouselEffect = "none" | "fade" | "scale"

interface CarouselContextValue {
  id: string
  orientation: CarouselOrientation
  align: CarouselAlign
  slidesPerView: number
  effect: CarouselEffect
  loop: boolean
  index: number
  count: number
  canPrev: boolean
  canNext: boolean
  scrollTo: (index: number) => void
  next: () => void
  prev: () => void
  /** Whether slide `index` is (mostly) inside the viewport. */
  isVisible: (index: number) => boolean
  /** Autoplay interval in ms, 0 when off (or reduced motion). */
  autoplay: number
  playing: boolean
  setPlaying: (playing: boolean) => void
  /** 0–1 progress towards the next autoplay step. */
  autoplayProgress: MotionValue<number>
  /** Track offset and slide size in px, for Motion-driven effects. */
  offset: MotionValue<number>
  slideSize: MotionValue<number>
  setSize: (size: number) => void
  size: number
  countStore: CountStore
  onDragEnd: (info: PanInfo) => void
}

const CarouselContext = createContext<CarouselContextValue | null>(null)
const ItemIndexContext = createContext(0)

/** State and actions of the nearest Carousel, for building custom controls. */
export function useCarousel() {
  const context = use(CarouselContext)
  if (!context) throw new Error("useCarousel must be used inside <Carousel>")
  return context
}

/** CarouselContent reports how many slides it has; the root reads it without an effect loop. */
interface CountStore {
  get: () => number
  set: (count: number) => void
  subscribe: (listener: () => void) => () => void
}

function createCountStore(): CountStore {
  let count = 0
  const listeners = new Set<() => void>()
  return {
    get: () => count,
    set: (next) => {
      if (next === count) return
      count = next
      listeners.forEach((listener) => listener())
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * Slide geometry in "slide units" (1 = one slide). `unitOffset(i)` is where the
 * track sits when slide i is the current one.
 */
function geometry(count: number, perView: number, align: CarouselAlign) {
  const overflow = Math.max(0, count - perView)
  const maxIndex = align === "center" ? Math.max(0, count - 1) : Math.ceil(overflow)
  const unitOffset = (index: number) =>
    align === "center" ? -index + (perView - 1) / 2 : -Math.min(index, overflow)
  const bounds =
    align === "center"
      ? { min: -(count - 1) + (perView - 1) / 2, max: (perView - 1) / 2 }
      : { min: -overflow, max: 0 }
  return { maxIndex, unitOffset, bounds }
}

const SPRING = { type: "spring", stiffness: 320, damping: 36, mass: 0.9 } as const

interface CarouselProps {
  /** Accessible name, e.g. "Featured presets". */
  label: string
  orientation?: CarouselOrientation
  /** `start` pins slides to the leading edge; `center` centers the current slide. */
  align?: CarouselAlign
  /** Slides visible at once. Fractions show a peek of the next slide. */
  slidesPerView?: number
  /** Opacity or scale falls off with distance from the center while dragging and moving. */
  effect?: CarouselEffect
  /** Wrap from the last slide to the first and back. */
  loop?: boolean
  /** Milliseconds per slide; 0 turns autoplay off. Off when the user prefers reduced motion. */
  autoplay?: number
  onIndexChange?: (index: number) => void
  className?: string
  children: ReactNode
}

export function Carousel({
  label,
  orientation = "horizontal",
  align = "start",
  slidesPerView = 1,
  effect = "none",
  loop = false,
  autoplay = 0,
  onIndexChange,
  className,
  children,
}: CarouselProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const [countStore] = useState(createCountStore)
  const count = useSyncExternalStore(countStore.subscribe, countStore.get, countStore.get)
  const [index, setIndex] = useState(0)
  const [size, setSize] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const offset = useMotionValue(0)
  const slideSize = useMotionValue(0)
  const autoplayProgress = useMotionValue(0)
  const settling = useRef<AnimationPlaybackControls | null>(null)

  const perView = Math.max(0.5, slidesPerView)
  const { maxIndex, unitOffset } = geometry(count, perView, align)
  const current = clamp(index, 0, maxIndex)
  const interval = reduced ? 0 : autoplay

  function settle(target: number, instant = false) {
    settling.current?.stop()
    const to = unitOffset(target) * size
    if (instant || reduced) offset.set(to)
    else settling.current = animate(offset, to, SPRING)
  }

  function scrollTo(target: number) {
    const next = loop
      ? ((target % (maxIndex + 1)) + maxIndex + 1) % (maxIndex + 1)
      : clamp(target, 0, maxIndex)
    if (next !== current) {
      setIndex(next)
      onIndexChange?.(next)
    }
    settle(next)
  }

  // Keep the track aligned (without animating) when the viewport resizes or slides change.
  const realign = useEffectEvent(() => {
    slideSize.set(size)
    settling.current?.stop()
    offset.set(unitOffset(current) * size)
  })
  useLayoutEffect(() => realign(), [size, count, perView, align])

  // Autoplay: Motion drives a 0–1 progress value; CarouselProgress renders it.
  const running = interval > 0 && playing && !hovered && !focused && count > 1
  const advance = useEffectEvent(() => scrollTo(current >= maxIndex ? 0 : current + 1))
  useEffect(() => {
    autoplayProgress.set(0)
  }, [current, autoplayProgress])
  useEffect(() => {
    if (!running) return
    const controls = animate(autoplayProgress, 1, {
      duration: ((1 - autoplayProgress.get()) * interval) / 1000,
      ease: "linear",
      onComplete: advance,
    })
    return () => controls.stop()
  }, [running, current, interval, autoplayProgress])

  function onDragEnd(info: PanInfo) {
    if (size === 0) return
    const axis = orientation === "vertical" ? "y" : "x"
    const projected = (offset.get() + info.velocity[axis] * 0.2) / size
    let target = current
    let best = Infinity
    for (let i = 0; i <= maxIndex; i++) {
      const distance = Math.abs(unitOffset(i) - projected)
      if (distance < best) [best, target] = [distance, i]
    }
    // A deliberate short swipe still moves one slide.
    if (target === current && Math.abs(info.offset[axis]) > size * 0.15) {
      target = clamp(current + (info.offset[axis] < 0 ? 1 : -1), 0, maxIndex)
    }
    scrollTo(target)
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("input, textarea, select, [contenteditable]")) return
    const vertical = orientation === "vertical"
    const back = vertical ? "ArrowUp" : "ArrowLeft"
    const forward = vertical ? "ArrowDown" : "ArrowRight"
    if (event.key === back) scrollTo(current - 1)
    else if (event.key === forward) scrollTo(current + 1)
    else if (event.key === "Home") scrollTo(0)
    else if (event.key === "End") scrollTo(maxIndex)
    else return
    event.preventDefault()
  }

  const isVisible = (slide: number) => {
    const position = slide + unitOffset(current)
    return position > -0.5 && position + 1 < perView + 0.5
  }

  const value: CarouselContextValue = {
    id,
    orientation,
    align,
    slidesPerView: perView,
    effect,
    loop,
    index: current,
    count,
    canPrev: loop ? count > 1 : current > 0,
    canNext: loop ? count > 1 : current < maxIndex,
    scrollTo,
    next: () => scrollTo(current + 1),
    prev: () => scrollTo(current - 1),
    isVisible,
    autoplay: interval,
    playing,
    setPlaying,
    autoplayProgress,
    offset,
    slideSize,
    setSize,
    size,
    countStore,
    onDragEnd,
  }

  return (
    <CarouselContext value={value}>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        onKeyDown={onKeyDown}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
        }}
        className={cn("relative flex min-w-0 flex-col gap-3", className)}
      >
        {children}
        <div aria-live={running ? "off" : "polite"} aria-atomic className="sr-only">
          {count > 0 ? `Slide ${current + 1} of ${count}` : ""}
        </div>
      </div>
    </CarouselContext>
  )
}

/** The viewport and draggable track. Wrap each slide in a CarouselItem. */
export function CarouselContent({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const { orientation, countStore, setSize, slidesPerView, offset, size, align, onDragEnd } =
    useCarousel()
  const viewport = useRef<HTMLDivElement>(null)
  const slides = Children.toArray(children)
  const vertical = orientation === "vertical"

  useLayoutEffect(() => {
    countStore.set(slides.length)
  }, [countStore, slides.length])

  useLayoutEffect(() => {
    const element = viewport.current
    if (!element) return
    const measure = () =>
      setSize((vertical ? element.clientHeight : element.clientWidth) / slidesPerView)
    measure()
    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [vertical, slidesPerView, setSize])

  const { bounds } = geometry(slides.length, slidesPerView, align)
  const constraints = vertical
    ? { top: bounds.min * size, bottom: bounds.max * size }
    : { left: bounds.min * size, right: bounds.max * size }

  return (
    // contain-inline-size: the slides' content never sets the carousel's width, so text
    // animating inside a slide can't resize the carousel (or the layout around it).
    <div
      ref={viewport}
      className={cn("w-full overflow-hidden contain-inline-size", vertical && "h-72", className)}
    >
      <motion.div
        className={cn("flex select-none", vertical ? "h-full touch-pan-x flex-col" : "touch-pan-y")}
        style={vertical ? { y: offset } : { x: offset }}
        drag={size > 0 && slides.length > 1 ? (vertical ? "y" : "x") : false}
        dragConstraints={constraints}
        dragElastic={0.12}
        dragMomentum={false}
        onDragEnd={(_, info) => onDragEnd(info)}
      >
        {slides.map((slide, i) => (
          <ItemIndexContext key={i} value={i}>
            {slide}
          </ItemIndexContext>
        ))}
      </motion.div>
    </div>
  )
}

/** One slide. Off-screen slides are inert so keyboard focus never lands on hidden content. */
export function CarouselItem({ className, children }: { className?: string; children: ReactNode }) {
  const { orientation, slidesPerView, count, effect, offset, slideSize, isVisible } = useCarousel()
  const index = use(ItemIndexContext)
  const visible = isVisible(index)

  // Distance (in slides) of this slide's center from the viewport's center.
  const distance = useTransform(() => {
    const s = slideSize.get()
    if (s === 0) return index === 0 ? 0 : 1
    const center = offset.get() / s + index + 0.5
    return Math.min(1, Math.abs(center - slidesPerView / 2))
  })
  const opacity = useTransform(distance, [0, 1], [1, 0.3])
  const scale = useTransform(distance, [0, 1], [1, 0.82])

  return (
    <motion.div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${count}`}
      inert={!visible}
      className={cn(
        "min-w-0 shrink-0 grow-0",
        orientation === "vertical" ? "pb-3" : "pr-3",
        className,
      )}
      style={{
        flexBasis: `${100 / slidesPerView}%`,
        opacity: effect === "fade" ? opacity : undefined,
        scale: effect === "scale" ? scale : undefined,
      }}
    >
      {children}
    </motion.div>
  )
}

/** An arrow that draws itself (Anime.js) when its button is hovered or focused. */
function DrawnArrow({ direction, vertical }: { direction: "prev" | "next"; vertical: boolean }) {
  const rotate = vertical ? (direction === "prev" ? -90 : 90) : direction === "prev" ? 180 : 0
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="size-3.5"
      style={{ transform: `rotate(${rotate}deg)` }}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path data-arrow d="M2 8 H13" />
      <path data-arrow d="M9 4 L13 8 L9 12" />
    </svg>
  )
}

function useArrowDraw() {
  const reduced = usePrefersReducedMotion()
  return (button: HTMLElement) => {
    if (reduced) return
    const paths = button.querySelectorAll("[data-arrow]")
    animeAnimate(createDrawable(paths), {
      draw: ["0 0", "0 1"],
      duration: 380,
      delay: stagger(90),
      ease: "outQuad",
    })
  }
}

type BracketButtonProps = Omit<ComponentProps<typeof motion.button>, "children"> & {
  children: ReactNode
}

/** `[ label ]`: the brackets spread apart on hover (Motion). */
export function BracketButton({ className, children, disabled, ...props }: BracketButtonProps) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      initial="rest"
      animate="rest"
      whileHover={disabled ? undefined : "hover"}
      whileFocus={disabled ? undefined : "hover"}
      whileTap={disabled ? undefined : "tap"}
      className={cn(
        "inline-flex h-8 items-center gap-1 rounded-md px-1.5 font-mono text-xs text-fg-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-35",
        className,
      )}
      {...props}
    >
      <motion.span aria-hidden variants={{ rest: { x: 0 }, hover: { x: -2 }, tap: { x: 0 } }}>
        [
      </motion.span>
      <span className="inline-flex items-center gap-1.5 px-0.5">{children}</span>
      <motion.span aria-hidden variants={{ rest: { x: 0 }, hover: { x: 2 }, tap: { x: 0 } }}>
        ]
      </motion.span>
    </motion.button>
  )
}

function NavButton({ direction, className }: { direction: "prev" | "next"; className?: string }) {
  const { prev, next, canPrev, canNext, orientation } = useCarousel()
  const draw = useArrowDraw()
  const isPrev = direction === "prev"
  const enabled = isPrev ? canPrev : canNext
  return (
    // aria-disabled instead of disabled: a disabled button drops keyboard focus at the
    // last slide, which would stop arrow-key navigation inside the carousel.
    <BracketButton
      aria-label={isPrev ? "Previous slide" : "Next slide"}
      aria-disabled={!enabled || undefined}
      onClick={enabled ? (isPrev ? prev : next) : undefined}
      onPointerEnter={(event) => enabled && draw(event.currentTarget)}
      onFocus={(event) => enabled && draw(event.currentTarget)}
      className={cn("aria-disabled:cursor-default aria-disabled:opacity-35", className)}
    >
      <DrawnArrow direction={direction} vertical={orientation === "vertical"} />
    </BracketButton>
  )
}

export function CarouselPrevious({ className }: { className?: string }) {
  return <NavButton direction="prev" className={className} />
}

export function CarouselNext({ className }: { className?: string }) {
  return <NavButton direction="next" className={className} />
}

/**
 * The current position as text: `long` → "slide 03/05", `short` → "03 / 05".
 * Digits roll with NumberTicker (Anime.js). Hidden from screen readers; the
 * carousel announces the slide itself.
 */
export function CarouselStatus({
  format = "long",
  className,
}: {
  format?: "long" | "short"
  className?: string
}) {
  const { index, count } = useCarousel()
  const digits = Math.max(2, String(count).length)
  return (
    <span
      aria-hidden
      className={cn("inline-flex items-center font-mono text-xs text-fg-muted", className)}
    >
      {format === "long" && <span className="mr-1.5 text-fg-subtle">slide</span>}
      <NumberTicker value={index + 1} minDigits={digits} className="text-fg" duration={500} />
      <span className={cn("text-fg-subtle", format === "short" ? "mx-1.5" : "mx-px")}>/</span>
      <span>{String(count).padStart(digits, "0")}</span>
    </span>
  )
}

/** Segmented progress: one cell per slide (▮▮▮▯▯). With autoplay the current cell fills as a timer. */
export function CarouselProgress({ className }: { className?: string }) {
  const { index, count, autoplay, autoplayProgress } = useCarousel()
  return (
    <div aria-hidden className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: count }, (_, i) => (
        <ProgressCell
          key={i}
          state={i < index ? "done" : i === index ? "current" : "todo"}
          timer={autoplay > 0 && i === index ? autoplayProgress : undefined}
        />
      ))}
    </div>
  )
}

function ProgressCell({
  state,
  timer,
}: {
  state: "done" | "current" | "todo"
  timer?: MotionValue<number>
}) {
  return (
    <span className="relative h-2.5 w-3 overflow-hidden rounded-[2px] bg-line">
      <motion.span
        className="absolute inset-0 origin-left bg-accent"
        initial={false}
        animate={timer ? undefined : { scaleX: state === "todo" ? 0 : 1 }}
        style={timer ? { scaleX: timer } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
      />
    </span>
  )
}

/** Numbered page buttons, `01 02 03`, with a sliding indicator (Motion layoutId). */
export function CarouselPagination({ className }: { className?: string }) {
  const { id, index, scrollTo, align, slidesPerView, count } = useCarousel()
  const pages = geometry(count, slidesPerView, align).maxIndex + 1
  return (
    <div className={cn("flex shrink-0 items-center gap-1 font-mono text-xs", className)}>
      {Array.from({ length: pages }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === index || undefined}
          onClick={() => scrollTo(i)}
          className={cn(
            "relative h-7 w-9 shrink-0 rounded-md text-center tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            i === index ? "text-fg" : "text-fg-subtle hover:text-fg",
          )}
        >
          {i === index && (
            <motion.span
              layoutId={`${id}-page`}
              className="absolute inset-0 rounded-md border border-line-strong bg-surface-raised"
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
            />
          )}
          <span className="relative">{String(i + 1).padStart(2, "0")}</span>
        </button>
      ))}
    </div>
  )
}

/**
 * A strip of thumbnail buttons. `children` renders a thumbnail for a slide index.
 * The active frame slides between thumbnails (Motion layoutId).
 */
export function CarouselThumbs({
  children,
  className,
}: {
  children: (index: number) => ReactNode
  className?: string
}) {
  const { id, index, count, scrollTo } = useCarousel()
  const strip = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const active = strip.current?.querySelector<HTMLElement>('[aria-current="true"]')
    active?.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "smooth" })
  }, [index])

  return (
    <div ref={strip} className={cn("flex gap-2 overflow-x-auto p-1", className)}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === index || undefined}
          onClick={() => scrollTo(i)}
          className={cn(
            "relative shrink-0 rounded-md p-1 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            i === index ? "opacity-100" : "opacity-50 hover:opacity-80",
          )}
        >
          {i === index && (
            <motion.span
              layoutId={`${id}-thumb`}
              className="absolute inset-0 rounded-md border-2 border-accent"
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
            />
          )}
          {children(i)}
        </button>
      ))}
    </div>
  )
}

/** Pauses or resumes autoplay. Required whenever autoplay is on (WCAG 2.2.2). */
export function CarouselPlayToggle({ className }: { className?: string }) {
  const { autoplay, playing, setPlaying } = useCarousel()
  if (autoplay === 0) return null
  return (
    <BracketButton
      aria-label={playing ? "Pause autoplay" : "Start autoplay"}
      onClick={() => setPlaying(!playing)}
      className={className}
    >
      {playing ? "pause" : "play"}
    </BracketButton>
  )
}
