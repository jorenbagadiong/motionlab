// Verifies every package in package-lock.json (including transitive ones) was
// published at least MIN_AGE_DAYS ago, to match registry quarantine policies.
// Usage: node scripts/check-dependency-age.mjs [minAgeDays=14]
import fs from "node:fs"

const minAgeDays = Number(process.argv[2] ?? 14)
const cutoff = new Date(Date.now() - minAgeDays * 86_400_000).toISOString()
const lock = JSON.parse(fs.readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"))

const packages = new Map()
for (const [path, info] of Object.entries(lock.packages)) {
  if (!path || !info.version || info.link) continue
  const name = info.name ?? path.slice(path.lastIndexOf("node_modules/") + "node_modules/".length)
  packages.set(`${name}@${info.version}`, { name, version: info.version })
}

/** Publish times for a package; retries network errors so a blip doesn't fail the check. */
async function publishTimes(name, attempts = 3) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`https://registry.npmjs.org/${name.replace("/", "%2F")}`)
      return res.ok ? (await res.json()).time : null
    } catch (error) {
      if (attempt >= attempts)
        throw new Error(`Could not reach the npm registry for ${name}`, { cause: error })
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
    }
  }
}

const list = [...packages.values()]
const metadata = new Map()
let next = 0
async function worker() {
  while (next < list.length) {
    const pkg = list[next++]
    if (!metadata.has(pkg.name)) {
      metadata.set(pkg.name, publishTimes(pkg.name))
    }
    pkg.published = (await metadata.get(pkg.name))?.[pkg.version] ?? "unknown"
  }
}
await Promise.all(Array.from({ length: 16 }, worker))

const tooNew = list
  .filter((pkg) => pkg.published === "unknown" || pkg.published > cutoff)
  .sort((a, b) => b.published.localeCompare(a.published))

console.log(`Checked ${list.length} packages against a ${minAgeDays}-day minimum age.`)
if (tooNew.length > 0) {
  console.error("Too new or unknown publish date:")
  for (const pkg of tooNew) console.error(`  ${pkg.name}@${pkg.version}  ${pkg.published}`)
  process.exit(1)
}
console.log("All packages meet the minimum age.")
