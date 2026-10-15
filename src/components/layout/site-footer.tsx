import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import { siteConfig } from "@/config/site"
import { LogoMark } from "./logo"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <LogoMark className="size-6" />
          <p className="text-sm text-fg-subtle">
            {siteConfig.name}: {siteConfig.tagline}.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-fg-muted">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
            {siteConfig.repositoryUrl && (
              <li>
                <a
                  href={siteConfig.repositoryUrl}
                  className="inline-flex items-center gap-1.5 rounded hover:text-fg"
                  target="_blank"
                  rel="noreferrer"
                >
                  Source code
                  <ExternalLink aria-hidden className="size-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </footer>
  )
}
