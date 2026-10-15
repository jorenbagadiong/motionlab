import { TextScramble } from "@/components/ui/text-scramble"

export function TextScrambleExample() {
  return (
    <div className="flex flex-col gap-4 text-lg">
      <p>
        <span className="text-fg-muted">status: </span>
        <TextScramble text="ACCESS GRANTED" className="text-accent" />
      </p>
      <p>
        <span className="text-fg-muted">build with </span>
        <TextScramble mode="type" words={["Motion", "Anime.js", "Tailwind CSS"]} />
      </p>
    </div>
  )
}
