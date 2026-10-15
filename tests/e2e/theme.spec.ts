import { expect, type Page, test } from "@playwright/test"
import { gotoHydrated } from "./helpers"

const background = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor)

/** Rough brightness of an rgb()/oklch() computed color, via a canvas pixel. */
const brightness = (page: Page) =>
  page.evaluate(() => {
    const ctx = document.createElement("canvas").getContext("2d")!
    ctx.fillStyle = getComputedStyle(document.documentElement).backgroundColor
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    return (r! + g! + b!) / 3
  })

/** Clicks the visible option, as a user would (the radio input itself is visually hidden). */
const choose = (page: Page, name: "System" | "Light" | "Dark") =>
  page.locator("label", { has: page.getByRole("radio", { name }) }).click()

test.describe("theme", () => {
  test.use({ colorScheme: "dark" })

  test("switches between light and dark", async ({ page }) => {
    await gotoHydrated(page, "/")
    expect(await brightness(page)).toBeLessThan(50)

    await choose(page, "Light")
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light")
    expect(await brightness(page)).toBeGreaterThan(200)

    await choose(page, "Dark")
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
    expect(await brightness(page)).toBeLessThan(50)
  })

  test("remembers the choice without a flash on reload", async ({ page }) => {
    await gotoHydrated(page, "/explore")
    await choose(page, "Light")

    // Check right after the HTML is parsed, before React has loaded.
    await page.reload({ waitUntil: "domcontentloaded" })
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe("light")
    expect(await brightness(page)).toBeGreaterThan(200)
    await expect(page.getByRole("radio", { name: "Light" })).toBeChecked()
  })

  test("system follows the device preference", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" })
    await gotoHydrated(page, "/")
    await expect(page.getByRole("radio", { name: "System" })).toBeChecked()
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBeUndefined()
    expect(await brightness(page)).toBeGreaterThan(200)

    await page.emulateMedia({ colorScheme: "dark" })
    await expect.poll(() => brightness(page)).toBeLessThan(50)
    expect(await background(page)).not.toBe("")
  })
})

/** The accent fill as the browser resolves it, through Tailwind and the theme variables. */
const accentFill = (page: Page) =>
  page.evaluate(() => {
    const probe = document.createElement("div")
    probe.className = "bg-accent-strong"
    document.body.append(probe)
    const color = getComputedStyle(probe).backgroundColor
    probe.remove()
    return color
  })

const chooseAccent = async (page: Page, name: string) => {
  const toggle = page.getByRole("button", { name: "Color theme" })
  if ((await toggle.getAttribute("aria-expanded")) !== "true") await toggle.click()
  await page.locator("label", { has: page.getByRole("radio", { name }) }).click()
}

test.describe("color themes", () => {
  test("switches the accent and keeps it on reload, in both modes", async ({ page }) => {
    await gotoHydrated(page, "/explore")
    const violet = await accentFill(page)

    await chooseAccent(page, "Emerald")
    await expect(page.locator("html")).toHaveAttribute("data-accent", "emerald")
    const emerald = await accentFill(page)
    expect(emerald).not.toBe(violet)

    // Soft tints are mixed from the accent, so they must resolve too.
    const soft = await page.evaluate(
      () =>
        getComputedStyle(document.documentElement).getPropertyValue("--accent-soft").trim() !== "",
    )
    expect(soft).toBe(true)

    await page.keyboard.press("Escape")
    await choose(page, "Light")
    expect(await accentFill(page)).toBe(emerald)

    await page.reload({ waitUntil: "domcontentloaded" })
    const attrs = await page.evaluate(() => ({ ...document.documentElement.dataset }))
    expect(attrs).toMatchObject({ theme: "light", accent: "emerald" })

    await page.waitForLoadState("networkidle")
    await chooseAccent(page, "Violet")
    await expect(page.locator("html")).not.toHaveAttribute("data-accent")
    expect(await accentFill(page)).toBe(violet)
  })
})
