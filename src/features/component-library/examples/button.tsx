"use client"

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
