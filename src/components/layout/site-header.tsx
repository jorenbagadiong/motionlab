import { Container } from "@/components/ui/container"
import { AccentPicker } from "@/features/theme/accent-picker"
import { ThemeToggle } from "@/features/theme/theme-toggle"
import { Logo } from "./logo"
import { MobileNav } from "./mobile-nav"
import { NavLinks } from "./nav-links"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur">
      <Container className="relative flex h-16 items-center gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden md:block">
          <NavLinks />
        </nav>
        {/* Account controls (sign in, library) are added with Supabase Auth in Phase 4. */}
        <div className="ml-auto flex items-center gap-2">
          <AccentPicker />
          <ThemeToggle />
          <MobileNav />
        </div>
      </Container>
    </header>
  )
}
