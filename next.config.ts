import type { NextConfig } from "next"
import { DEFAULT_PRESET_SLUG } from "./src/features/presets/constants"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

const nextConfig: NextConfig = {
  basePath: "/motionlab",
  cacheComponents: true,
  // Dev only: let other devices on the local network (e.g. http://192.168.x.x:3000)
  // load the dev server's scripts. Without this the page renders but never becomes
  // interactive. Production builds (`next start`, Vercel) are unaffected.
  allowedDevOrigins: ["192.168.*.*"],
  partialPrefetching: true,
  turbopack: {
    // Pin the workspace root so stray lockfiles in parent directories are ignored.
    root: import.meta.dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      // When a base path is set, send the bare root (e.g. motionlab-six.vercel.app/)
      // to /motionlab instead of showing a 404.
      ...(basePath
        ? [{ source: "/", destination: basePath, basePath: false as const, permanent: false }]
        : []),
      {
        source: "/playground",
        destination: `/playground/${DEFAULT_PRESET_SLUG}`,
        permanent: false,
      },
    ]
  },
}

export default nextConfig
