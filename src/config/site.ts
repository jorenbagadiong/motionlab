export const siteConfig = {
  name: "MotionLab",
  tagline: "Animated component library",
  description:
    "Accessible, animated React components built with Tailwind CSS, Motion and Anime.js. Tweak each one in a live playground and copy the code.",
  /** Optional: set NEXT_PUBLIC_REPOSITORY_URL to show repository links. */
  repositoryUrl: process.env.NEXT_PUBLIC_REPOSITORY_URL || null,
  nav: [
    { href: "/explore", label: "Explore" },
    { href: "/playground", label: "Playground" },
    { href: "/components", label: "Components" },
  ],
} as const
