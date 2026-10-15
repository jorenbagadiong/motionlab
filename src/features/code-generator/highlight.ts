/**
 * Minimal JS/TSX tokenizer for syntax highlighting generated snippets. It only
 * classifies text; rendering is done with React text nodes, so nothing is
 * ever injected as HTML. Concatenating token texts always reproduces the input.
 */

export type TokenType =
  "comment" | "string" | "number" | "keyword" | "tag" | "function" | "property" | "plain"

export interface Token {
  type: TokenType
  text: string
}

const KEYWORDS =
  "import|from|export|function|return|const|let|type|if|else|true|false|null|new|default|typeof|Infinity|await|async"

const RULES: [TokenType, RegExp][] = [
  ["comment", /\/\/[^\n]*|\/\*[\s\S]*?\*\//y],
  ["string", /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`/y],
  ["tag", /(?<=<\/?)[A-Za-z][\w.]*/y],
  ["keyword", new RegExp(`\\b(?:${KEYWORDS})\\b`, "y")],
  ["number", /\b\d+(?:\.\d+)?\b/y],
  ["function", /[A-Za-z_$][\w$]*(?=\()/y],
  ["property", /[A-Za-z_$][\w$]*(?=\s*:(?!:))/y],
  ["plain", /[A-Za-z_$][\w$]*|\s+|[^\sA-Za-z_$\d"'`/]+|./y],
]

export function tokenize(source: string): Token[] {
  const tokens: Token[] = []
  let index = 0
  while (index < source.length) {
    for (const [type, pattern] of RULES) {
      pattern.lastIndex = index
      const match = pattern.exec(source)
      if (!match || match[0].length === 0) continue
      const previous = tokens.at(-1)
      if (type === "plain" && previous?.type === "plain") previous.text += match[0]
      else tokens.push({ type, text: match[0] })
      index += match[0].length
      break
    }
  }
  return tokens
}
