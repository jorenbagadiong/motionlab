import { expect, type Page, test } from "@playwright/test"
import { COMPONENT_LIST } from "../../src/features/component-library/registry"
import { gotoHydrated, trackErrors } from "./helpers"

const preview = (page: Page) => page.getByTestId("component-preview")
const props = (page: Page) => page.getByRole("group", { name: "Props" })

test.describe("component library", () => {
  test("overview lists every component and opens one", async ({ page }) => {
    await gotoHydrated(page, "/components")
    await expect(page.getByRole("heading", { level: 1, name: "Components" })).toBeVisible()
    const cards = page.getByRole("article")
    await expect(cards).toHaveCount(COMPONENT_LIST.length)

    await cards.getByRole("link", { name: "Dialog", exact: true }).click()
    await expect(page).toHaveURL(/\/components\/dialog$/)
    await expect(page.getByRole("heading", { level: 1, name: "Dialog" })).toBeVisible()
  })

  test("is reachable from the main navigation", async ({ page, isMobile }) => {
    await gotoHydrated(page, "/")
    if (isMobile) await page.getByRole("button", { name: "Open menu" }).click()
    const nav = page.getByRole("navigation", { name: isMobile ? "Mobile" : "Main" })
    await nav.getByRole("link", { name: "Components" }).click()
    await expect(page).toHaveURL(/\/components$/)
  })

  test("sidebar navigates between components", async ({ page, isMobile }) => {
    await gotoHydrated(page, "/components/button")
    const sidebar = page.getByRole("navigation", { name: "Components" })
    if (isMobile) await sidebar.getByText("Browse components").click()
    await sidebar.getByRole("link", { name: "Switch" }).click()
    await expect(page).toHaveURL(/\/components\/switch$/)
    // On mobile the panel closes after navigating; reopen it to check the current page.
    if (isMobile) await sidebar.getByText("Browse components").click()
    await expect(sidebar.getByRole("link", { name: "Switch" })).toHaveAttribute(
      "aria-current",
      "page",
    )
  })

  test("unknown components return a real 404", async ({ page }) => {
    const response = await page.goto("/components/not-a-component")
    expect(response?.status()).toBe(404)
  })

  test("every component page renders without errors", async ({ page }) => {
    test.setTimeout(90_000)
    const errors = trackErrors(page)
    for (const doc of COMPONENT_LIST) {
      await gotoHydrated(page, `/components/${doc.slug}`)
      await expect(page.getByRole("heading", { level: 1, name: doc.name })).toBeVisible()
      await expect(preview(page).locator("> *")).not.toHaveCount(0)
    }
    expect(errors).toEqual([])
  })
})

test.describe("component playground", () => {
  test("props update the preview and the code", async ({ page }) => {
    await gotoHydrated(page, "/components/button")
    const code = page.getByLabel("ButtonDemo.tsx code")
    await expect(code).toContainText('<Button variant="primary">Save</Button>')

    await props(page).locator("label", { hasText: /^lg$/ }).click()
    await props(page)
      .getByRole("combobox", { name: /Variant/ })
      .selectOption("danger")
    const label = props(page).getByRole("textbox", { name: /Label/ })
    await label.fill("Remove")

    await expect(preview(page).getByRole("button", { name: "Remove" })).toBeVisible()
    await expect(code).toContainText('<Button variant="danger" size="lg">Remove</Button>')

    await page.getByRole("button", { name: "Reset" }).click()
    await expect(code).toContainText('<Button variant="primary">Save</Button>')
  })

  test("dialog opens from the playground, traps focus and closes on Escape", async ({ page }) => {
    await gotoHydrated(page, "/components/dialog")
    const trigger = preview(page).getByRole("button", { name: "Delete preset" })
    await trigger.click()
    const dialog = page.getByRole("dialog", { name: "Delete this preset?" })
    await expect(dialog).toBeVisible()

    for (let i = 0; i < 5; i++) await page.keyboard.press("Tab")
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true)

    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()

    await trigger.click()
    await expect(dialog).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(dialog).toBeHidden()
  })

  test("examples switch between preview and code", async ({ page }) => {
    await gotoHydrated(page, "/components/badge")
    const tabs = page.getByRole("tablist", { name: "Status badges example" })
    await tabs.getByRole("tab", { name: "Code" }).click()
    await expect(page.getByLabel("badge-example.tsx code")).toContainText(
      'import { Badge } from "@/components/ui/badge"',
    )
  })

  test("components follow the color theme", async ({ page }) => {
    await gotoHydrated(page, "/components/button")
    const button = preview(page).getByRole("button", { name: "Save" })
    const before = await button.evaluate((el) => getComputedStyle(el).backgroundColor)
    await page.getByRole("button", { name: "Color theme" }).click()
    await page.locator("label", { has: page.getByRole("radio", { name: "Blue" }) }).click()
    await expect
      .poll(() => button.evaluate((el) => getComputedStyle(el).backgroundColor))
      .not.toBe(before)
  })
})
