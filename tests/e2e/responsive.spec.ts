import { test, expect } from "@playwright/test";

test.describe("Responsive behavior", () => {
  test("hero section is visible on all viewports", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator(".hero");
    await expect(hero).toBeVisible();
  });

  test("navigation is visible", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator('nav[aria-label="Primary navigation"]');
    await expect(nav).toBeVisible();
  });

  test("footer is visible", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator('footer[role="contentinfo"]');
    await expect(footer).toBeVisible();
  });

  test("capability cards are rendered", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator(".capability-card");
    await expect(cards).toHaveCount(5);
  });

  test("partnership cards are rendered", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator(".partnership-card");
    await expect(cards).toHaveCount(3);
  });
});
