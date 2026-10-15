import Link from "next/link"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils/cn"

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-7", className)}>
      <rect width="32" height="32" rx="9" className="fill-accent-strong" />
      <path
        d="M8 21.5c2.6-7.4 5-11 7.2-11 3 0 1.6 11 4.6 11 1.4 0 2.8-2 4.2-6"
        fill="none"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-lg font-semibold tracking-tight text-fg"
    >
      <LogoMark />
      <span>{siteConfig.name}</span>
    </Link>
  )
}
