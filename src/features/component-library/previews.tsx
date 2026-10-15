"use client"

import { Save } from "lucide-react"
import { type ReactNode, useId, useState } from "react"
import { Alert } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog } from "@/components/ui/dialog"
import { Label, SelectInput, TextInput, Textarea } from "@/components/ui/field"
import { Kbd } from "@/components/ui/kbd"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Tabs } from "@/components/ui/tabs"
import type { ControlValue, ValuesOf } from "./model"
import { COMPONENT_DOCS, type ComponentSlug } from "./registry"

/**
 * Live previews, one per component. Each renders the same markup its code
 * generator in registry.ts prints, so what you see is what you copy.
 */
type Values<K extends ComponentSlug> = ValuesOf<(typeof COMPONENT_DOCS)[K]["controls"]>
type Previews = { [K in ComponentSlug]: (props: { values: Values<K> }) => ReactNode }

const TAB_NAMES = ["Preview", "Code", "Notes", "History"]

function LabelledField({
  label,
  children,
}: {
  label: string
  children: (id: string) => ReactNode
}) {
  const id = useId()
  return (
    <div className="flex w-full max-w-xs flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children(id)}
    </div>
  )
}

function AlertPreview({ values: v }: { values: Values<"alert"> }) {
  const [visible, setVisible] = useState(true)
  if (!visible) {
    return (
      <Button size="sm" onClick={() => setVisible(true)}>
        Show the alert again
      </Button>
    )
  }
  return (
    <Alert
      tone={v.tone}
      role={v.role === "none" ? undefined : v.role}
      title={v.title}
      onDismiss={v.dismissible ? () => setVisible(false) : undefined}
    >
      {v.description || undefined}
    </Alert>
  )
}

function DialogPreview({ values: v }: { values: Values<"dialog"> }) {
  const [open, setOpen] = useState(false)
  const variant = v.destructive ? "danger" : "primary"
  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)}>
        {v.trigger}
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={v.title}
        description={v.description || undefined}
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant={variant} onClick={() => setOpen(false)}>
              {v.confirm}
            </Button>
          </>
        }
      />
    </>
  )
}

const PREVIEWS: Previews = {
  button: ({ values: v }) => (
    <Button variant={v.variant} size={v.size} loading={v.loading} disabled={v.disabled}>
      {v.icon && <Save aria-hidden />}
      {v.label}
    </Button>
  ),
  badge: ({ values: v }) => <Badge tone={v.tone}>{v.label}</Badge>,
  alert: AlertPreview,
  card: ({ values: v }) => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{v.title}</CardTitle>
        {v.description && <CardDescription>{v.description}</CardDescription>}
      </CardHeader>
      {v.content && <CardContent>{v.content}</CardContent>}
      {v.footer && (
        <CardFooter className="justify-end">
          <Button size="sm" variant="ghost">
            Cancel
          </Button>
          <Button size="sm" variant="primary">
            Open
          </Button>
        </CardFooter>
      )}
    </Card>
  ),
  "text-input": ({ values: v }) => (
    <LabelledField label={v.label}>
      {(id) => (
        <TextInput
          id={id}
          type={v.type}
          placeholder={v.placeholder || undefined}
          disabled={v.disabled}
        />
      )}
    </LabelledField>
  ),
  textarea: ({ values: v }) => (
    <LabelledField label={v.label}>
      {(id) => (
        <Textarea
          id={id}
          rows={v.rows}
          placeholder={v.placeholder || undefined}
          disabled={v.disabled}
        />
      )}
    </LabelledField>
  ),
  select: ({ values: v }) => (
    <LabelledField label={v.label}>
      {(id) => (
        <SelectInput id={id} defaultValue="motion" disabled={v.disabled}>
          <option value="motion">Motion</option>
          <option value="anime">Anime.js</option>
        </SelectInput>
      )}
    </LabelledField>
  ),
  // Keyed on defaultChecked so toggling the control re-applies the initial state.
  checkbox: ({ values: v }) => (
    <Checkbox
      key={String(v.defaultChecked)}
      label={v.label}
      description={v.description || undefined}
      defaultChecked={v.defaultChecked}
      disabled={v.disabled}
    />
  ),
  switch: ({ values: v }) => (
    <Switch
      key={String(v.defaultChecked)}
      label={v.label}
      description={v.description || undefined}
      defaultChecked={v.defaultChecked}
      disabled={v.disabled}
    />
  ),
  tabs: ({ values: v }) => (
    <Tabs
      key={v.count}
      label={v.label}
      items={TAB_NAMES.slice(0, v.count).map((name) => ({
        id: name.toLowerCase(),
        label: name,
        content: <p>{name} panel</p>,
      }))}
    />
  ),
  dialog: DialogPreview,
  progress: ({ values: v }) => (
    <Progress label={v.label} value={v.indeterminate ? undefined : v.value} className="max-w-xs" />
  ),
  spinner: ({ values: v }) => <Spinner size={v.size} label={v.label} />,
  skeleton: ({ values: v }) => {
    const lines = (
      <>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </>
    )
    if (v.layout === "text")
      return <div className="flex w-full max-w-xs flex-col gap-2">{lines}</div>
    if (v.layout === "card") {
      return (
        <div className="flex w-full max-w-xs flex-col gap-3">
          <Skeleton className="h-32 w-full rounded-xl" />
          {lines}
        </div>
      )
    }
    return (
      <div className="flex w-full max-w-xs items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">{lines}</div>
      </div>
    )
  },
  kbd: ({ values: v }) => (
    <span className="inline-flex gap-1">
      {v.keys
        .split(/\s+/)
        .filter(Boolean)
        .map((key, index) => (
          <Kbd key={index}>{key}</Kbd>
        ))}
    </span>
  ),
  separator: ({ values: v }) =>
    v.orientation === "vertical" ? (
      <div className="flex items-center gap-3 text-sm">
        <span>Left</span>
        <Separator orientation="vertical" decorative={v.decorative} className="h-5" />
        <span>Right</span>
      </div>
    ) : (
      <div className="flex w-full max-w-xs flex-col gap-3 text-sm">
        <span>Above</span>
        <Separator decorative={v.decorative} />
        <span>Below</span>
      </div>
    ),
}

export const PREVIEW_SLUGS = Object.keys(PREVIEWS)

/** Renders a component's preview for the given control values. */
export function ComponentPreview({
  slug,
  values,
}: {
  slug: ComponentSlug
  values: Record<string, ControlValue>
}) {
  const Preview = PREVIEWS[slug] as (props: { values: Record<string, ControlValue> }) => ReactNode
  return <Preview values={values} />
}
