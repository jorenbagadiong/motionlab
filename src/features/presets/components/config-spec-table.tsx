import {
  type AnimationConfig,
  familyFields,
  type FieldSpec,
  formatFieldRange,
  formatFieldValue,
} from "@/features/animations/model"

function formatCompactRange(field: FieldSpec): string {
  if (field.kind === "select") return `${field.options.length} options`
  return formatFieldRange(field)
}

interface ConfigSpecTableProps {
  config: AnimationConfig
  /** `table` for wide layouts; `list` stacks each property for narrow side panels. */
  layout?: "table" | "list"
}

/** Lists every property a preset supports, with its value and valid range. */
export function ConfigSpecTable({ config, layout = "table" }: ConfigSpecTableProps) {
  const fields = Object.entries(familyFields(config.family))
  const values = config as unknown as Record<string, unknown>

  if (layout === "list") {
    return (
      <dl className="divide-y divide-line rounded-xl border border-line bg-surface">
        {fields.map(([key, field]) => (
          <div key={key} className="flex flex-col gap-0.5 px-3 py-2.5">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-sm font-medium text-fg">{field.label}</dt>
              <dd className="font-mono text-sm text-fg-muted">
                {formatFieldValue(field, values[key])}
              </dd>
            </div>
            <dd className="text-xs text-fg-subtle">
              <code className="font-mono">{key}</code>
              <span aria-hidden> · </span>
              {formatCompactRange(field)}
            </dd>
          </div>
        ))}
      </dl>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Supported properties</caption>
        <thead className="bg-surface-raised text-xs tracking-wide text-fg-subtle uppercase">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-medium">
              Property
            </th>
            <th scope="col" className="px-4 py-2.5 font-medium">
              Value
            </th>
            <th scope="col" className="px-4 py-2.5 font-medium">
              Allowed
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {fields.map(([key, field]) => (
            <tr key={key} className="bg-surface">
              <th scope="row" className="px-4 py-2.5 font-medium text-fg">
                {field.label}
                <code className="ml-2 font-mono text-xs font-normal text-fg-subtle">{key}</code>
              </th>
              <td className="px-4 py-2.5 font-mono text-fg-muted">
                {formatFieldValue(field, values[key])}
              </td>
              <td className="px-4 py-2.5 text-fg-subtle">{formatFieldRange(field)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
