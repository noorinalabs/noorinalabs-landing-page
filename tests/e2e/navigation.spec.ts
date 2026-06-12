import { test, expect, type Page } from "@playwright/test";

/*
 * On viewports below 640px the primary-nav list is collapsed behind a toggle
 * (#60 mobile hamburger). Tests that exercise header links must first open
 * the menu — except where they target the footer or the logo, which remain
 * visible at all sizes.
 */
async function openMobileNavIfNeeded(page: Page) {
  if ((page.viewportSize()?.width ?? 0) < 640) {
    await page.locator("[data-nav-toggle]").click();
    await expect(page.locator("#primary-nav")).toBeVisible();
  }
}

test.describe("Page navigation", () => {
  test("homepage loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Home.*Noorina Labs/);
  });

  test("navigate from homepage to the team page", async ({ page }) => {
    await page.goto("/");
    await openMobileNavIfNeeded(page);
    await page.locator('#primary-nav a[href="/team"]').click();
    await expect(page).toHaveURL(/\/team/);
    await expect(page).toHaveTitle(/The Team.*Noorina Labs/);
  });

  test("navigate from homepage to isnad-graph project", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/projects/isnad-graph"]');
    await expect(page).toHaveURL(/\/projects\/isnad-graph/);
    await expect(page).toHaveTitle(/Isnad Graph.*Noorina Labs/);
  });

  test("logo links back to homepage", async ({ page }) => {
    await page.goto("/team");
    await page.click('a[aria-label="Noorina Labs home"]');
    await expect(page).toHaveURL("/");
  });
});
