interface FieldHeaderProps {
  htmlFor: string
  label: string
  name: string
  modified: boolean
}

export function FieldHeader({ htmlFor, label, name, modified }: FieldHeaderProps) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-fg">
        {label}
        {modified && (
          // The space is its own text node: a leading space inside the visually
          // hidden span would be dropped from the accessible name.
          <>
            {" "}
            <span aria-hidden className="ml-0.5 inline-block size-1.5 rounded-full bg-accent" />
            <span className="sr-only">(modified)</span>
          </>
        )}
      </label>
      <code className="font-mono text-xs text-fg-subtle">{name}</code>
    </div>
  )
}
