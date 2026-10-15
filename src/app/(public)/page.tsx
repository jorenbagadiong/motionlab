import {
  Accessibility,
  ArrowRight,
  CodeXml,
  Gauge,
  Layers,
  Library,
  SlidersHorizontal,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { HeroDemo } from "@/features/landing/hero-demo"
import { BUILT_IN_PRESETS, getBuiltInPreset } from "@/features/presets/catalog"
import { PresetCard } from "@/features/presets/components/preset-card"

const HERO_PRESETS = ["character-rise", "spring-pop", "staggered-cards"]
  .map(getBuiltInPreset)
  .filter((preset) => preset !== undefined)

const FEATURED = BUILT_IN_PRESETS.filter((preset) => preset.featured)

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  available: boolean
}

const FEATURES: Feature[] = [
  {
    icon: Layers,
    title: "Two engines, one model",
    description:
      "Motion for React and Anime.js presets share a typed, validated configuration model with engine-specific adapters.",
    available: true,
  },
  {
    icon: SlidersHorizontal,
    title: "Tune in real time",
    description:
      "Each preset exposes only the properties that apply to it, with sensible defaults and validated ranges.",
    available: true,
  },
  {
    icon: CodeXml,
    title: "Copy-ready code",
    description:
      "Generate Motion or Anime.js snippets that match the preview exactly, then copy them into your project.",
    available: true,
  },
  {
    icon: Library,
    title: "Your personal library",
    description:
      "Sign in with Google to save, favorite and organize presets into collections. Private by default.",
    available: false,
  },
  {
    icon: Accessibility,
    title: "Accessible by default",
    description:
      "Keyboard-friendly controls, visible focus states and respect for reduced-motion preferences throughout.",
    available: true,
  },
  {
    icon: Gauge,
    title: "Performance-minded",
    description:
      "Transform and opacity animations, code-split engines and cleanup of every animation instance.",
    available: true,
  },
]

const STACK = [
  "Next.js App Router",
  "React 19",
  "TypeScript (strict)",
  "Tailwind CSS v4",
  "Motion for React",
  "Anime.js v4",
  "Zod",
  "Supabase Auth & Postgres",
  "Vitest & Playwright",
  "Vercel",
]

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(ellipse_at_center,var(--color-accent-soft),transparent_65%)]"
        />
        <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col gap-6">
            <Badge tone="accent" className="w-fit">
              Motion for React + Anime.js
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Design motion you can <span className="text-accent">actually ship</span>.
            </h1>
            <p className="max-w-xl text-lg text-pretty text-fg-muted">
              MotionLab is an interactive animation studio. Explore an animation, customize it in
              real time, inspect its implementation and save it for your next project.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/explore" variant="primary" size="lg">
                Explore animations
                <ArrowRight aria-hidden />
              </ButtonLink>
              <ButtonLink href="/playground" size="lg">
                Open the playground
              </ButtonLink>
            </div>
          </div>
          <HeroDemo presets={HERO_PRESETS} />
        </Container>
      </section>

      <section aria-labelledby="featured-heading" className="py-16 sm:py-20">
        <Container className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 id="featured-heading" className="text-2xl font-semibold tracking-tight">
                Featured presets
              </h2>
              <p className="text-fg-muted">Hover a card to preview it.</p>
            </div>
            <ButtonLink href="/explore" variant="ghost">
              View all {BUILT_IN_PRESETS.length} presets
              <ArrowRight aria-hidden />
            </ButtonLink>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED.map((preset) => (
              <li key={preset.slug} className="flex">
                <PresetCard preset={preset} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="features-heading" className="border-t border-line py-16 sm:py-20">
        <Container className="flex flex-col gap-8">
          <h2 id="features-heading" className="text-2xl font-semibold tracking-tight">
            Built like a real engineering tool
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description, available }) => (
              <li
                key={title}
                className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  {!available && <Badge>Coming soon</Badge>}
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-fg-muted">{description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="stack-heading" className="border-t border-line py-16 sm:py-20">
        <Container className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 id="stack-heading" className="text-2xl font-semibold tracking-tight">
              Technology
            </h2>
            <p className="max-w-2xl text-fg-muted">
              Server Components by default, client components only where interaction or animation
              needs them, and authorization enforced in the database with Row Level Security.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {STACK.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-line bg-surface px-3 py-1.5 font-mono text-sm text-fg-muted"
              >
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  )
}
