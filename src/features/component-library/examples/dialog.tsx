"use client"

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
