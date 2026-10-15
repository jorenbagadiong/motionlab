"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { NumberTicker } from "@/components/ui/number-ticker"

export function NumberTickerExample() {
  const [downloads, setDownloads] = useState(12840)

  return (
    <div className="flex flex-col gap-4">
      <dl className="grid grid-cols-3 gap-4 font-mono">
        <div>
          <dt className="text-xs text-fg-subtle">downloads</dt>
          <dd className="text-2xl text-fg">
            <NumberTicker value={downloads} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-fg-subtle">bundle</dt>
          <dd className="text-2xl text-fg">
            <NumberTicker value={4.2} decimals={1} suffix=" kB" />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-fg-subtle">price</dt>
          <dd className="text-2xl text-fg">
            <NumberTicker value={19} decimals={2} prefix="$" />
          </dd>
        </div>
      </dl>
      <Button size="sm" className="self-start" onClick={() => setDownloads((n) => n + 137)}>
        Add downloads
      </Button>
    </div>
  )
}
