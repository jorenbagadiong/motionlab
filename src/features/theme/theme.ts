/**
 * Appearance preferences.
 *
 * Mode: "system" follows the OS setting (handled purely in CSS); "light" and
 * "dark" are explicit choices applied as data-theme on <html>.
 *
 * Accent: the color theme used for highlights, buttons and focus rings,
 * applied as data-accent on <html>. Its palettes live in src/app/globals.css.
 */
import { createPreference, preferenceInitScript } from "./preference"

export const THEMES = ["system", "light", "dark"] as const
export type Theme = (typeof THEMES)[number]
export const THEME_STORAGE_KEY = "motionlab-theme"

const theme = createPreference<Theme>({
  values: THEMES,
  fallback: "system",
  storageKey: THEME_STORAGE_KEY,
  attribute: "theme",
})

export const readTheme = theme.read
export const applyTheme = theme.apply
export const subscribeToTheme = theme.subscribe

export const ACCENTS = [
  // `swatch` is the solid fill (--accent-strong), shown in the picker.
  { value: "violet", label: "Violet", swatch: "oklch(0.55 0.23 292)" },
  { value: "blue", label: "Blue", swatch: "oklch(0.53 0.19 258)" },
  { value: "emerald", label: "Emerald", swatch: "oklch(0.5 0.11 162)" },
  { value: "rose", label: "Rose", swatch: "oklch(0.55 0.21 12)" },
  { value: "amber", label: "Amber", swatch: "oklch(0.52 0.14 45)" },
] as const
export type Accent = (typeof ACCENTS)[number]["value"]
export const ACCENT_STORAGE_KEY = "motionlab-accent"
export const DEFAULT_ACCENT: Accent = "violet"

const accent = createPreference<Accent>({
  values: ACCENTS.map((a) => a.value),
  fallback: DEFAULT_ACCENT,
  storageKey: ACCENT_STORAGE_KEY,
  attribute: "accent",
})

export const readAccent = accent.read
export const applyAccent = accent.apply
export const subscribeToAccent = accent.subscribe

export const THEME_INIT_SCRIPT = preferenceInitScript([theme, accent])
