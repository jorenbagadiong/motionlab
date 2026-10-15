import { expect, test } from "@playwright/test"
import { BUILT_IN_PRESETS } from "../../src/features/presets/catalog"
import { gotoHydrated } from "./helpers"

test.describe("how to use panel", () => {
  test("generated code follows the playground controls", async ({ page }) => {
    await gotoHydrated(page, "/playground/fade-up")
    const code = page.getByLabel("fade-up.tsx code")
    await expect(code).toContainText("duration: 0.6")

    const slider = page.getByRole("slider", { name: /^Duration/ })
    await slider.focus()
    await page.keyboard.press("End")
    await expect(code).toContainText("duration: 3")

    await page.getByRole("combobox", { name: "Repeat" }).selectOption("alternate")
    await expect(code).toContainText('repeatType: "reverse"')

    await page.getByRole("button", { name: "Reset" }).click()
    await expect(code).toContainText("duration: 0.6")
    await expect(code).not.toContainText("repeat")
  })

  test("copy puts the code on the clipboard", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"])
    await gotoHydrated(page, "/playground/spring-pop")
    await page.getByRole("button", { name: "Copy spring-pop.tsx" }).click()
    await expect(page.getByRole("button", { name: "Copied spring-pop.tsx" })).toBeVisible()
    const clipboard = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboard).toContain("export function SpringPop(")
    expect(clipboard).toContain('type: "spring"')
  })

  test("every preset page explains how to use it", async ({ page }) => {
    for (const preset of BUILT_IN_PRESETS) {
      await page.goto(`/presets/${preset.slug}`)
      await expect(page.getByRole("heading", { name: "How to use" })).toBeVisible()
      const pkg = preset.config.engine === "motion" ? "motion" : "animejs"
      await expect(page.getByLabel("Terminal code")).toHaveText(new RegExp(`npm install ${pkg}@`))
    }
  })
})
