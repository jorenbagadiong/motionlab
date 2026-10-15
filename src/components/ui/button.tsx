import { LoaderCircle } from "lucide-react"
import Link from "next/link"
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils/cn"

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger"
type Size = "sm" | "md" | "lg" | "icon-sm" | "icon"

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-colors select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0"

const variants: Record<Variant, string> = {
  primary: "bg-accent-strong text-white shadow-glow hover:bg-accent-hover active:bg-accent-hover",
  secondary:
    "border border-line bg-surface-raised text-fg hover:border-line-strong hover:bg-surface-overlay",
  outline: "border border-accent/50 text-accent hover:bg-accent-soft",
  ghost: "text-fg-muted hover:bg-surface-raised hover:text-fg",
  danger: "bg-danger-strong text-white hover:bg-danger-hover active:bg-danger-hover",
}

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  "icon-sm": "size-8",
  icon: "size-10",
}

export interface ButtonStyleProps {
  variant?: Variant
  size?: Size
}

export function buttonStyles({ variant = "secondary", size = "md" }: ButtonStyleProps = {}) {
  return cn(base, variants[variant], sizes[size])
}

type ButtonProps = ComponentProps<"button"> &
  ButtonStyleProps & {
    /** Shows a spinner and disables the button; screen readers hear it as busy. */
    loading?: boolean
  }

export function Button({
  variant,
  size,
  loading = false,
  disabled,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonStyles({ variant, size }), className)}
      {...props}
    >
      {loading && <LoaderCircle aria-hidden className="animate-spin" />}
      {children}
    </button>
  )
}

type ButtonLinkProps = ComponentProps<typeof Link> & ButtonStyleProps

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonStyles({ variant, size }), className)} {...props} />
}
