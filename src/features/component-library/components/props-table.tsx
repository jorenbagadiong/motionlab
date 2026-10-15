import type { PropDoc } from "../model"

export function PropsTable({ props }: { props: PropDoc[] }) {
  return (
    // Focusable so keyboard users can scroll it horizontally on small screens.
    <div
      tabIndex={0}
      role="region"
      aria-label="Props"
      className="overflow-x-auto rounded-xl border border-line"
    >
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead className="bg-surface-raised text-xs text-fg-subtle">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-medium">
              Prop
            </th>
            <th scope="col" className="px-4 py-2.5 font-medium">
              Type
            </th>
            <th scope="col" className="px-4 py-2.5 font-medium">
              Default
            </th>
            <th scope="col" className="px-4 py-2.5 font-medium">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {props.map((prop) => (
            <tr key={prop.name} className="align-top">
              <th
                scope="row"
                className="px-4 py-3 font-mono text-[13px] font-medium whitespace-nowrap text-accent"
              >
                {prop.name}
              </th>
              <td className="px-4 py-3 font-mono text-[13px] text-fg-muted">{prop.type}</td>
              <td className="px-4 py-3 font-mono text-[13px] whitespace-nowrap text-fg-muted">
                {prop.default ?? <span aria-label="none">–</span>}
              </td>
              <td className="px-4 py-3 text-fg-muted">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
