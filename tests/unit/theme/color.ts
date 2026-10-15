/**
 * Minimal OKLCH → sRGB math for contrast checks in tests. Out-of-gamut colors
 * are clamped per channel, which is close to what browsers render.
 */

export type Rgba = { r: number; g: number; b: number; a: number }

const OKLCH = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+))?\s*\)$/

export function parseOklch(value: string): Rgba {
  const match = OKLCH.exec(value.trim())
  if (!match) throw new Error(`Not an oklch() color: ${value}`)
  const [l, c, h] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const a = match[4] === undefined ? 1 : Number(match[4])
  const rad = (h * Math.PI) / 180
  const A = c * Math.cos(rad)
  const B = c * Math.sin(rad)

  const l_ = (l + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m_ = (l - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s_ = (l - 0.0894841775 * A - 1.291485548 * B) ** 3

  const linear = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ].map((v) => Math.min(1, Math.max(0, v)))

  const encode = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055)
  const [r, g, b] = linear.map(encode) as [number, number, number]
  return { r, g, b, a }
}

/** Composites `top` over an opaque `bottom` (in sRGB, as browsers do). */
export function over(top: Rgba, bottom: Rgba): Rgba {
  const mix = (t: number, u: number) => t * top.a + u * (1 - top.a)
  return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a: 1 }
}

function luminance({ r, g, b }: Rgba) {
  const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export function contrast(a: Rgba, b: Rgba) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

export const WHITE: Rgba = { r: 1, g: 1, b: 1, a: 1 }
