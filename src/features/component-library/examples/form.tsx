"use client"

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
        <Label htmlFor={`${id}-name`}>Name</Label>
        <TextInput id={`${id}-name`} placeholder="My fade" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-notes`}>Notes</Label>
        <Textarea id={`${id}-notes`} rows={3} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-engine`}>Engine</Label>
        <SelectInput id={`${id}-engine`} defaultValue="motion">
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
