import { expect, test } from "@playwright/test"
import { gotoHydrated } from "./helpers"

test("landing page links to the gallery and playground", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Design motion")
  await page.getByRole("link", { name: "Explore animations" }).click()
  await expect(page).toHaveURL(/\/explore$/)

  await page.goto("/")
  await page.getByRole("link", { name: "Open the playground" }).click()
  await expect(page).toHaveURL(/\/playground\/fade-up$/)
})

test("landing demo switches presets", async ({ page }) => {
  await gotoHydrated(page, "/")
  const panel = page.getByRole("region", { name: "Live demo" })
  const demo = panel.getByRole("group", { name: "Demo preset" })
  await demo.getByRole("button", { name: "Spring Pop" }).click()
  await expect(demo.getByRole("button", { name: "Spring Pop" })).toHaveAttribute(
    "aria-pressed",
    "true",
  )
  await expect(panel.getByRole("link", { name: "Customize Spring Pop" })).toBeVisible()
})

test("playground switches presets and marks the active one", async ({ page }) => {
  await gotoHydrated(page, "/playground")
  await expect(page).toHaveURL(/\/playground\/fade-up$/)
  const presets = page.getByRole("navigation", { name: "Presets" })
  await presets.getByRole("link", { name: "Spring Pop" }).click()
  await expect(page).toHaveURL(/\/playground\/spring-pop$/)
  await expect(presets.getByRole("link", { name: "Spring Pop" })).toHaveAttribute(
    "aria-current",
    "page",
  )
  await expect(page.getByRole("heading", { level: 1, name: "Spring Pop" })).toBeVisible()
})

test("unknown presets render the not-found page", async ({ page }) => {
  const response = await page.goto("/presets/does-not-exist")
  expect(response?.status()).toBe(404)
  await expect(page.getByRole("heading", { name: "This page drifted away" })).toBeVisible()
})

test("skip link moves focus to the main content", async ({ page }) => {
  await page.goto("/explore")
  await page.keyboard.press("Tab")
  const skip = page.getByRole("link", { name: "Skip to content" })
  await expect(skip).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/#main$/)
})

test("mobile menu opens, navigates and closes", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile navigation only")
  await gotoHydrated(page, "/")
  await page.getByRole("button", { name: "Open menu" }).click()
  const menu = page.getByRole("navigation", { name: "Mobile" })
  await menu.getByRole("link", { name: "Explore" }).click()
  await expect(page).toHaveURL(/\/explore$/)
  await expect(menu).toBeHidden()
})

test("pages have no horizontal overflow", async ({ page }) => {
  for (const path of ["/", "/explore", "/presets/fade-up", "/playground/fade-up"]) {
    await page.goto(path)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, `horizontal overflow on ${path}`).toBeLessThanOrEqual(0)
  }
})
