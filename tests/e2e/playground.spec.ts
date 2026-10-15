import { expect, test } from "@playwright/test"
import { ANIMATED_SELECTOR, gotoHydrated, isEngineDriven, trackErrors } from "./helpers"

test.describe("playground editor", () => {
  test("slider supports keyboard stepping and restarts the preview", async ({ page }) => {
    const errors = trackErrors(page)
    await gotoHydrated(page, "/playground/fade-up")
    const slider = page.getByRole("slider", { name: /^Duration/ })
    await expect(slider).toHaveAttribute("aria-valuetext", "600 ms")

    await slider.focus()
    await page.keyboard.press("ArrowRight")
    await expect(slider).toHaveAttribute("aria-valuetext", "650 ms")
    await expect(page.getByText("Modified", { exact: true })).toBeVisible()
    await expect.poll(() => isEngineDriven(page.locator(ANIMATED_SELECTOR).first())).toBe(true)
    expect(errors).toEqual([])
  })

  test("typed values apply on Enter, invalid ones are rejected", async ({ page }) => {
    await gotoHydrated(page, "/playground/spring-pop")
    const stiffness = page.getByRole("spinbutton", { name: "Stiffness value" })
    await stiffness.fill("5000")
    // Next.js renders its own role="alert" route announcer, so match the message text.
    const error = page.getByRole("alert").filter({ hasText: "Enter a value between 20 and 1000" })
    await expect(error).toBeVisible()
    await expect(stiffness).toHaveAttribute("aria-invalid", "true")
    await stiffness.press("Escape")
    await expect(stiffness).toHaveValue("300")

    await stiffness.fill("650")
    await stiffness.press("Enter")
    await expect(page.getByRole("slider", { name: /^Stiffness/ })).toHaveValue("650")
  })

  test("reset restores defaults", async ({ page }) => {
    await gotoHydrated(page, "/playground/staggered-cards")
    const reset = page.getByRole("button", { name: "Reset" })
    await expect(reset).toBeDisabled()
    await page.getByRole("combobox", { name: "Direction" }).selectOption("left")
    const cards = page.getByRole("slider", { name: /^Cards/ })
    await cards.focus()
    await page.keyboard.press("End")
    await expect(cards).toHaveValue("6")
    await expect(page.locator("[data-anim-item]")).toHaveCount(6)

    await reset.click()
    await expect(cards).toHaveValue("4")
    await expect(page.getByRole("combobox", { name: "Direction" })).toHaveValue("up")
    await expect(page.locator("[data-anim-item]")).toHaveCount(4)
    await expect(reset).toBeDisabled()
  })

  test("switching presets discards edits", async ({ page }) => {
    await gotoHydrated(page, "/playground/fade-up")
    await page.getByRole("slider", { name: /^Distance/ }).focus()
    await page.keyboard.press("End")
    await page
      .getByRole("navigation", { name: "Presets" })
      .getByRole("link", { name: "Slide In" })
      .click()
    await expect(page).toHaveURL(/slide-in-left$/)
    await expect(page.getByRole("slider", { name: /^Distance/ })).toHaveValue("80")
    await expect(page.getByText("Modified", { exact: true })).toBeHidden()
  })
})
