"use client"

import { type TokenType, tokenize } from "../highlight"
import { CopyButton } from "./copy-button"

const TOKEN_CLASSES: Record<TokenType, string> = {
  comment: "text-fg-subtle italic",
  string: "text-success",
  number: "text-engine-motion",
  keyword: "text-accent",
  tag: "text-engine-anime",
  function: "text-fg",
  property: "text-fg-muted",
  plain: "text-fg/90",
}

interface CodeBlockProps {
  code: string
  /** Shown in the header, e.g. a file name or "Terminal". */
  label: string
}

export function CodeBlock({ code, label }: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-raised px-3 py-1.5">
        <span className="font-mono text-xs text-fg-subtle">{label}</span>
        <CopyButton text={code} label={label} />
      </div>
      {/* Focusable so keyboard users can scroll long lines horizontally. */}
      <pre
        tabIndex={0}
        aria-label={`${label} code`}
        className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed"
      >
        <code>
          {tokenize(code).map((token, index) =>
            token.type === "plain" ? (
              token.text
            ) : (
              <span key={index} className={TOKEN_CLASSES[token.type]}>
                {token.text}
              </span>
            ),
          )}
        </code>
      </pre>
    </div>
  )
}
