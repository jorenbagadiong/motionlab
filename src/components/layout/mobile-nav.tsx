"use client"

import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { type KeyboardEvent, useId, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { NavLinks } from "./nav-links"

export function MobileNav() {
  const pathname = usePathname()
  // The menu is open only for the path it was opened on, so any navigation
  // (link, back button) closes it without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  const panelId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)

  const close = () => setOpenOn(null)

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      close()
      toggleRef.current?.focus()
    }
  }

  return (
    <div className="md:hidden" onKeyDown={handleKeyDown}>
      <Button
        ref={toggleRef}
        variant="ghost"
        size="icon"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpenOn(open ? null : pathname)}
      >
        {open ? <X /> : <Menu />}
      </Button>
      <nav
        id={panelId}
        aria-label="Mobile"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-canvas px-4 pt-2 pb-4 shadow-panel"
      >
        <NavLinks orientation="vertical" onNavigate={close} />
      </nav>
    </div>
  )
}
