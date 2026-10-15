import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">This page drifted away</h1>
      <p className="max-w-md text-fg-muted">
        The page or preset you were looking for doesn’t exist. It may have been renamed or removed.
      </p>
      <ButtonLink href="/explore" variant="primary">
        Explore presets
      </ButtonLink>
    </Container>
  )
}
