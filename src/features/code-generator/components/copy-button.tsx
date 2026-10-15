"use client"

import { Check, Copy, X } from "lucide-react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { copyText } from "../copy"

type Status = "idle" | "copied" | "failed"

const LABELS: Record<Status, string> = { idle: "Copy", copied: "Copied", failed: "Copy failed" }

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState<Status>("idle")
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  async function handleCopy() {
    const ok = await copyText(text)
    setStatus(ok ? "copied" : "failed")
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus("idle"), 2000)
  }

  const Icon = status === "copied" ? Check : status === "failed" ? X : Copy
  return (
    <>
      <Button size="sm" variant="ghost" onClick={handleCopy} className="h-7 px-2 text-xs">
        <Icon aria-hidden />
        {LABELS[status]} <span className="sr-only">{label}</span>
      </Button>
      <span aria-live="polite" className="sr-only">
        {status === "copied" ? `${label} copied to clipboard` : ""}
        {status === "failed" ? "Copy failed. Select the code and copy it manually." : ""}
      </span>
    </>
  )
}
