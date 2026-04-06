import { test, expect } from "@playwright/test";

test.describe("Page navigation", () => {
  test("homepage loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Home.*NoorinALabs/);
  });

  test("navigate from homepage to about", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/about"]');
    await expect(page).toHaveURL(/\/about/);
    await expect(page).toHaveTitle(/About.*NoorinALabs/);
  });

  test("navigate from homepage to isnad-graph project", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/projects/isnad-graph"]');
    await expect(page).toHaveURL(/\/projects\/isnad-graph/);
    await expect(page).toHaveTitle(/Isnad Graph.*NoorinALabs/);
  });

  test("logo links back to homepage", async ({ page }) => {
    await page.goto("/about");
    await page.click('a[aria-label="NoorinALabs home"]');
    await expect(page).toHaveURL("/");
  });
});
