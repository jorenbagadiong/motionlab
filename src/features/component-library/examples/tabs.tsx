import { Tabs } from "@/components/ui/tabs"

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
