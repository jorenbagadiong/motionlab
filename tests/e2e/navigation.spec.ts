import { expect, test } from "@playwright/test"
import { gotoHydrated } from "./helpers"

test("landing page links to the component library", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Animated components")
  await page.getByRole("link", { name: "Browse components" }).click()
  await expect(page).toHaveURL(/\/components$/)

  await page.goto("/")
  await page.getByRole("link", { name: "See the carousel" }).click()
  await expect(page).toHaveURL(/\/components\/carousel$/)
})

test("landing showcase moves between components", async ({ page }) => {
  await gotoHydrated(page, "/")
  const showcase = page.getByRole("region", { name: "Component showcase" })
  // No autoplay: the first slide stays put until the visitor moves it.
  await expect(showcase.getByRole("button", { name: /autoplay/ })).toHaveCount(0)
  await showcase.getByRole("button", { name: "Next slide" }).click()
  await expect(showcase.getByRole("group", { name: "2 of 4" })).not.toHaveAttribute("inert")
  await expect(showcase.getByRole("link", { name: "> Text Reveal" })).toBeVisible()
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
