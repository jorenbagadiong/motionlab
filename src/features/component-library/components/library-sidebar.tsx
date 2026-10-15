"use client"

import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/cn"
import { componentsByCategory } from "../registry"

const GROUPS = componentsByCategory()

function LibraryLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/components"
        onClick={onNavigate}
        aria-current={pathname === "/components" ? "page" : undefined}
        className={cn(
          "rounded-lg px-3 py-1 text-sm font-medium transition-colors",
          pathname === "/components"
            ? "bg-accent-soft text-fg"
            : "text-fg-muted hover:bg-surface-raised hover:text-fg",
        )}
      >
        Overview
      </Link>
      {GROUPS.map(({ category, docs }) => (
        <div key={category} className="flex flex-col gap-1">
          <h2 className="px-3 text-xs font-medium tracking-wide text-fg-subtle uppercase">
            {category}
          </h2>
          <ul className="flex flex-col gap-0.5">
            {docs.map((doc) => {
              const href = `/components/${doc.slug}`
              const active = pathname === href
              return (
                <li key={doc.slug}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-lg px-3 py-1 text-sm transition-colors",
                      active
                        ? "bg-accent-soft font-medium text-fg"
                        : "text-fg-muted hover:bg-surface-raised hover:text-fg",
                    )}
                  >
                    {doc.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

/**
 * Component navigation: a sticky sidebar on desktop and a collapsible
 * "Browse components" panel on small screens.
 */
export function LibrarySidebar() {
  const pathname = usePathname()
  return (
    <nav aria-label="Components">
      <div className="hidden lg:block">
        <LibraryLinks pathname={pathname} />
      </div>
      {/* Keyed by path so the panel closes after navigating. */}
      <details key={pathname} className="group rounded-xl border border-line bg-surface lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
          Browse components
          <ChevronDown
            aria-hidden
            className="size-4 text-fg-subtle transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="border-t border-line p-2">
          <LibraryLinks pathname={pathname} />
        </div>
      </details>
    </nav>
  )
}
