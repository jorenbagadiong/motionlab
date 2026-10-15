import { type NextRequest, NextResponse } from "next/server"
import { getComponentDoc } from "@/features/component-library/registry"
import { getBuiltInPreset } from "@/features/presets/catalog"

/**
 * Preset and component routes prerender a static shell, so an unknown slug
 * would otherwise stream a not-found page with a 200 status. Checking the slug
 * before rendering lets those requests return a real 404.
 */
export function proxy(request: NextRequest) {
  const [, section, slug] = request.nextUrl.pathname.split("/")
  const exists = section === "components" ? getComponentDoc : getBuiltInPreset
  if (slug && !exists(slug)) {
    return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/presets/:slug", "/playground/:slug", "/components/:slug"],
}
