export const siteConfig = {
  name: "MotionLab",
  tagline: "Interactive motion design studio",
  description:
    "Explore animation presets, tune them in real time, inspect the implementation and save them for your next project.",
  /** Optional: set NEXT_PUBLIC_REPOSITORY_URL to show repository links. */
  repositoryUrl: process.env.NEXT_PUBLIC_REPOSITORY_URL || null,
  nav: [
    { href: "/explore", label: "Explore" },
    { href: "/playground", label: "Playground" },
    { href: "/components", label: "Components" },
  ],
} as const
