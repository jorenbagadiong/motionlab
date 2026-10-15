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
import { TextHighlight } from "@/components/ui/text-highlight"
import { COMPONENT_LIST } from "@/features/component-library/registry"
import { ComponentShowcase } from "@/features/landing/component-showcase"
import { BUILT_IN_PRESETS } from "@/features/presets/catalog"
import { PresetCard } from "@/features/presets/components/preset-card"

const FEATURED = BUILT_IN_PRESETS.filter((preset) => preset.featured)

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: Layers,
    title: "Two engines, one model",
    description:
      "Motion for React and Anime.js presets share a typed, validated configuration model with engine-specific adapters.",
  },
  {
    icon: SlidersHorizontal,
    title: "Tune in real time",
    description:
      "Each preset exposes only the properties that apply to it, with sensible defaults and validated ranges.",
  },
  {
    icon: CodeXml,
    title: "Copy-ready code",
    description:
      "Generate Motion or Anime.js snippets that match the preview exactly, then copy them into your project.",
  },
  {
    icon: Library,
    title: "Component library",
    description: `${COMPONENT_LIST.length} accessible components, each with a live playground, props reference and copy-ready code.`,
  },
  {
    icon: Accessibility,
    title: "Accessible by default",
    description:
      "Keyboard-friendly controls, visible focus states and respect for reduced-motion preferences throughout.",
  },
  {
    icon: Gauge,
    title: "Performance-minded",
    description:
      "Transform and opacity animations, code-split engines and cleanup of every animation instance.",
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
        <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <Badge tone="accent" className="w-fit">
              Component library · Tailwind CSS + Motion + Anime.js
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Animated components you can{" "}
              <TextHighlight variant="underline" trigger="mount" delay={400}>
                <span className="text-accent">actually ship</span>
              </TextHighlight>
              .
            </h1>
            <p className="max-w-xl text-lg text-pretty text-fg-muted">
              {COMPONENT_LIST.length} accessible React components, from buttons and dialogs to a
              draggable carousel and animated text. Tweak each one in a live playground, copy the
              code and drop it into your project.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/components" variant="primary" size="lg">
                Browse components
                <ArrowRight aria-hidden />
              </ButtonLink>
              <ButtonLink href="/components/carousel" size="lg">
                See the carousel
              </ButtonLink>
            </div>
          </div>
          <ComponentShowcase />
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
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon aria-hidden className="size-5" />
                </span>
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
              needs them. No accounts and no backend: every page is static or prerendered.
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
