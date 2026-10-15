"use client"

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
