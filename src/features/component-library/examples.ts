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
]

export function getExample(id: string): ExampleSnippet | undefined {
  return EXAMPLE_SNIPPETS.find((example) => example.id === id)
}
