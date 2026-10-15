/**
 * Composed examples shown under a component's playground. Each `code` is the
 * exact contents of examples/<id>.tsx (the file the page renders live), so the
 * code is type-checked with the app; tests/unit/component-library/examples.test.tsx
 * fails if the two drift.
 */
export interface ExampleSnippet {
  /** Also the file name: examples/<id>.tsx. */
  id: string
  title: string
  description: string
  code: string
}

export const EXAMPLE_SNIPPETS: ExampleSnippet[] = [
  {
    id: "button",
    title: "All variants",
    description:
      "Every variant side by side, with an icon, a loading state and a link styled as a button.",
    code: `"use client"

import { Save, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button, ButtonLink } from "@/components/ui/button"

export function ButtonExample() {
  const [saving, setSaving] = useState(false)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary" loading={saving} onClick={() => setSaving(true)}>
        <Save aria-hidden /> {saving ? "Saving…" : "Save"}
      </Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="outline">Preview</Button>
      <Button variant="ghost">Skip</Button>
      <Button variant="danger">
        <Trash2 aria-hidden /> Delete
      </Button>
      <ButtonLink href="/explore" variant="ghost" size="sm">
        Browse presets
      </ButtonLink>
    </div>
  )
}
`,
  },
  {
    id: "badge",
    title: "Status badges",
    description: "One badge per tone.",
    code: `import { Badge } from "@/components/ui/badge"

export function BadgeExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Draft</Badge>
      <Badge tone="accent">New</Badge>
      <Badge tone="success">Published</Badge>
      <Badge tone="warning">Pending review</Badge>
      <Badge tone="danger">Failed</Badge>
    </div>
  )
}
`,
  },
  {
    id: "alert",
    title: "Alerts in context",
    description: "All four tones; the danger alert is announced and can be dismissed.",
    code: `"use client"

import { useState } from "react"
import { Alert } from "@/components/ui/alert"

export function AlertExample() {
  const [visible, setVisible] = useState(true)

  return (
    <div className="flex flex-col gap-3">
      <Alert title="Heads up">Playground changes are lost when you leave the page.</Alert>
      <Alert tone="success" title="Preset saved" />
      <Alert tone="warning" title="Reduced motion is on">
        Previews wait for you to press Play.
      </Alert>
      {visible && (
        <Alert tone="danger" role="alert" title="Couldn't save" onDismiss={() => setVisible(false)}>
          Check your connection and try again.
        </Alert>
      )}
    </div>
  )
}
`,
  },
  {
    id: "card",
    title: "Preset card",
    description: "Header, content and an actions footer.",
    code: `import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardExample() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Spring Pop</CardTitle>
        <CardDescription>A bouncy scale-in for buttons and badges.</CardDescription>
      </CardHeader>
      <CardContent>Stiffness 320 · Damping 18 · Mass 1</CardContent>
      <CardFooter className="justify-end">
        <Button size="sm" variant="ghost">
          Duplicate
        </Button>
        <Button size="sm" variant="primary">
          Open
        </Button>
      </CardFooter>
    </Card>
  )
}
`,
  },
  {
    id: "form",
    title: "A complete form",
    description: "Text input, textarea, select, checkbox and switch together.",
    code: `"use client"

import { useId, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label, SelectInput, TextInput, Textarea } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

export function FormExample() {
  const id = useId()
  const [loop, setLoop] = useState(false)

  return (
    <form className="flex max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={\`\${id}-name\`}>Name</Label>
        <TextInput id={\`\${id}-name\`} placeholder="My fade" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={\`\${id}-notes\`}>Notes</Label>
        <Textarea id={\`\${id}-notes\`} rows={3} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={\`\${id}-engine\`}>Engine</Label>
        <SelectInput id={\`\${id}-engine\`} defaultValue="motion">
          <option value="motion">Motion</option>
          <option value="anime">Anime.js</option>
        </SelectInput>
      </div>
      <Checkbox label="Add to favorites" defaultChecked />
      <Switch
        label="Loop"
        description="Repeat the animation forever."
        checked={loop}
        onChange={(event) => setLoop(event.target.checked)}
      />
    </form>
  )
}
`,
  },
  {
    id: "tabs",
    title: "Basic tabs",
    description: "Three tabs with simple panels.",
    code: `import { Tabs } from "@/components/ui/tabs"

export function TabsExample() {
  return (
    <Tabs
      label="Preset details"
      items={[
        { id: "preview", label: "Preview", content: <p>The live animation.</p> },
        { id: "code", label: "Code", content: <p>Generated Motion code.</p> },
        { id: "notes", label: "Notes", content: <p>Your notes about this preset.</p> },
      ]}
    />
  )
}
`,
  },
  {
    id: "dialog",
    title: "Confirm a destructive action",
    description: "A danger button that asks before deleting.",
    code: `"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"

export function DialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete preset
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this preset?"
        description="It will be removed from your library. This can't be undone."
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </>
        }
      />
    </>
  )
}
`,
  },
  {
    id: "loading",
    title: "Loading states",
    description: "Determinate and indeterminate progress, a spinner and skeleton lines.",
    code: `import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

export function LoadingExample() {
  return (
    <div className="flex max-w-sm flex-col gap-4">
      <Progress label="Export progress" value={64} />
      <Progress label="Loading presets" />
      <div className="flex items-center gap-3">
        <Spinner label="Loading presets" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  )
}
`,
  },
  {
    id: "misc",
    title: "Shortcut hints",
    description: "Keys separated by a vertical separator.",
    code: `import { Kbd } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"

export function MiscExample() {
  return (
    <div className="flex items-center gap-3 text-sm text-fg-muted">
      <span>
        Apply with <Kbd>Enter</Kbd>
      </span>
      <Separator orientation="vertical" className="h-5" />
      <span>
        Revert with <Kbd>Esc</Kbd>
      </span>
    </div>
  )
}
`,
  },
  {
    id: "text-reveal",
    title: "Headline, terminal and per-letter",
    description:
      "A blurred word-by-word headline, a terminal line typed behind a caret, and a per-letter reveal that waits until it scrolls into view.",
    code: `import { TextReveal } from "@/components/ui/text-reveal"

export function TextRevealExample() {
  return (
    <div className="flex flex-col gap-6">
      <TextReveal
        as="h2"
        text="Ship motion that feels designed."
        effect="blur"
        className="text-3xl font-semibold tracking-tight"
      />
      <TextReveal
        text={"$ npm run build\\n✓ compiled in 1.2s"}
        effect="terminal"
        delay={600}
        className="text-sm text-fg-muted"
      />
      <TextReveal
        text="Every letter on its own beat."
        split="char"
        effect="rotate"
        trigger="inView"
        className="text-xl font-medium"
      />
    </div>
  )
}
`,
  },
  {
    id: "number-ticker",
    title: "Stats",
    description:
      "Digits roll from zero on mount and from the old value when it changes. Press the button to add downloads.",
    code: `"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { NumberTicker } from "@/components/ui/number-ticker"

export function NumberTickerExample() {
  const [downloads, setDownloads] = useState(12840)

  return (
    <div className="flex flex-col gap-4">
      <dl className="grid grid-cols-3 gap-4 font-mono">
        <div>
          <dt className="text-xs text-fg-subtle">downloads</dt>
          <dd className="text-2xl text-fg">
            <NumberTicker value={downloads} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-fg-subtle">bundle</dt>
          <dd className="text-2xl text-fg">
            <NumberTicker value={4.2} decimals={1} suffix=" kB" />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-fg-subtle">price</dt>
          <dd className="text-2xl text-fg">
            <NumberTicker value={19} decimals={2} prefix="$" />
          </dd>
        </div>
      </dl>
      <Button size="sm" className="self-start" onClick={() => setDownloads((n) => n + 137)}>
        Add downloads
      </Button>
    </div>
  )
}
`,
  },
  {
    id: "text-scramble",
    title: "Decode and type",
    description: "A status that decodes from random glyphs, and a typed list of words that cycles.",
    code: `import { TextScramble } from "@/components/ui/text-scramble"

export function TextScrambleExample() {
  return (
    <div className="flex flex-col gap-4 text-lg">
      <p>
        <span className="text-fg-muted">status: </span>
        <TextScramble text="ACCESS GRANTED" className="text-accent" />
      </p>
      <p>
        <span className="text-fg-muted">build with </span>
        <TextScramble mode="type" words={["Motion", "Anime.js", "Tailwind CSS"]} />
      </p>
    </div>
  )
}
`,
  },
  {
    id: "text-highlight",
    title: "Every mark",
    description:
      "Box, squiggle, circle, strike, marker and underline, drawn when the text scrolls into view.",
    code: `import { TextHighlight } from "@/components/ui/text-highlight"

export function TextHighlightExample() {
  return (
    <div className="flex flex-col gap-4 text-lg leading-relaxed">
      <p>
        Motion runs the <TextHighlight variant="box">blocks</TextHighlight>, Anime.js draws the{" "}
        <TextHighlight variant="squiggle" delay={500}>
          details
        </TextHighlight>
        .
      </p>
      <p>
        Ship it <TextHighlight variant="circle">today</TextHighlight>, not{" "}
        <TextHighlight variant="strike" delay={600}>
          next sprint
        </TextHighlight>
        .
      </p>
      <p>
        <TextHighlight variant="marker">Reduced motion</TextHighlight> users see every mark{" "}
        <TextHighlight variant="underline" delay={500}>
          instantly
        </TextHighlight>
        .
      </p>
    </div>
  )
}
`,
  },
  {
    id: "carousel-default",
    title: "Default",
    description: "One slide at a time with bracket arrows. Drag, swipe or use the arrow keys.",
    code: `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const SLIDES = ["fade_up", "spring_pop", "svg_draw", "text_reveal", "orbit_spinner"]

export function CarouselDefaultExample() {
  return (
    <Carousel label="Presets" className="mx-auto w-full max-w-md">
      <CarouselContent>
        {SLIDES.map((name, i) => (
          <CarouselItem key={name}>
            <Slide name={name} index={i} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-between">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  )
}

function Slide({ name, index }: { name: string; index: number }) {
  return (
    <div className="flex aspect-video flex-col justify-between rounded-md border border-line bg-surface bg-dots p-4 font-mono">
      <span className="text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-sm text-fg sm:text-base">
        <span className="text-accent">&gt;</span> {name}.tsx
      </span>
    </div>
  )
}
`,
  },
  {
    id: "carousel-multiple",
    title: "Multiple slides",
    description: "Three slides per view; the track stops at the last full page.",
    code: `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const SLIDES = ["fade_up", "spring_pop", "svg_draw", "text_reveal", "orbit_spinner"]

export function CarouselMultipleExample() {
  return (
    <Carousel label="Presets" slidesPerView={3} className="w-full">
      <CarouselContent>
        {SLIDES.map((name, i) => (
          <CarouselItem key={name}>
            <Slide name={name} index={i} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-end gap-1">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  )
}

function Slide({ name, index }: { name: string; index: number }) {
  return (
    <div className="flex aspect-square flex-col justify-between rounded-md border border-line bg-surface bg-dots p-4 font-mono">
      <span className="text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-sm text-fg sm:text-base">
        <span className="text-accent">&gt;</span> {name}.tsx
      </span>
    </div>
  )
}
`,
  },
  {
    id: "carousel-vertical",
    title: "Vertical",
    description:
      'orientation="vertical": drag up and down, arrows point up and down, Up/Down keys navigate.',
    code: `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const SLIDES = ["fade_up", "spring_pop", "svg_draw", "text_reveal", "orbit_spinner"]

export function CarouselVerticalExample() {
  return (
    <Carousel label="Presets" orientation="vertical" className="mx-auto w-full max-w-sm">
      <div className="flex gap-2">
        <CarouselContent className="h-56 flex-1">
          {SLIDES.map((name, i) => (
            <CarouselItem key={name}>
              <Slide name={name} index={i} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex flex-col justify-center gap-1">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div>
    </Carousel>
  )
}

function Slide({ name, index }: { name: string; index: number }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-md border border-line bg-surface bg-dots p-4 font-mono">
      <span className="text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-sm text-fg sm:text-base">
        <span className="text-accent">&gt;</span> {name}.tsx
      </span>
    </div>
  )
}
`,
  },
  {
    id: "carousel-status",
    title: "Slide status",
    description: "A status rule above the slides: slide 03/05, digits rolling with NumberTicker.",
    code: `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselStatus,
} from "@/components/ui/carousel"

const SLIDES = ["fade_up", "spring_pop", "svg_draw", "text_reveal", "orbit_spinner"]

export function CarouselStatusExample() {
  return (
    <Carousel label="Presets" className="mx-auto w-full max-w-md">
      <div className="flex items-center gap-2 font-mono text-xs text-fg-subtle">
        <span aria-hidden>─[</span>
        <CarouselStatus />
        <span aria-hidden>]</span>
        <span aria-hidden className="h-px flex-1 bg-line" />
        <CarouselPrevious />
        <CarouselNext />
      </div>
      <CarouselContent>
        {SLIDES.map((name, i) => (
          <CarouselItem key={name}>
            <Slide name={name} index={i} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

function Slide({ name, index }: { name: string; index: number }) {
  return (
    <div className="flex aspect-video flex-col justify-between rounded-md border border-line bg-surface bg-dots p-4 font-mono">
      <span className="text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-sm text-fg sm:text-base">
        <span className="text-accent">&gt;</span> {name}.tsx
      </span>
    </div>
  )
}
`,
  },
  {
    id: "carousel-status-2",
    title: "Slide status 2",
    description: "The short 03 / 05 counter between the arrows.",
    code: `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselStatus,
} from "@/components/ui/carousel"

const SLIDES = ["fade_up", "spring_pop", "svg_draw", "text_reveal", "orbit_spinner"]

export function CarouselStatusShortExample() {
  return (
    <Carousel label="Presets" className="mx-auto w-full max-w-md">
      <CarouselContent>
        {SLIDES.map((name, i) => (
          <CarouselItem key={name}>
            <Slide name={name} index={i} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex items-center justify-center gap-3">
        <CarouselPrevious />
        <CarouselStatus format="short" />
        <CarouselNext />
      </div>
    </Carousel>
  )
}

function Slide({ name, index }: { name: string; index: number }) {
  return (
    <div className="flex aspect-video flex-col justify-between rounded-md border border-line bg-surface bg-dots p-4 font-mono">
      <span className="text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-sm text-fg sm:text-base">
        <span className="text-accent">&gt;</span> {name}.tsx
      </span>
    </div>
  )
}
`,
  },
  {
    id: "carousel-pagination",
    title: "Pagination",
    description: "Numbered page buttons with an indicator that slides between them.",
    code: `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPagination,
  CarouselPrevious,
} from "@/components/ui/carousel"

const SLIDES = ["fade_up", "spring_pop", "svg_draw", "text_reveal", "orbit_spinner"]

export function CarouselPaginationExample() {
  return (
    <Carousel label="Presets" className="mx-auto w-full max-w-md">
      <CarouselContent>
        {SLIDES.map((name, i) => (
          <CarouselItem key={name}>
            <Slide name={name} index={i} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex items-center justify-between">
        <CarouselPrevious />
        <CarouselPagination />
        <CarouselNext />
      </div>
    </Carousel>
  )
}

function Slide({ name, index }: { name: string; index: number }) {
  return (
    <div className="flex aspect-video flex-col justify-between rounded-md border border-line bg-surface bg-dots p-4 font-mono">
      <span className="text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-sm text-fg sm:text-base">
        <span className="text-accent">&gt;</span> {name}.tsx
      </span>
    </div>
  )
}
`,
  },
  {
    id: "carousel-footer",
    title: "Footer",
    description:
      "A footer bar with a caption that scrambles to the current slide's name, plus status and arrows.",
    code: `"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselStatus,
  useCarousel,
} from "@/components/ui/carousel"
import { TextScramble } from "@/components/ui/text-scramble"

const SLIDES = ["fade_up", "spring_pop", "svg_draw", "text_reveal", "orbit_spinner"]

export function CarouselFooterExample() {
  return (
    <Carousel label="Presets" className="mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-lg border border-line">
        <CarouselContent className="p-2 pb-0">
          {SLIDES.map((name, i) => (
            <CarouselItem key={name}>
              <Slide name={name} index={i} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <footer className="flex items-center gap-3 border-t border-line bg-surface px-3 py-2">
          <Caption />
          <CarouselStatus format="short" className="ml-auto" />
          <div className="flex">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </footer>
      </div>
    </Carousel>
  )
}

function Slide({ name, index }: { name: string; index: number }) {
  return (
    <div className="flex aspect-video flex-col justify-between rounded-md border border-line bg-surface bg-dots p-4 font-mono">
      <span className="text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-sm text-fg sm:text-base">
        <span className="text-accent">&gt;</span> {name}.tsx
      </span>
    </div>
  )
}

/** Scrambles to the current slide's file name (Anime.js), under the slides. */
function Caption() {
  const { index } = useCarousel()
  return <TextScramble text={SLIDES[index] + ".tsx"} duration={500} className="truncate text-xs" />
}
`,
  },
  {
    id: "carousel-progress",
    title: "Progress",
    description:
      "Autoplay with segmented progress: the current cell fills as the timer. Pauses on hover or focus, with a pause button.",
    code: `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPlayToggle,
  CarouselPrevious,
  CarouselProgress,
} from "@/components/ui/carousel"

const SLIDES = ["fade_up", "spring_pop", "svg_draw", "text_reveal", "orbit_spinner"]

export function CarouselProgressExample() {
  return (
    <Carousel label="Presets" autoplay={3000} loop className="mx-auto w-full max-w-md">
      <CarouselContent>
        {SLIDES.map((name, i) => (
          <CarouselItem key={name}>
            <Slide name={name} index={i} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex items-center gap-2">
        <CarouselProgress />
        <CarouselPlayToggle className="ml-auto" />
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  )
}

function Slide({ name, index }: { name: string; index: number }) {
  return (
    <div className="flex aspect-video flex-col justify-between rounded-md border border-line bg-surface bg-dots p-4 font-mono">
      <span className="text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-sm text-fg sm:text-base">
        <span className="text-accent">&gt;</span> {name}.tsx
      </span>
    </div>
  )
}
`,
  },
  {
    id: "carousel-thumbs",
    title: "Thumbnails",
    description:
      "A strip of thumbnails; the active frame slides to the current one and scrolls into view.",
    code: `import { Carousel, CarouselContent, CarouselItem, CarouselThumbs } from "@/components/ui/carousel"

const SLIDES = ["fade_up", "spring_pop", "svg_draw", "text_reveal", "orbit_spinner"]

export function CarouselThumbsExample() {
  return (
    <Carousel label="Presets" className="mx-auto w-full max-w-md">
      <CarouselContent>
        {SLIDES.map((name, i) => (
          <CarouselItem key={name}>
            <Slide name={name} index={i} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselThumbs>
        {(i) => (
          <span className="flex h-10 w-16 items-center justify-center rounded-sm border border-line bg-surface bg-dots font-mono text-[10px] text-fg-muted">
            {String(i + 1).padStart(2, "0")}
          </span>
        )}
      </CarouselThumbs>
    </Carousel>
  )
}

function Slide({ name, index }: { name: string; index: number }) {
  return (
    <div className="flex aspect-video flex-col justify-between rounded-md border border-line bg-surface bg-dots p-4 font-mono">
      <span className="text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-sm text-fg sm:text-base">
        <span className="text-accent">&gt;</span> {name}.tsx
      </span>
    </div>
  )
}
`,
  },
  {
    id: "carousel-opacity",
    title: "Opacity",
    description:
      "Centered slides that fade with their distance from the center, live while dragging.",
    code: `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const SLIDES = ["fade_up", "spring_pop", "svg_draw", "text_reveal", "orbit_spinner"]

export function CarouselOpacityExample() {
  return (
    <Carousel label="Presets" align="center" slidesPerView={1.6} effect="fade" className="w-full">
      <CarouselContent>
        {SLIDES.map((name, i) => (
          <CarouselItem key={name}>
            <Slide name={name} index={i} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center gap-1">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  )
}

function Slide({ name, index }: { name: string; index: number }) {
  return (
    <div className="flex aspect-video flex-col justify-between rounded-md border border-line bg-surface bg-dots p-4 font-mono">
      <span className="text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-sm text-fg sm:text-base">
        <span className="text-accent">&gt;</span> {name}.tsx
      </span>
    </div>
  )
}
`,
  },
  {
    id: "carousel-scale",
    title: "Scale",
    description:
      "Centered slides that shrink with their distance from the center, live while dragging.",
    code: `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const SLIDES = ["fade_up", "spring_pop", "svg_draw", "text_reveal", "orbit_spinner"]

export function CarouselScaleExample() {
  return (
    <Carousel label="Presets" align="center" slidesPerView={1.6} effect="scale" className="w-full">
      <CarouselContent>
        {SLIDES.map((name, i) => (
          <CarouselItem key={name}>
            <Slide name={name} index={i} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center gap-1">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  )
}

function Slide({ name, index }: { name: string; index: number }) {
  return (
    <div className="flex aspect-video flex-col justify-between rounded-md border border-line bg-surface bg-dots p-4 font-mono">
      <span className="text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-sm text-fg sm:text-base">
        <span className="text-accent">&gt;</span> {name}.tsx
      </span>
    </div>
  )
}
`,
  },
  {
    id: "bouncing-dots",
    title: "Typing and sizes",
    description:
      "A chat typing indicator with its own label, then the three sizes and a five-dot variant.",
    code: `import { BouncingDots } from "@/components/ui/bouncing-dots"

export function BouncingDotsExample() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-fit items-center gap-3 rounded-2xl rounded-bl-sm border border-line bg-surface px-4 py-3">
        <BouncingDots size="sm" label="Ada is typing" />
      </div>
      <div className="flex items-center gap-6">
        <BouncingDots size="sm" />
        <BouncingDots />
        <BouncingDots size="lg" count={5} height={12} />
      </div>
    </div>
  )
}
`,
  },
  {
    id: "orbit-spinner",
    title: "Loading states",
    description:
      "A render-in-progress row with a specific label, then the sizes and a slower counter-clockwise orbit.",
    code: `import { OrbitSpinner } from "@/components/ui/orbit-spinner"

export function OrbitSpinnerExample() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4">
        <OrbitSpinner label="Rendering preview" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">Rendering preview…</span>
          <span className="font-mono text-xs text-fg-subtle">frame 42 / 120</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <OrbitSpinner size="sm" />
        <OrbitSpinner />
        <OrbitSpinner size="lg" direction="counterclockwise" duration={2400} />
      </div>
    </div>
  )
}
`,
  },
  {
    id: "line-draw",
    title: "Icons and a signature",
    description:
      "An illustration, a code icon that draws and retracts forever, and a signature that draws when scrolled into view.",
    code: `import { LineDraw } from "@/components/ui/line-draw"

export function LineDrawExample() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <LineDraw label="Image" viewBox="0 0 120 96" strokeWidth={3} className="h-24 w-32">
        <rect x="6" y="6" width="108" height="84" rx="14" />
        <path d="M22 66 L44 40 L62 56 L76 44 L98 66" />
        <circle cx="86" cy="26" r="8" />
      </LineDraw>
      <LineDraw viewBox="0 0 48 48" repeat="alternate" className="size-16 text-fg">
        <path d="M14 18 L4 24 L14 30" />
        <path d="M34 18 L44 24 L34 30" />
        <path d="M28 10 L20 38" />
      </LineDraw>
      <LineDraw
        label="Signature"
        viewBox="0 0 160 60"
        duration={2400}
        trigger="inView"
        className="h-16 w-44"
      >
        <path d="M8 44 C 20 8, 34 8, 30 40 S 52 52, 60 28 S 74 10, 78 38 C 82 52, 96 20, 104 34 S 128 46, 152 22" />
      </LineDraw>
    </div>
  )
}
`,
  },
  {
    id: "text-reveal-presets",
    title: "Character Rise and Letter Tumble",
    description:
      "The two text presets from the gallery, rebuilt with TextReveal: per-letter rise, and a tilted drop with an elastic settle.",
    code: `import { TextReveal } from "@/components/ui/text-reveal"

export function TextRevealPresetsExample() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs text-fg-subtle">Character Rise</span>
        <TextReveal
          as="h2"
          text="Motion"
          split="char"
          effect="slide"
          duration={800}
          stagger={40}
          className="text-5xl font-semibold tracking-tight"
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs text-fg-subtle">Letter Tumble</span>
        <TextReveal
          as="h2"
          text="Motion"
          split="char"
          effect="rotate"
          duration={1200}
          stagger={60}
          ease="outElastic"
          className="text-5xl font-semibold tracking-tight"
        />
      </div>
    </div>
  )
}
`,
  },
]

export function getExample(id: string): ExampleSnippet | undefined {
  return EXAMPLE_SNIPPETS.find((example) => example.id === id)
}
