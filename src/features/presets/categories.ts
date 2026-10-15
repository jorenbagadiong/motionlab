export const CATEGORIES = [
  { id: "text", label: "Text reveals" },
  { id: "fade-slide", label: "Fade & slide" },
  { id: "scale-spring", label: "Scale & spring" },
  { id: "stagger", label: "Staggered" },
  { id: "hover", label: "Hover interactions" },
  { id: "loader", label: "Loaders & progress" },
  { id: "svg", label: "SVG" },
  { id: "page", label: "Page transitions" },
] as const

export type CategoryId = (typeof CATEGORIES)[number]["id"]

const LABELS = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label])) as Record<
  CategoryId,
  string
>

export function categoryLabel(id: CategoryId): string {
  return LABELS[id]
}

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === "string" && Object.hasOwn(LABELS, value)
}
